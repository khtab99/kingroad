<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'country' => $request->country,
                'password' => Hash::make($request->password),
                'is_active' => true,
            ]);

            $token = $user->createToken('auth-token', ['*'])->plainTextToken;
            $user->update(['last_login_at' => now()]);

            return handleSuccessReponse(1, 'User registered successfully', [
                'user' => new UserResource($user),
                'token' => $token
            ]);
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            $credentials = $request->only('email', 'password');

            if (!Auth::attempt($credentials)) {
                return handleErrorResponse(0, 'Invalid credentials');
            }

            $user = Auth::user();
            
            if (!$user->is_active) {
                return handleErrorResponse(0, 'Your account has been deactivated');
            }

            $user->update(['last_login_at' => now()]);
            $token = $user->createToken('auth-token', ['*'])->plainTextToken;

            return handleSuccessReponse(1, 'Login successful', [
                'user' => new UserResource($user),
                'token' => $token
            ]);
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    public function profile()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return handleErrorResponse(0, 'User not found');
            }

            return handleSuccessReponse(1, 'Profile retrieved successfully', [
                'user' => new UserResource($user)
            ]);
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        try {
            $user = Auth::user();
            
            $data = $request->only([
                'name',
                'email',
                'phone',
                'country',
                'language',
                'preferences'
            ]);

            if ($request->filled('password')) {
                $data['password'] = Hash::make($request->password);
            }

            $user->update($data);

            return handleSuccessReponse(1, 'Profile updated successfully', [
                'user' => new UserResource($user)
            ]);
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    public function refresh()
    {
        try {
            $token = JWTAuth::refresh();

            return handleSuccessReponse(1, 'Token refreshed successfully', [
                'token' => [
                    'access_token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => config('jwt.ttl') * 60,
                ]
            ]);
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return handleErrorResponse(0, 'User not found');
            }

            $user->currentAccessToken()->delete();
            return handleSuccessReponse(1, 'Successfully logged out');
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Password reset link sent to your email',
            ]);
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Password reset successfully',
            ]);
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }

    public function deleteAccount()
    {
        $user = auth()->user();
        
        // Soft delete or anonymize user data
        $user->update([
            'name' => 'Deleted User',
            'email' => 'deleted_' . $user->id . '@example.com',
            'phone' => null,
            'is_active' => false,
        ]);

        JWTAuth::invalidate();

        return response()->json([
            'message' => 'Account deleted successfully',
        ]);
    }
}