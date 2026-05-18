<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'asset_name',
        'asset_type',
        'quantity',
        'buy_price',
        'current_price',
        'risk_level',
        'purchase_date',
        'notes',
        'ticker_symbol',
    ];

    protected $casts = [
        'quantity' => 'float',
        'buy_price' => 'float',
        'current_price' => 'float',
        'purchase_date' => 'date',
    ];

    protected $appends = [
        'investment_amount',
        'current_value',
        'profit_loss',
        'roi',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // Computed attributes
    public function getInvestmentAmountAttribute(): float
    {
        return $this->quantity * $this->buy_price;
    }

    public function getCurrentValueAttribute(): float
    {
        return $this->quantity * $this->current_price;
    }

    public function getProfitLossAttribute(): float
    {
        return ($this->current_price - $this->buy_price) * $this->quantity;
    }

    public function getRoiAttribute(): float
    {
        $investment = $this->investment_amount;
        return $investment > 0 ? ($this->profit_loss / $investment) * 100 : 0;
    }

    // Risk level assignment based on asset type
    public static function getRiskLevelForAssetType(string $assetType): string
    {
        return match ($assetType) {
            'crypto' => 'high',
            'stocks', 'mutual_funds' => 'medium',
            'bonds', 'gold' => 'low',
            default => 'medium',
        };
    }
}
