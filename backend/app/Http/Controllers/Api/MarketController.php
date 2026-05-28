<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Advice;
use App\Models\Portfolio;
use App\Models\Transaction;
use App\Services\InvestmentCatalog;
use App\Services\RiskAnalysisService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MarketController extends Controller
{
    public function __construct(private readonly RiskAnalysisService $riskAnalysisService)
    {
    }

    public function assets(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data' => InvestmentCatalog::all(),
        ]);
    }

    public function portfolio(Request $request)
    {
        $portfolios = Portfolio::where('user_id', $request->user()->id)
            ->latest('updated_at')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $portfolios,
            'summary' => $this->buildSummary($portfolios),
        ]);
    }

    public function transactions(Request $request)
    {
        $transactions = Transaction::where('user_id', $request->user()->id)
            ->latest()
            ->paginate($request->integer('per_page', 20));

        return response()->json([
            'status' => 'success',
            'data' => $transactions,
        ]);
    }

    public function riskAnalysis(Request $request)
    {
        $portfolios = Portfolio::where('user_id', $request->user()->id)->get();
        $analysis = $this->riskAnalysisService->analyze($portfolios);

        return response()->json([
            'status' => 'success',
            'data' => $analysis,
        ]);
    }

    public function addInvestment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'asset_name' => 'required|string|max:255',
            'asset_type' => 'required|string|in:stocks,crypto,etf,mutual_funds,commodities,gold,bonds',
            'symbol' => 'required|string|max:30',
            'quantity' => 'required|numeric|min:0.0001',
            'buy_price' => 'required|numeric|min:0.01',
            'current_price' => 'required|numeric|min:0.01',
            'risk_level' => 'required|string|in:low,medium,high',
            'sector' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $data = $validator->validated();

        $portfolio = Portfolio::create([
            'user_id' => $user->id,
            'asset_name' => $data['asset_name'],
            'asset_type' => $data['asset_type'],
            'ticker_symbol' => $data['symbol'],
            'quantity' => $data['quantity'],
            'buy_price' => $data['buy_price'],
            'current_price' => $data['current_price'],
            'risk_level' => $data['risk_level'],
            'purchase_date' => now(),
            'notes' => $data['notes'] ?? null,
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'portfolio_id' => $portfolio->id,
            'action' => 'buy',
            'amount' => $portfolio->investment_amount,
            'quantity' => $portfolio->quantity,
            'price' => $portfolio->buy_price,
            'asset_name' => $portfolio->asset_name,
            'notes' => 'Added from smart dashboard quick action',
        ]);

        $analysis = $this->riskAnalysisService->analyze(Portfolio::where('user_id', $user->id)->get());

        Advice::create([
            'user_id' => $user->id,
            'message' => $analysis['riskLevel'] === 'high'
                ? 'Risk has increased after this investment. Consider rebalancing with ETFs or defensive assets.'
                : 'Good addition. Keep monitoring exposure and diversification across asset classes.',
            'risk_level' => $analysis['riskLevel'],
            'category' => 'quick_add',
            'is_read' => false,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Investment added successfully',
            'data' => $portfolio->fresh(),
            'risk_analysis' => $analysis,
        ], 201);
    }

    public function removeInvestment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'portfolio_id' => 'nullable',
            'symbol' => 'nullable|string|max:30',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        if (!$request->filled('portfolio_id') && !$request->filled('symbol')) {
            return response()->json([
                'status' => 'error',
                'message' => 'portfolio_id or symbol is required',
            ], 422);
        }

        $query = Portfolio::where('user_id', $request->user()->id);
        if ($request->filled('portfolio_id') && is_numeric($request->portfolio_id)) {
            $query->where('id', $request->portfolio_id);
        } else {
            $query->where('ticker_symbol', strtoupper((string) $request->symbol));
        }

        $portfolio = $query->firstOrFail();

        Transaction::create([
            'user_id' => $request->user()->id,
            'portfolio_id' => $portfolio->id,
            'action' => 'sell',
            'amount' => $portfolio->current_value,
            'quantity' => $portfolio->quantity,
            'price' => $portfolio->current_price,
            'asset_name' => $portfolio->asset_name,
            'notes' => 'Removed from smart dashboard action',
        ]);

        $portfolio->delete();

        $analysis = $this->riskAnalysisService->analyze(Portfolio::where('user_id', $request->user()->id)->get());

        return response()->json([
            'status' => 'success',
            'message' => 'Investment removed successfully',
            'risk_analysis' => $analysis,
        ]);
    }

    private function buildSummary($portfolios): array
    {
        $analysis = $this->riskAnalysisService->analyze($portfolios);

        return [
            'total_investment' => round($portfolios->sum(fn ($p) => $p->investment_amount), 2),
            'total_current_value' => round($portfolios->sum(fn ($p) => $p->current_value), 2),
            'total_profit_loss' => round($portfolios->sum(fn ($p) => $p->profit_loss), 2),
            'roi' => round($portfolios->sum(fn ($p) => $p->roi), 2),
            'total_assets' => $portfolios->count(),
            'risk_score' => $analysis['riskScore'],
            'risk_level' => $analysis['riskLevel'],
        ];
    }
}
