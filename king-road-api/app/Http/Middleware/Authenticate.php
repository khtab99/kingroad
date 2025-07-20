<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class Authenticate
{
    public function handle(Request $request, Closure $next, ...$guards)
    {
        try {
            if (empty($guards)) {
                $guards = [null];
            }

            foreach ($guards as $guard) {
                if ($guard === 'admin') {
                    // Handle admin authentication
                    if ($token = JWTAuth::parseToken()) {
                        try {
                            $admin = $token->authenticate();
                            
                            if (!$admin) {
                                return handleErrorResponse(0, 'Admin not found');
                            }

                            if (!$admin instanceof \App\Models\Admin) {
                                return handleErrorResponse(0, 'Invalid admin token');
                            }
                            
                            if (!$admin->is_active) {
                                return handleErrorResponse(0, 'Admin account is deactivated');
                            }
                            
                            return $next($request);
                        } catch (TokenExpiredException $e) {
                            return handleErrorResponse(0, 'Admin token has expired');
                        } catch (TokenInvalidException $e) {
                            return handleErrorResponse(0, 'Admin token is invalid');
                        } catch (JWTException $e) {
                            return handleErrorResponse(0, 'Admin token not found');
                        }
                    }
                } else {
                    // Handle user authentication
                    if ($token = JWTAuth::parseToken()) {
                        try {
                            $user = $token->authenticate();
                            
                            if (!$user) {
                                return handleErrorResponse(0, 'User not found');
                            }

                            if (!$user instanceof \App\Models\User) {
                                return handleErrorResponse(0, 'Invalid user token');
                            }
                            
                            if (!$user->is_active) {
                                return handleErrorResponse(0, 'User account is deactivated');
                            }
                            
                            return $next($request);
                        } catch (TokenExpiredException $e) {
                            return handleErrorResponse(0, 'Token has expired');
                        } catch (TokenInvalidException $e) {
                            return handleErrorResponse(0, 'Token is invalid');
                        } catch (JWTException $e) {
                            return handleErrorResponse(0, 'Token not found');
                        }
                    }
                }
            }

            return handleErrorResponse(0, 'Unauthorized');
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }
}