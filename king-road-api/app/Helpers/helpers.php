<?php 

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\QueryException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;


/**
 * Write code on Method
 *
 * @return response()
 */
if (!function_exists('handleSuccessReponse')) {
    function handleSuccessReponse($status, $message = "", $data = [])
    {
        //    $status == true ? $status = 1: $status = 0;
        return response()->json(
            [
                'status' => $status,
                'message' => $message,
                'data' => $data
            ]
        );
    }
}

function handleErrorResponse($status = 0, $exception = "")
{
    // If it's an exception, check its type
    if ($exception instanceof Throwable) {
        if ($exception instanceof ModelNotFoundException) {
            return response()->json([
                'status' => $status,
                'message' => 'Resource not found',
                'data' => null
            ], Response::HTTP_NOT_FOUND);
        }

        if ($exception instanceof NotFoundHttpException) {
            return response()->json([
                'status' => $status,
                'message' => 'Endpoint not found',
                'data' => null
            ], Response::HTTP_NOT_FOUND);
        }

        if ($exception instanceof MethodNotAllowedHttpException) {
            return response()->json([
                'status' => $status,
                'message' => 'Method not allowed',
                'data' => null
            ], Response::HTTP_METHOD_NOT_ALLOWED);
        }

        if ($exception instanceof AuthenticationException) {
            return response()->json([
                'status' => $status,
                'message' => 'Unauthenticated',
                'data' => null
            ], Response::HTTP_UNAUTHORIZED);
        }

        if ($exception instanceof ValidationException) {
            return response()->json([
                'status' => $status,
                'message' => 'Validation failed',
                'messages' => $exception->errors(),
                'data' => null
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($exception instanceof ThrottleRequestsException) {
            return response()->json([
                'status' => $status,
                'message' => 'Too many requests',
                'data' => null
            ], Response::HTTP_TOO_MANY_REQUESTS);
        }

        if ($exception instanceof QueryException) {
            return response()->json([
                'status' => $status,
                'message' => 'Database error: ' . $exception->getMessage(),
                'data' => null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        if ($exception instanceof Error) {
            return response()->json([
                'status' => $status,
                'message' => $exception->getMessage(),
                'data' => null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Fallback for unrecognized exceptions
        return response()->json([
            'status' => $status,
            'message' => $exception->getMessage(),
            'data' => null
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    // If it's just a string (e.g., a custom error message)
    return response()->json([
        'status' => $status,
        'message' => $exception,
        'data' => null
    ], Response::HTTP_BAD_REQUEST); // Use 400 instead of 500
}