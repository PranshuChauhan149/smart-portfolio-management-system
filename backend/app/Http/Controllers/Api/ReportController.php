<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use App\Models\Transaction;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function portfolioReport(Request $request)
    {
        $user = $request->user();
        $portfolios = Portfolio::where('user_id', $user->id)->get();

        $report = [
            'generated_at' => now()->toDateTimeString(),
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
            'summary' => [
                'total_investment' => round($portfolios->sum(fn($p) => $p->investment_amount), 2),
                'total_value' => round($portfolios->sum(fn($p) => $p->current_value), 2),
                'total_profit_loss' => round($portfolios->sum(fn($p) => $p->profit_loss), 2),
                'total_assets' => $portfolios->count(),
            ],
            'portfolios' => $portfolios->map(fn($p) => [
                'asset_name' => $p->asset_name,
                'asset_type' => $p->asset_type,
                'ticker' => $p->ticker_symbol,
                'quantity' => $p->quantity,
                'buy_price' => $p->buy_price,
                'current_price' => $p->current_price,
                'investment' => round($p->investment_amount, 2),
                'current_value' => round($p->current_value, 2),
                'profit_loss' => round($p->profit_loss, 2),
                'roi' => round($p->roi, 2),
                'risk_level' => $p->risk_level,
                'purchase_date' => $p->purchase_date->format('Y-m-d'),
            ]),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $report,
        ]);
    }

    public function transactionReport(Request $request)
    {
        $user = $request->user();
        $transactions = Transaction::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($t) => [
                'date' => $t->created_at->format('Y-m-d H:i'),
                'action' => $t->action,
                'asset' => $t->asset_name,
                'quantity' => $t->quantity,
                'price' => $t->price,
                'amount' => round($t->amount, 2),
            ]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'generated_at' => now()->toDateTimeString(),
                'transactions' => $transactions,
            ],
        ]);
    }
}
