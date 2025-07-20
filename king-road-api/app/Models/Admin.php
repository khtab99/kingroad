<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class Admin extends Authenticatable 
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'last_login_at',
        'permissions',
    ];

    protected $guard = 'admin';

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'is_active' => 'boolean',
        'permissions' => 'array',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
            'permissions' => $this->permissions
        ];
    }

    public function getRememberToken()
    {
        return $this->remember_token;
    }

    public function setRememberToken($value)
    {
        $this->remember_token = $value;
    }

    public function getRememberTokenName()
    {
        return 'remember_token';
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function updateLastLogin()
    {
        $this->last_login_at = now();
        $this->save();
    }

    public function hasPermission($permission)
    {
        if ($this->role === 'super_admin') {
            return true;
        }

        return in_array($permission, $this->permissions ?? []);
    }

    public function canAccess($resource, $action)
    {
        if ($this->role === 'super_admin') {
            return true;
        }

        $rolePermissions = [
            'admin' => [
                'products' => ['create', 'read', 'update', 'delete'],
                'orders' => ['read', 'update'],
                'customers' => ['read', 'update'],
                'inventory' => ['read', 'update'],
                'analytics' => ['read'],
            ],
            'moderator' => [
                'products' => ['read', 'update'],
                'orders' => ['read', 'update'],
                'customers' => ['read'],
                'inventory' => ['read'],
            ],
            'viewer' => [
                'products' => ['read'],
                'orders' => ['read'],
                'customers' => ['read'],
                'analytics' => ['read'],
            ],
        ];

        $permissions = $rolePermissions[$this->role] ?? [];
        $resourcePermissions = $permissions[$resource] ?? [];

        return in_array($action, $resourcePermissions);
    }
}