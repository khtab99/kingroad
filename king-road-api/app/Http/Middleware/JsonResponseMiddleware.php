<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JsonResponseMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        try {
            // Only handle if it's an API route
            if (str_starts_with($request->path(), 'api/')) {
                $response = $next($request);
                
                // If the response is not already JSON
                if (!$response instanceof Response || $response->headers->get('Content-Type') !== 'application/json') {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Internal server error',
                        'error' => $response->getContent(),
                    ], 500);
                }
                
                return $response;
            }
            
            // For non-API routes, just pass through
            return $next($request);
        } catch (\Exception $e) {
            // Only return JSON for API routes
            if (str_starts_with($request->path(), 'api/')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Internal server error',
                    'error' => $e->getMessage(),
                ], 500);
            }
            
            // For non-API routes, throw the exception to let Laravel handle it
            throw $e;
        }
    }
}
