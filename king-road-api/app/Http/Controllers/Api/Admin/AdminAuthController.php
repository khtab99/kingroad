<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminLoginRequest;
use App\Http\Resources\AdminResource;
use App\Models\Admin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Exception;

class AdminAuthController extends Controller
{
    /**
     * Admin login
     */
    public function login(AdminLoginRequest $request): JsonResponse
    {
        Log::error('Something went wrong');
        try {
            // Find admin by email
            $admin = Admin::where('email', $request->email)->first();

            dd($admin);
            
            // Check credentials
            if (!$admin || !Hash::check($request->password, $admin->password)) {
                // Log failed login attempt
                Log::warning('Admin login failed - Invalid credentials', [
                    'email' => $request->email,
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent()
                ]);
                
                return $this->handleErrorResponse(0, 'Invalid email or password');
            }

            // Check if admin is active
            if (!$admin->is_active) {
                Log::warning('Admin login failed - Account inactive', [
                    'admin_id' => $admin->id,
                    'email' => $admin->email,
                    'ip' => $request->ip()
                ]);
                
                return $this->handleErrorResponse(0, 'Your admin account has been deactivated. Please contact super admin.');
            }

            // Revoke existing tokens (optional - for single session)
            // $admin->tokens()->delete();

            // Create Sanctum token
            $token = $admin->createToken('admin-token', ['admin'])->plainTextToken;
            
            // Update last login timestamp
            $admin->update([
                'last_login_at' => now(),
                'last_login_ip' => $request->ip()
            ]);

            // Log successful login
            Log::info('Admin login successful', [
                'admin_id' => $admin->id,
                'email' => $admin->email,
                'ip' => $request->ip()
            ]);

            return $this->handleSuccessResponse(1, 'Admin login successful', [
                'admin' => new AdminResource($admin->fresh()),
                'token' => $token,
                'token_type' => 'Bearer'
            ]);

        } catch (Exception $e) {
            Log::error('Admin login failed - General Error', [
                'email' => $request->email ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->handleErrorResponse(0, 'Login failed. Please try again.');
        }
    }

    /**
     * Get admin profile
     */
    public function profile(): JsonResponse
    {
        try {
            $admin = Auth::guard('sanctum')->user();
            
            if (!$admin) {
                return $this->handleErrorResponse(0, 'Admin not authenticated');
            }

            // Check if admin is still active
            if (!$admin->is_active) {
                return $this->handleErrorResponse(0, 'Your admin account has been deactivated');
            }

            return $this->handleSuccessResponse(1, 'Admin profile retrieved successfully', [
                'admin' => new AdminResource($admin)
            ]);

        } catch (Exception $e) {
            Log::error('Admin profile retrieval failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->handleErrorResponse(0, 'Failed to retrieve profile');
        }
    }

    /**
     * Update admin profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:admins,email,' . Auth::guard('sanctum')->id(),
            'password' => 'sometimes|required|min:8|confirmed',
            'phone' => 'sometimes|nullable|string|max:20',
        ]);

        DB::beginTransaction();
        
        try {
            $admin = Auth::guard('sanctum')->user();
            
            if (!$admin) {
                return $this->handleErrorResponse(0, 'Admin not authenticated');
            }

            $data = $request->only(['name', 'email', 'phone']);
            
            // Hash password if provided
            if ($request->filled('password')) {
                $data['password'] = Hash::make($request->password);
            }

            // Check if email is being changed and if it's already taken
            if (isset($data['email']) && $data['email'] !== $admin->email) {
                $existingAdmin = Admin::where('email', $data['email'])->where('id', '!=', $admin->id)->first();
                if ($existingAdmin) {
                    return $this->handleErrorResponse(0, 'Email is already taken by another admin');
                }
            }

            $admin->update($data);
            
            DB::commit();

            Log::info('Admin profile updated', [
                'admin_id' => $admin->id,
                'updated_fields' => array_keys($data)
            ]);

            return $this->handleSuccessResponse(1, 'Profile updated successfully', [
                'admin' => new AdminResource($admin->fresh())
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Admin profile update failed', [
                'admin_id' => Auth::guard('sanctum')->id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->handleErrorResponse(0, 'Failed to update profile');
        }
    }

    /**
     * Refresh admin token (create new token)
     */
    public function refresh(): JsonResponse
    {
        try {
            $admin = Auth::guard('sanctum')->user();
            
            if (!$admin) {
                return $this->handleErrorResponse(0, 'Admin not authenticated');
            }

            // Delete current token
            $admin->currentAccessToken()->delete();
            
            // Create new token
            $token = $admin->createToken('admin-token', ['admin'])->plainTextToken;

            return $this->handleSuccessResponse(1, 'Admin token refreshed successfully', [
                'token' => $token,
                'token_type' => 'Bearer'
            ]);

        } catch (Exception $e) {
            Log::error('Admin token refresh failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->handleErrorResponse(0, 'Token refresh failed. Please try again.');
        }
    }

    /**
     * Admin logout
     */
    public function logout(): JsonResponse
    {
        try {
            $admin = Auth::guard('sanctum')->user();
            
            if (!$admin) {
                return $this->handleErrorResponse(0, 'Admin not authenticated');
            }

            // Delete current token
            $admin->currentAccessToken()->delete();

            // Log logout
            Log::info('Admin logout successful', [
                'admin_id' => $admin->id,
                'email' => $admin->email
            ]);

            return $this->handleSuccessResponse(1, 'Admin successfully logged out');

        } catch (Exception $e) {
            Log::error('Admin logout failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->handleErrorResponse(0, 'Logout failed. Please try again.');
        }
    }

    /**
     * Logout from all devices
     */
    public function logoutAll(): JsonResponse
    {
        try {
            $admin = Auth::guard('sanctum')->user();
            
            if (!$admin) {
                return $this->handleErrorResponse(0, 'Admin not authenticated');
            }

            // Delete all tokens
            $admin->tokens()->delete();

            Log::info('Admin logout from all devices', [
                'admin_id' => $admin->id,
                'email' => $admin->email
            ]);

            return $this->handleSuccessResponse(1, 'Admin successfully logged out from all devices');

        } catch (Exception $e) {
            Log::error('Admin logout all failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->handleErrorResponse(0, 'Logout failed. Please try again.');
        }
    }

    /**
     * Change admin password
     */
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        DB::beginTransaction();
        
        try {
            $admin = Auth::guard('sanctum')->user();
            
            if (!$admin) {
                return $this->handleErrorResponse(0, 'Admin not authenticated');
            }

            // Verify current password
            if (!Hash::check($request->current_password, $admin->password)) {
                return $this->handleErrorResponse(0, 'Current password is incorrect');
            }

            // Update password
            $admin->update([
                'password' => Hash::make($request->new_password)
            ]);

            DB::commit();

            Log::info('Admin password changed', [
                'admin_id' => $admin->id,
                'email' => $admin->email
            ]);

            return $this->handleSuccessResponse(1, 'Password changed successfully');

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Admin password change failed', [
                'admin_id' => Auth::guard('sanctum')->id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->handleErrorResponse(0, 'Failed to change password');
        }
    }

    /**
     * Get admin sessions (active tokens)
     */
    public function sessions(): JsonResponse
    {
        try {
            $admin = Auth::guard('sanctum')->user();
            
            if (!$admin) {
                return $this->handleErrorResponse(0, 'Admin not authenticated');
            }

            $sessions = $admin->tokens()->select([
                'id',
                'name',
                'last_used_at',
                'created_at'
            ])->get();

            return $this->handleSuccessResponse(1, 'Admin sessions retrieved successfully', [
                'sessions' => $sessions
            ]);

        } catch (Exception $e) {
            Log::error('Admin sessions retrieval failed', [
                'error' => $e->getMessage()
            ]);
            
            return $this->handleErrorResponse(0, 'Failed to retrieve sessions');
        }
    }

    /**
     * Revoke specific token
     */
    public function revokeToken(Request $request): JsonResponse
    {
        $request->validate([
            'token_id' => 'required|integer'
        ]);

        try {
            $admin = Auth::guard('sanctum')->user();
            
            if (!$admin) {
                return $this->handleErrorResponse(0, 'Admin not authenticated');
            }

            $token = $admin->tokens()->find($request->token_id);
            
            if (!$token) {
                return $this->handleErrorResponse(0, 'Token not found');
            }

            $token->delete();

            Log::info('Admin token revoked', [
                'admin_id' => $admin->id,
                'token_id' => $request->token_id
            ]);

            return $this->handleSuccessResponse(1, 'Token revoked successfully');

        } catch (Exception $e) {
            Log::error('Admin token revocation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->handleErrorResponse(0, 'Failed to revoke token');
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