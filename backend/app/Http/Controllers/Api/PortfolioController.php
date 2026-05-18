<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use App\Models\Transaction;
use App\Models\Advice;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PortfolioController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Portfolio::where('user_id', $user->id);

        // Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('asset_name', 'like', "%{$request->search}%")
                  ->orWhere('asset_type', 'like', "%{$request->search}%")
                  ->orWhere('ticker_symbol', 'like', "%{$request->search}%");
            });
        }

        // Filter by type
        if ($request->asset_type) {
            $query->where('asset_type', $request->asset_type);
        }

        // Filter by risk
        if ($request->risk_level) {
            $query->where('risk_level', $request->risk_level);
        }

        // Sort
        $sortBy = $request->sort_by ?? 'created_at';
        $sortDir = $request->sort_dir ?? 'desc';
        $allowedSorts = ['asset_name', 'asset_type', 'quantity', 'buy_price', 'current_price', 'purchase_date', 'created_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDir);
        }

        $perPage = $request->per_page ?? 10;
        $portfolios = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $portfolios,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'asset_name' => 'required|string|max:255',
            'asset_type' => 'required|in:stocks,crypto,gold,bonds,mutual_funds',
            'quantity' => 'required|numeric|min:0.000001',
            'buy_price' => 'required|numeric|min:0',
            'current_price' => 'required|numeric|min:0',
            'purchase_date' => 'required|date',
            'notes' => 'nullable|string',
            'ticker_symbol' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $data['user_id'] = $request->user()->id;
        $data['risk_level'] = Portfolio::getRiskLevelForAssetType($data['asset_type']);

        $portfolio = Portfolio::create($data);

        // Log transaction
        Transaction::create([
            'user_id' => $request->user()->id,
            'portfolio_id' => $portfolio->id,
            'action' => 'buy',
            'amount' => $portfolio->investment_amount,
            'quantity' => $portfolio->quantity,
            'price' => $portfolio->buy_price,
            'asset_name' => $portfolio->asset_name,
        ]);

        // Generate advice
        $this->generateAdvice($request->user());

        return response()->json([
            'status' => 'success',
            'message' => 'Investment added successfully',
            'data' => $portfolio,
        ], 201);
    }

    public function show(Request $request, Portfolio $portfolio)
    {
        if ($portfolio->user_id !== $request->user()->id) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $portfolio->load('transactions');

        return response()->json([
            'status' => 'success',
            'data' => $portfolio,
        ]);
    }

    public function update(Request $request, Portfolio $portfolio)
    {
        if ($portfolio->user_id !== $request->user()->id) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'asset_name' => 'sometimes|string|max:255',
            'asset_type' => 'sometimes|in:stocks,crypto,gold,bonds,mutual_funds',
            'quantity' => 'sometimes|numeric|min:0.000001',
            'buy_price' => 'sometimes|numeric|min:0',
            'current_price' => 'sometimes|numeric|min:0',
            'purchase_date' => 'sometimes|date',
            'notes' => 'nullable|string',
            'ticker_symbol' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        if (isset($data['asset_type'])) {
            $data['risk_level'] = Portfolio::getRiskLevelForAssetType($data['asset_type']);
        }

        $portfolio->update($data);

        // Log transaction
        Transaction::create([
            'user_id' => $request->user()->id,
            'portfolio_id' => $portfolio->id,
            'action' => 'update',
            'amount' => $portfolio->fresh()->current_value,
            'quantity' => $portfolio->quantity,
            'price' => $portfolio->current_price,
            'asset_name' => $portfolio->asset_name,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Investment updated successfully',
            'data' => $portfolio->fresh(),
        ]);
    }

    public function destroy(Request $request, Portfolio $portfolio)
    {
        if ($portfolio->user_id !== $request->user()->id) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        // Log sell transaction
        Transaction::create([
            'user_id' => $request->user()->id,
            'portfolio_id' => $portfolio->id,
            'action' => 'sell',
            'amount' => $portfolio->current_value,
            'quantity' => $portfolio->quantity,
            'price' => $portfolio->current_price,
            'asset_name' => $portfolio->asset_name,
        ]);

        $portfolio->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Investment removed successfully',
        ]);
    }

    public function summary(Request $request)
    {
        $user = $request->user();
        $portfolios = Portfolio::where('user_id', $user->id)->get();

        $totalInvestment = $portfolios->sum(fn($p) => $p->investment_amount);
        $totalCurrentValue = $portfolios->sum(fn($p) => $p->current_value);
        $totalProfitLoss = $totalCurrentValue - $totalInvestment;
        $roi = $totalInvestment > 0 ? ($totalProfitLoss / $totalInvestment) * 100 : 0;

        // Risk distribution
        $riskDistribution = $portfolios->groupBy('risk_level')->map(fn($group) => [
            'count' => $group->count(),
            'value' => $group->sum(fn($p) => $p->current_value),
        ]);

        // Asset allocation
        $assetAllocation = $portfolios->groupBy('asset_type')->map(fn($group) => [
            'count' => $group->count(),
            'value' => $group->sum(fn($p) => $p->current_value),
            'percentage' => $totalCurrentValue > 0
                ? ($group->sum(fn($p) => $p->current_value) / $totalCurrentValue) * 100
                : 0,
        ]);

        // Risk score (weighted average)
        $riskScore = $this->calculateRiskScore($portfolios, $totalCurrentValue);

        // Monthly performance (last 6 months simulated)
        $monthlyData = $this->getMonthlyPerformance($user->id);

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_investment' => round($totalInvestment, 2),
                'total_current_value' => round($totalCurrentValue, 2),
                'total_profit_loss' => round($totalProfitLoss, 2),
                'roi' => round($roi, 2),
                'risk_score' => $riskScore,
                'risk_distribution' => $riskDistribution,
                'asset_allocation' => $assetAllocation,
                'monthly_performance' => $monthlyData,
                'total_assets' => $portfolios->count(),
            ],
        ]);
    }

    private function calculateRiskScore($portfolios, float $totalValue): int
    {
        if ($portfolios->isEmpty() || $totalValue === 0.0) return 0;

        $weights = ['low' => 1, 'medium' => 5, 'high' => 10];
        $weightedSum = $portfolios->sum(fn($p) => ($weights[$p->risk_level] ?? 5) * $p->current_value);
        $rawScore = $weightedSum / $totalValue;

        return (int) min(100, ($rawScore / 10) * 100);
    }

    private function getMonthlyPerformance(int $userId): array
    {
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $months[] = [
                'month' => $date->format('M Y'),
                'value' => 0,
                'investment' => 0,
            ];
        }

        $transactions = Transaction::where('user_id', $userId)
            ->orderBy('created_at')
            ->get();

        foreach ($months as &$month) {
            $monthDate = \Carbon\Carbon::createFromFormat('M Y', $month['month']);
            $relevantTx = $transactions->filter(fn($t) =>
                $t->created_at->lte($monthDate->endOfMonth())
            );
            $month['investment'] = $relevantTx->where('action', 'buy')->sum('amount');
            $month['value'] = $month['investment'] * (1 + (rand(-5, 15) / 100));
        }

        return $months;
    }

    private function generateAdvice(User $user): void
    {
        $portfolios = Portfolio::where('user_id', $user->id)->get();

        if ($portfolios->isEmpty()) return;

        $assetTypes = $portfolios->pluck('asset_type')->unique();
        $highRiskValue = $portfolios->where('risk_level', 'high')->sum(fn($p) => $p->current_value);
        $totalValue = $portfolios->sum(fn($p) => $p->current_value);
        $highRiskPercent = $totalValue > 0 ? ($highRiskValue / $totalValue) * 100 : 0;

        if ($highRiskPercent > 60) {
            Advice::create([
                'user_id' => $user->id,
                'message' => "Your portfolio has {$highRiskPercent}% in high-risk assets. Consider rebalancing with bonds or gold for stability.",
                'risk_level' => 'high',
                'category' => 'rebalance',
            ]);
        }

        if ($assetTypes->count() < 3) {
            Advice::create([
                'user_id' => $user->id,
                'message' => 'Diversify your portfolio across more asset types to reduce risk and improve returns.',
                'risk_level' => 'medium',
                'category' => 'diversification',
            ]);
        }
    }

    public function updatePrice(Request $request, Portfolio $portfolio)
    {
        if ($portfolio->user_id !== $request->user()->id) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'current_price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $portfolio->update(['current_price' => $request->current_price]);

        return response()->json([
            'status' => 'success',
            'message' => 'Price updated',
            'data' => $portfolio->fresh(),
        ]);
    }
}
