<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

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
            ]);

            $token = JWTAuth::fromUser($user);
            $user->updateLastLogin();

            return handleSuccessReponse(1, 'User registered successfully', [
                'user' => new UserResource($user),
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

    public function login(LoginRequest $request)
    {
        try {
            $credentials = $request->only('email', 'password');

            if (!$token = JWTAuth::attempt($credentials)) {
                return handleErrorResponse(0, 'Invalid credentials');
            }

            $user = auth()->user();
            
            if (!$user->is_active) {
                return handleErrorResponse(0, 'Your account has been deactivated');
            }

            $user->updateLastLogin();

            return handleSuccessReponse(1, 'Login successful', [
                'user' => new UserResource($user),
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

    public function profile()
    {
        try {
            return handleSuccessReponse(1, 'Profile retrieved successfully', [
                'user' => new UserResource(auth()->user())
            ]);
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        try {
            $user = auth()->user();
            
            $data = $request->validated();
            
            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }

            $user->update($data);

            return handleSuccessReponse(1, 'Profile updated successfully', [
                'user' => new UserResource($user->fresh())
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

    public function logout()
    {
        try {
            JWTAuth::invalidate();

            return handleSuccessReponse(1, 'Successfully logged out', null);
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