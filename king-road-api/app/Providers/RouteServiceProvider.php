<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as LaravelRouteServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

class RouteServiceProvider extends LaravelRouteServiceProvider
{
    public const HOME = '/home';

    protected $namespace = 'App\Http\Controllers';

    public function boot()
    {
        parent::boot();
        
        $this->configureRateLimiting();
    }

    public function mapApiRoutes(): void
    {
        Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/api.php'));
    }

    public function mapWebRoutes(): void
    {
        Route::middleware('web')
            ->namespace($this->namespace)
            ->group(base_path('routes/web.php'));
    }

    protected function configureRateLimiting(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return RateLimiter::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
