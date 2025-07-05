<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Validation\ValidationException;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Response as FacadeResponse;

class JsonResponseMiddleware
{
    protected $responseFactory;

    public function __construct(ResponseFactory $responseFactory)
    {
        $this->responseFactory = $responseFactory;
    }

    public function handle(Request $request, Closure $next)
    {
        try {
            // Get the response first to ensure authentication middleware runs
            $response = $next($request);
            
            // Only handle if it's an API route
            if (str_starts_with($request->path(), 'api/')) {
                // If the response is not already a JSON response
                if (!$response instanceof JsonResponse) {
                    // Handle validation errors
                    if ($response instanceof Response && $response->getStatusCode() === 422) {
                        $errors = json_decode($response->getContent(), true);
                        return $this->responseFactory->json([
                            'status' => 'error',
                            'message' => 'Validation error',
                            'errors' => $errors['errors'] ?? $errors,
                        ], 422);
                    }
                    
                    // Handle authentication errors
                    if ($response->getStatusCode() === 401) {
                        return $this->responseFactory->json([
                            'status' => 'error',
                            'message' => 'Unauthenticated',
                            'error' => 'Please provide a valid authentication token or login again',
                        ], 401);
                    }
                    
                    // Handle errors
                    if ($response->getStatusCode() >= 400) {
                        return $this->responseFactory->json([
                            'status' => 'error',
                            'message' => 'Internal server error',
                            'error' => $response->getContent(),
                        ], $response->getStatusCode());
                    }

                    // Handle successful responses
                    $content = $response->getContent();
                    
                    // If the response is a JSON resource, get its array representation
                    if ($content instanceof JsonResource) {
                        $content = $content->toArray($request);
                    }
                    
                    // If the response is a collection, convert it to array
                    if ($content instanceof Collection) {
                        $content = $content->toArray();
                    }
                    
                    // If the response is an object, convert it to array
                    if (is_object($content)) {
                        $content = (array) $content;
                    }
                    
                    // If the response is a string, try to parse it as JSON
                    if (is_string($content)) {
                        $decoded = json_decode($content, true);
                        if (json_last_error() === JSON_ERROR_NONE) {
                            $content = $decoded;
                        }
                    }
                    
                    // Return the content as JSON
                    return $this->responseFactory->json([
                        'status' => $content['status'] ?? 'success',
                        'message' => $content['message'] ?? 'Success',
                        'data' => $content['data'] ?? $content,
                    ], 200);
                }
            }
            
            return $response;
        } catch (\Exception $e) {
            // Only return JSON for API routes
            if (str_starts_with($request->path(), 'api/')) {
                return $this->responseFactory->json([
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
