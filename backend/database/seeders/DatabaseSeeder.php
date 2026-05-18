<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Portfolio;
use App\Models\Transaction;
use App\Models\Notification;
use App\Models\Advice;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@smartportfolio.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
            'risk_preference' => 'low',
            'email_verified_at' => now(),
        ]);

        // Create Demo User
        $user = User::create([
            'name' => 'John Investor',
            'email' => 'demo@smartportfolio.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'status' => 'active',
            'risk_preference' => 'medium',
            'email_verified_at' => now(),
        ]);

        // Create demo portfolios
        $portfolios = [
            [
                'asset_name' => 'Apple Inc.',
                'asset_type' => 'stocks',
                'ticker_symbol' => 'AAPL',
                'quantity' => 10,
                'buy_price' => 150.00,
                'current_price' => 178.50,
                'risk_level' => 'medium',
                'purchase_date' => now()->subMonths(6),
            ],
            [
                'asset_name' => 'Bitcoin',
                'asset_type' => 'crypto',
                'ticker_symbol' => 'BTC',
                'quantity' => 0.5,
                'buy_price' => 42000.00,
                'current_price' => 67000.00,
                'risk_level' => 'high',
                'purchase_date' => now()->subMonths(4),
            ],
            [
                'asset_name' => 'Gold ETF',
                'asset_type' => 'gold',
                'ticker_symbol' => 'GLD',
                'quantity' => 5,
                'buy_price' => 1800.00,
                'current_price' => 1950.00,
                'risk_level' => 'low',
                'purchase_date' => now()->subMonths(8),
            ],
            [
                'asset_name' => 'US Treasury Bond',
                'asset_type' => 'bonds',
                'ticker_symbol' => 'TLT',
                'quantity' => 20,
                'buy_price' => 95.00,
                'current_price' => 98.50,
                'risk_level' => 'low',
                'purchase_date' => now()->subMonths(10),
            ],
            [
                'asset_name' => 'Ethereum',
                'asset_type' => 'crypto',
                'ticker_symbol' => 'ETH',
                'quantity' => 3,
                'buy_price' => 2200.00,
                'current_price' => 3500.00,
                'risk_level' => 'high',
                'purchase_date' => now()->subMonths(5),
            ],
            [
                'asset_name' => 'Vanguard S&P 500 Fund',
                'asset_type' => 'mutual_funds',
                'ticker_symbol' => 'VFIAX',
                'quantity' => 15,
                'buy_price' => 380.00,
                'current_price' => 420.00,
                'risk_level' => 'medium',
                'purchase_date' => now()->subMonths(7),
            ],
            [
                'asset_name' => 'Tesla Inc.',
                'asset_type' => 'stocks',
                'ticker_symbol' => 'TSLA',
                'quantity' => 8,
                'buy_price' => 250.00,
                'current_price' => 195.00,
                'risk_level' => 'medium',
                'purchase_date' => now()->subMonths(3),
            ],
            [
                'asset_name' => 'Microsoft Corp.',
                'asset_type' => 'stocks',
                'ticker_symbol' => 'MSFT',
                'quantity' => 5,
                'buy_price' => 300.00,
                'current_price' => 380.00,
                'risk_level' => 'medium',
                'purchase_date' => now()->subMonths(9),
            ],
        ];

        foreach ($portfolios as $portfolioData) {
            $portfolio = Portfolio::create(array_merge($portfolioData, ['user_id' => $user->id]));

            Transaction::create([
                'user_id' => $user->id,
                'portfolio_id' => $portfolio->id,
                'action' => 'buy',
                'amount' => $portfolio->investment_amount,
                'quantity' => $portfolio->quantity,
                'price' => $portfolio->buy_price,
                'asset_name' => $portfolio->asset_name,
                'created_at' => $portfolio->purchase_date,
            ]);
        }

        // Notifications
        $notifications = [
            [
                'title' => 'Welcome to Smart Portfolio!',
                'message' => 'Your account is all set. Start managing your investments with powerful analytics.',
                'type' => 'success',
                'is_read' => true,
            ],
            [
                'title' => 'Bitcoin surged 15% today',
                'message' => 'Your BTC holding has gained significantly. Consider taking partial profits.',
                'type' => 'info',
                'is_read' => false,
            ],
            [
                'title' => 'Portfolio Rebalancing Suggested',
                'message' => 'Your high-risk allocation exceeds 60%. Review our smart advice for rebalancing suggestions.',
                'type' => 'warning',
                'is_read' => false,
            ],
            [
                'title' => 'Tesla down 22%',
                'message' => 'TSLA has dropped below your buy price. Review your position.',
                'type' => 'danger',
                'is_read' => false,
            ],
            [
                'title' => 'Monthly Report Ready',
                'message' => 'Your portfolio report for this month is now available in the Reports section.',
                'type' => 'info',
                'is_read' => false,
            ],
        ];

        foreach ($notifications as $notif) {
            Notification::create(array_merge($notif, ['user_id' => $user->id]));
        }

        // Smart advices
        $adviceList = [
            [
                'message' => 'Your crypto holdings represent a large portion of your portfolio. Consider reducing exposure to manage volatility risk.',
                'risk_level' => 'high',
                'category' => 'rebalance',
                'is_read' => false,
            ],
            [
                'message' => 'Adding more low-risk bonds (target: 15-20% of portfolio) would improve your overall risk-adjusted returns.',
                'risk_level' => 'low',
                'category' => 'diversification',
                'is_read' => false,
            ],
            [
                'message' => 'Tesla is underperforming. If fundamentals have not changed, consider averaging down or reviewing your thesis.',
                'risk_level' => 'medium',
                'category' => 'alert',
                'is_read' => true,
            ],
            [
                'message' => 'Apple and Microsoft are performing well. Consider adding to your tech exposure if it aligns with your risk profile.',
                'risk_level' => 'medium',
                'category' => 'general',
                'is_read' => false,
            ],
        ];

        foreach ($adviceList as $advice) {
            Advice::create(array_merge($advice, ['user_id' => $user->id]));
        }

        // Create a second demo investor
        $user2 = User::create([
            'name' => 'Sarah Chen',
            'email' => 'sarah@smartportfolio.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'status' => 'active',
            'risk_preference' => 'high',
            'email_verified_at' => now(),
        ]);

        Portfolio::create([
            'user_id' => $user2->id,
            'asset_name' => 'Solana',
            'asset_type' => 'crypto',
            'ticker_symbol' => 'SOL',
            'quantity' => 100,
            'buy_price' => 80.00,
            'current_price' => 145.00,
            'risk_level' => 'high',
            'purchase_date' => now()->subMonths(3),
        ]);

        Notification::create([
            'user_id' => $user2->id,
            'title' => 'Welcome to Smart Portfolio!',
            'message' => 'Your account has been created successfully.',
            'type' => 'success',
        ]);

        echo "✅ Database seeded successfully!\n";
        echo "Admin: admin@smartportfolio.com / password\n";
        echo "Demo:  demo@smartportfolio.com  / password\n";
    }
}
