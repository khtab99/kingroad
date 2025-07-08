<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Exception;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        DB::beginTransaction();
        
        try {
            // Check if user already exists
            $existingUser = User::where('email', $request->email)->first();
            if ($existingUser) {
                return $this->handleErrorResponse(0, 'User with this email already exists');
            }

            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone ?? null,
                'country' => $request->country ?? null,
                'password' => Hash::make($request->password),
                'is_active' => true,
                'email_verified_at' => now(), // Auto-verify for API registration
            ]);

            // Verify user was created
            if (!$user || !$user->exists) {
                throw new Exception('Failed to create user in database');
            }

            // Create token
            $token = $user->createToken('auth-token', ['*'])->plainTextToken;
            
            // Update last login
            $user->update(['last_login_at' => now()]);

            // Check if there's a guest cart to transfer
            $guestCartTransferred = false;
            if (session()->has('cart')) {
                $sessionCart = session()->get('cart', []);
                if (!empty($sessionCart)) {
                    // Transfer guest cart items to user's cart
                    foreach ($sessionCart as $sessionItem) {
                        $product = \App\Models\Product::find($sessionItem['product_id']);
                        
                        if ($product && $product->is_active) {
                            $quantity = $sessionItem['quantity'];
                            if ($product->track_inventory) {
                                $quantity = min($quantity, $product->inventory);
                            }
                            if ($quantity > 0) {
                                $user->cartItems()->create([
                                    'product_id' => $product->id,
                                    'quantity' => $quantity,
                                    'price' => $product->current_price,
                                ]);
                            }
                        }
                    }
                    
                    // Clear session cart after transfer
                    session()->forget('cart');
                    $guestCartTransferred = true;
                }
            }
            DB::commit();

            return $this->handleSuccessResponse(1, 'User registered successfully', [
                'user' => new UserResource($user->fresh()),
                'token' => $token,
                'token_type' => 'Bearer',
                'guest_cart_transferred' => $guestCartTransferred,
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Registration failed: ' . $e->getMessage(), [
                'email' => $request->email,
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->handleErrorResponse(0, 'Registration failed: ' . $e->getMessage());
        }
    }

    /**
     * Login user
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            // Find user by email
            $user = User::where('email', $request->email)->first();

            // Check if user exists and password is correct
            if (!$user || !Hash::check($request->password, $user->password)) {
                return $this->handleErrorResponse(0, 'Invalid email or password');
            }
            
            // Check if user is active
            if (!$user->is_active) {
                return $this->handleErrorResponse(0, 'Your account has been deactivated. Please contact support.');
            }

            // Revoke existing tokens (optional - for single session)
            // $user->tokens()->delete();

            // Create new token
            $token = $user->createToken('auth-token', ['*'])->plainTextToken;
            
            // Update last login
            $user->update(['last_login_at' => now()]);

            // Check if there's a guest cart to transfer
            $guestCartTransferred = false;
            if (session()->has('cart')) {
                $sessionCart = session()->get('cart', []);
                if (!empty($sessionCart)) {
                    // Transfer guest cart items to user's cart
                    foreach ($sessionCart as $sessionItem) {
                        $product = \App\Models\Product::find($sessionItem['product_id']);
                        
                        if ($product && $product->is_active) {
                            $existingCartItem = $user->cartItems()
                                ->where('product_id', $product->id)
                                ->first();

                            if ($existingCartItem) {
                                $newQuantity = $existingCartItem->quantity + $sessionItem['quantity'];
                                if ($product->track_inventory) {
                                    $newQuantity = min($newQuantity, $product->inventory);
                                }
                                $existingCartItem->update([
                                    'quantity' => $newQuantity,
                                    'price' => $product->current_price,
                                ]);
                            } else {
                                $quantity = $sessionItem['quantity'];
                                if ($product->track_inventory) {
                                    $quantity = min($quantity, $product->inventory);
                                }
                                if ($quantity > 0) {
                                    $user->cartItems()->create([
                                        'product_id' => $product->id,
                                        'quantity' => $quantity,
                                        'price' => $product->current_price,
                                    ]);
                                }
                            }
                        }
                    }
                    
                    // Clear session cart after transfer
                    session()->forget('cart');
                    $guestCartTransferred = true;
                }
            }
            return $this->handleSuccessResponse(1, 'Login successful', [
                'user' => new UserResource($user->fresh()),
                'token' => $token,
                'token_type' => 'Bearer',
                'guest_cart_transferred' => $guestCartTransferred,
            ]);

        } catch (Exception $e) {
            Log::error('Login failed: ' . $e->getMessage(), [
                'email' => $request->email ?? 'unknown',
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->handleErrorResponse(0, 'Login failed. Please try again.');
        }
    }

    /**
     * Get user profile
     */
    public function profile(): JsonResponse
    {
        try {
            $user = Auth::user();

            
            if (!$user) {
                return $this->handleErrorResponse(0, 'User not authenticated');
            }

            return $this->handleSuccessResponse(1, 'Profile retrieved successfully', [
                'user' => new UserResource($user)
            ]);

        } catch (Exception $e) {
            Log::error('Profile retrieval failed: ' . $e->getMessage());
            return $this->handleErrorResponse(0, 'Failed to retrieve profile');
        }
    }

    /**
     * Update user profile
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        DB::beginTransaction();
        
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->handleErrorResponse(0, 'User not authenticated');
            }

            $data = $request->only([
                'name',
                'email',
                'phone',
                'country',
                'language',
                'preferences'
            ]);

            // Hash password if provided
            if ($request->filled('password')) {
                $data['password'] = Hash::make($request->password);
            }

            // Check if email is being changed and if it's already taken
            if (isset($data['email']) && $data['email'] !== $user->email) {
                $existingUser = User::where('email', $data['email'])->where('id', '!=', $user->id)->first();
                if ($existingUser) {
                    return $this->handleErrorResponse(0, 'Email is already taken by another user');
                }
            }

            $user->update($data);

            DB::commit();

            return $this->handleSuccessResponse(1, 'Profile updated successfully', [
                'user' => new UserResource($user->fresh())
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Profile update failed: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->handleErrorResponse(0, 'Failed to update profile');
        }
    }

    /**
     * Refresh token (for Sanctum, this creates a new token)
     */
    public function refresh(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->handleErrorResponse(0, 'User not authenticated');
            }

            // Delete current token
            $user->currentAccessToken()->delete();
            
            // Create new token
            $token = $user->createToken('auth-token', ['*'])->plainTextToken;

            return $this->handleSuccessResponse(1, 'Token refreshed successfully', [
                'token' => $token,
                'token_type' => 'Bearer'
            ]);

        } catch (Exception $e) {
            Log::error('Token refresh failed: ' . $e->getMessage());
            return $this->handleErrorResponse(0, 'Failed to refresh token');
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->handleErrorResponse(0, 'User not authenticated');
            }

            // Delete current token
            $user->currentAccessToken()->delete();
            
            return $this->handleSuccessResponse(1, 'Successfully logged out');

        } catch (Exception $e) {
            Log::error('Logout failed: ' . $e->getMessage());
            return $this->handleErrorResponse(0, 'Logout failed');
        }
    }

    /**
     * Send password reset link
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        try {
            $status = Password::sendResetLink(
                $request->only('email')
            );

            if ($status === Password::RESET_LINK_SENT) {
                return $this->handleSuccessResponse(1, 'Password reset link sent to your email');
            }

            return $this->handleErrorResponse(0, __($status));

        } catch (Exception $e) {
            Log::error('Password reset link failed: ' . $e->getMessage());
            return $this->handleErrorResponse(0, 'Failed to send password reset link');
        }
    }

    /**
     * Reset password
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        try {
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password)
                    ])->save();
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return $this->handleSuccessResponse(1, 'Password reset successfully');
            }

            return $this->handleErrorResponse(0, __($status));

        } catch (Exception $e) {
            Log::error('Password reset failed: ' . $e->getMessage());
            return $this->handleErrorResponse(0, 'Failed to reset password');
        }
    }

    /**
     * Delete user account
     */
    public function deleteAccount(): JsonResponse
    {
        DB::beginTransaction();
        
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->handleErrorResponse(0, 'User not authenticated');
            }

            // Soft delete or anonymize user data
            $user->update([
                'name' => 'Deleted User',
                'email' => 'deleted_' . $user->id . '_' . time() . '@example.com',
                'phone' => null,
                'is_active' => false,
                'deleted_at' => now(),
            ]);

            // Delete all user tokens
            $user->tokens()->delete();

            DB::commit();

            return $this->handleSuccessResponse(1, 'Account deleted successfully');

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Account deletion failed: ' . $e->getMessage());
            return $this->handleErrorResponse(0, 'Failed to delete account');
        }
    }

    /**
     * Handle success response
     */
    private function handleSuccessResponse(int $status, string $message, array $data = []): JsonResponse
    {
        return response()->json([
            'success' => true,
            'status' => $status,
            'message' => $message,
            'data' => $data
        ], 200);
    }

    /**
     * Handle error response
     */
    private function handleErrorResponse(int $status, string $message): JsonResponse
    {
        return response()->json([
            'success' => false,
            'status' => $status,
            'message' => $message,
            'data' => []
        ], 400);
    }
}