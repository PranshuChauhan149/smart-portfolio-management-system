<?php

namespace App\Services;

use Illuminate\Support\Collection;

class RiskAnalysisService
{
    public function analyze(Collection|array $portfolios): array
    {
        $items = collect($portfolios);
        $totalInvestment = (float) $items->sum('investment_amount');
        $totalCurrentValue = (float) $items->sum('current_value');
        $totalProfitLoss = (float) $items->sum('profit_loss');
        $roiValues = $items->pluck('roi')->map(fn ($value) => (float) $value);

        if ($items->isEmpty() || $totalCurrentValue <= 0) {
            return [
                'riskScore' => 0,
                'riskLevel' => 'low',
                'diversificationScore' => 0,
                'warnings' => ['Add assets to calculate live risk analysis.'],
                'suggestions' => ['Start with a diversified mix of ETFs, stocks, and defensive assets.'],
                'breakdown' => [
                    'cryptoAllocation' => 0,
                    'stockConcentration' => 0,
                    'highRiskCount' => 0,
                    'lossRatio' => 0,
                    'roiVolatility' => 0,
                ],
            ];
        }

        $riskWeights = [
            'low' => 22,
            'medium' => 54,
            'high' => 84,
        ];

        $weightedRisk = $items->sum(function ($portfolio) use ($totalCurrentValue, $riskWeights) {
            $weight = $totalCurrentValue > 0 ? ($portfolio->current_value / $totalCurrentValue) : 0;
            return ($riskWeights[$portfolio->risk_level] ?? 50) * $weight;
        });

        $assetTypeWeights = $items->groupBy('asset_type')->map(fn ($group) => $group->sum('current_value') / $totalCurrentValue * 100);
        $cryptoAllocation = (float) ($assetTypeWeights->get('crypto', 0));
        $stockConcentration = (float) ($assetTypeWeights->get('stocks', 0));
        $highRiskCount = (int) $items->where('risk_level', 'high')->count();
        $highRiskShare = $items->where('risk_level', 'high')->sum('current_value') / $totalCurrentValue * 100;
        $lossRatio = $totalCurrentValue > 0 ? max(0, -$totalProfitLoss) / $totalCurrentValue * 100 : 0;
        $roiVolatility = (float) $this->standardDeviation($roiValues);

        $diversificationScore = 100
            - min(45, $stockConcentration * 0.18)
            - min(20, $cryptoAllocation * 0.18)
            - min(18, $highRiskCount * 4)
            - min(12, $roiVolatility * 0.9);

        $riskScore = $weightedRisk
            + ($cryptoAllocation * 0.18)
            + ($highRiskShare * 0.1)
            + ($lossRatio * 0.2)
            + ($roiVolatility * 0.8);

        $riskScore = (int) round(max(0, min(100, $riskScore)));
        $diversificationScore = (int) round(max(0, min(100, $diversificationScore)));

        $riskLevel = $riskScore < 35 ? 'low' : ($riskScore < 65 ? 'medium' : 'high');

        $warnings = [];
        $suggestions = [];

        if ($cryptoAllocation > 50) {
            $warnings[] = 'Your crypto exposure is high.';
            $suggestions[] = 'Reduce crypto concentration and move part of the capital into ETFs or large-cap stocks.';
        }

        if ($stockConcentration > 60) {
            $warnings[] = 'Tech and equity concentration is elevated.';
            $suggestions[] = 'Add commodities or fixed-income assets to improve balance.';
        }

        if ($highRiskCount >= 3) {
            $warnings[] = 'You hold several high-risk assets.';
            $suggestions[] = 'Limit high-beta holdings and add lower volatility assets.';
        }

        if ($lossRatio > 15) {
            $warnings[] = 'Loss ratio is above comfortable levels.';
            $suggestions[] = 'Review losing positions and rebalance toward diversified winners.';
        }

        if ($roiVolatility > 12) {
            $warnings[] = 'Portfolio volatility increased this week.';
            $suggestions[] = 'Use staggered entries and defensive holdings to smooth performance.';
        }

        if (empty($warnings)) {
            $warnings[] = 'Portfolio is stable with balanced exposure.';
            $suggestions[] = 'Continue monitoring allocation drift and monthly performance.';
        }

        return [
            'riskScore' => $riskScore,
            'riskLevel' => $riskLevel,
            'diversificationScore' => $diversificationScore,
            'warnings' => $warnings,
            'suggestions' => $suggestions,
            'breakdown' => [
                'cryptoAllocation' => round($cryptoAllocation, 2),
                'stockConcentration' => round($stockConcentration, 2),
                'highRiskCount' => $highRiskCount,
                'lossRatio' => round($lossRatio, 2),
                'roiVolatility' => round($roiVolatility, 2),
            ],
        ];
    }

    public function standardDeviation(Collection $values): float
    {
        if ($values->count() < 2) {
            return 0.0;
        }

        $mean = $values->avg();
        $variance = $values->sum(fn ($value) => pow($value - $mean, 2)) / $values->count();

        return sqrt($variance);
    }
}
