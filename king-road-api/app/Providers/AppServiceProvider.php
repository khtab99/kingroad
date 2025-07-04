<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Providers\RouteServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    protected $defer = false;

    public function register()
    {
        $this->app->register(RouteServiceProvider::class);
    }

    public function boot()
    {
        //
    }
}
