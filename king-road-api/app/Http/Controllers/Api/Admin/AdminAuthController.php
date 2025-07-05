<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminLoginRequest;
use App\Http\Resources\AdminResource;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AdminAuthController extends Controller
{
    public function login(AdminLoginRequest $request)
    {
        try {
            $admin = Admin::where('email', $request->email)->first();
            
            if (!$admin || !Hash::check($request->password, $admin->password)) {
                return handleErrorResponse(0, 'Invalid credentials');
            }

            if (!$admin->is_active) {
                return handleErrorResponse(0, 'Admin account is not activated');
            }

            // Set the guard to admin for JWT
            config(['auth.defaults.guard' => 'admin']);
            
            $token = JWTAuth::fromUser($admin);
            $admin->updateLastLogin();

            return handleSuccessReponse(1, 'Admin login successful', [
                'admin' => new AdminResource($admin),
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
            $admin = auth()->user();
            
            if (!$admin) {
                return handleErrorResponse(0, 'Admin not authenticated');
            }

            return handleSuccessReponse(1, 'Admin profile retrieved successfully', [
                'admin' => new AdminResource($admin)
            ]);
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    public function refresh()
    {
        try {
            $token = JWTAuth::parseToken()->refresh();

            return handleSuccessReponse(1, 'Admin token refreshed successfully', [
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
            JWTAuth::invalidate(JWTAuth::parseToken());

            return handleSuccessReponse(1, 'Admin successfully logged out', null);
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }
}