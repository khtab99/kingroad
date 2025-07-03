<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminPermission
{
    public function handle(Request $request, Closure $next, string $role = null): Response
    {
        $admin = auth('admin')->user();

        if (!$admin) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if ($role && $admin->role !== $role && $admin->role !== 'super_admin') {
            return response()->json(['message' => 'Insufficient permissions'], 403);
        }

        return $next($request);
    }
}