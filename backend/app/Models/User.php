<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'profile_image',
        'risk_preference',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationships
    public function portfolios()
    {
        return $this->hasMany(Portfolio::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function advices()
    {
        return $this->hasMany(Advice::class);
    }

    // Helpers
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function getTotalInvestmentAttribute(): float
    {
        return $this->portfolios->sum(fn($p) => $p->quantity * $p->buy_price);
    }

    public function getTotalCurrentValueAttribute(): float
    {
        return $this->portfolios->sum(fn($p) => $p->quantity * $p->current_price);
    }

    public function getTotalProfitLossAttribute(): float
    {
        return $this->total_current_value - $this->total_investment;
    }

    public function getRoiAttribute(): float
    {
        $investment = $this->total_investment;
        return $investment > 0 ? ($this->total_profit_loss / $investment) * 100 : 0;
    }
}
