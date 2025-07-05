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
                if ($token = JWTAuth::parseToken()) {
                    try {
                        $user = $token->authenticate();
                        
                        if (!$user) {
                            throw new JWTException('User not found');
                        }
                        
                        return $next($request);
                    } catch (TokenExpiredException $e) {
                        return response()->json(['error' => 'Token has expired'], 401);
                    } catch (TokenInvalidException $e) {
                        return response()->json(['error' => 'Token is invalid'], 401);
                    } catch (JWTException $e) {
                        return response()->json(['error' => 'Token not found'], 401);
                    }
                }
            }

            return response()->json(['error' => 'Unauthorized'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
