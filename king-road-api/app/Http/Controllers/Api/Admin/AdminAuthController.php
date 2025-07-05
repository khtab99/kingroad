<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminLoginRequest;
use App\Http\Resources\AdminResource;
use App\Models\Admin;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AdminAuthController extends Controller
{
    public function login(AdminLoginRequest $request)
    {
        try {
            // Get credentials
              $admin = Admin::where('email', $request->email)->first();
            
            if (!$admin || !Hash::check($request->password, $admin->password)) {
            return handleErrorResponse(0, __("message.password"));
        }

        if ($admin->status == 0) {

            return response()->json(
                [
                    'status' => 0,
                    'message' => __("message.account_not_activated"),
                    'data' => null
                ],
                Response::HTTP_UNAUTHORIZED
            );
        }
            
          if ($admin->status == 0) {

            return response()->json(
                [
                    'status' => 0,
                    'message' => __("message.account_not_activated"),
                    'data' => null
                ],
                Response::HTTP_UNAUTHORIZED
            );
        }

        $accessToken = $admin->createToken('auth_token')->plainTextToken;
        $data = [
            'token' => [
                'access_token' => $accessToken,
                'token_type' => 'Bearer',
                'expires_in' => config('sanctum.expiration'),
            ],
            'user' => new AdminResource($admin)
        ];

        return handleSuccessReponse(1, __("message.logout_success"), $data);
        } catch (\Exception $e) {
            Log::error('Admin login error', [
                'email' => $admin['email'],
                'error' => $e->getMessage()
            ]);
            
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
        }
    }

    public function profile()
    {
        try {
            $admin = auth('admin')->user();
            
            if (!$admin) {
                return response()->json([
                    'message' => 'Admin not authenticated'
                ], 401);
            }

            return response()->json([
                'admin' => new AdminResource($admin),
            ]);
        } catch (\Exception $e) {
            Log::error('Profile fetch error', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Error fetching profile'
            ], 500);
        }
    }

    public function refresh()
    {
        try {
            $token = JWTAuth::parseToken()->refresh();

            return response()->json([
                'token' => $token,
                'token_type' => 'bearer',
                'expires_in' => config('jwt.ttl') * 60,
            ]);
        } catch (\Exception $e) {
            Log::error('Token refresh error', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Token refresh failed'
            ], 401);
        }
    }

    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::parseToken());

            return response()->json([
                'message' => 'Successfully logged out',
            ]);
        } catch (\Exception $e) {
            Log::error('Logout error', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Logout failed'
            ], 500);
        }
    }
}