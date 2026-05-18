<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Advice;
use App\Models\Portfolio;
use Illuminate\Http\Request;

class AdviceController extends Controller
{
    public function index(Request $request)
    {
        $advices = Advice::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $advices,
        ]);
    }

    public function generate(Request $request)
    {
        $user = $request->user();
        $portfolios = Portfolio::where('user_id', $user->id)->get();

        $advices = [];

        if ($portfolios->isEmpty()) {
            $advices[] = Advice::create([
                'user_id' => $user->id,
                'message' => 'Start your investment journey by adding your first asset. Even small investments grow over time!',
                'risk_level' => 'low',
                'category' => 'general',
            ]);
        } else {
            $totalValue = $portfolios->sum(fn($p) => $p->current_value);
            $highRisk = $portfolios->where('risk_level', 'high');
            $lowRisk = $portfolios->where('risk_level', 'low');
            $assetTypes = $portfolios->pluck('asset_type')->unique();

            if ($highRisk->count() > 0) {
                $highPct = ($highRisk->sum(fn($p) => $p->current_value) / $totalValue) * 100;
                if ($highPct > 50) {
                    $advices[] = Advice::create([
                        'user_id' => $user->id,
                        'message' => sprintf('%.1f%% of your portfolio is in high-risk assets. Consider adding bonds or gold to reduce volatility.', $highPct),
                        'risk_level' => 'high',
                        'category' => 'rebalance',
                    ]);
                }
            }

            if ($assetTypes->count() < 3) {
                $missing = collect(['stocks', 'crypto', 'gold', 'bonds', 'mutual_funds'])
                    ->diff($assetTypes)->take(2)->implode(', ');
                $advices[] = Advice::create([
                    'user_id' => $user->id,
                    'message' => "Diversify your portfolio by adding {$missing} to spread risk across different markets.",
                    'risk_level' => 'medium',
                    'category' => 'diversification',
                ]);
            }

            if ($lowRisk->isEmpty()) {
                $advices[] = Advice::create([
                    'user_id' => $user->id,
                    'message' => 'You have no low-risk assets. Consider adding bonds or gold (5-20% allocation) as a safety net.',
                    'risk_level' => 'medium',
                    'category' => 'rebalance',
                ]);
            }

            $losers = $portfolios->filter(fn($p) => $p->roi < -10);
            foreach ($losers as $loser) {
                $advices[] = Advice::create([
                    'user_id' => $user->id,
                    'message' => sprintf('%s is down %.1f%%. Review your position or consider averaging down if fundamentals remain strong.', $loser->asset_name, abs($loser->roi)),
                    'risk_level' => $loser->risk_level,
                    'category' => 'alert',
                ]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Investment advice generated',
            'data' => $advices,
        ]);
    }

    public function markRead(Request $request, Advice $advice)
    {
        if ($advice->user_id !== $request->user()->id) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $advice->update(['is_read' => true]);

        return response()->json(['status' => 'success', 'message' => 'Marked as read']);
    }
}
