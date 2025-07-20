<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminPermission
{
    public function handle(Request $request, Closure $next, string $role = null): Response
    {
        $admin = auth()->user();

        if (!$admin) {
            return handleErrorResponse(0, 'Unauthorized');
        }

        if (!$admin instanceof \App\Models\Admin) {
            return handleErrorResponse(0, 'Invalid admin user');
        }

        if ($role && $admin->role !== $role && $admin->role !== 'super_admin') {
            return handleErrorResponse(0, 'Insufficient permissions');
        }

        return $next($request);
    }
}