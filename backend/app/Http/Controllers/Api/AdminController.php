<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Portfolio;
use App\Models\Transaction;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function dashboard()
    {
        $totalUsers = User::where('role', 'user')->count();
        $activeUsers = User::where('role', 'user')->where('status', 'active')->count();
        $pendingUsers = User::where('status', 'pending')->count();
        $totalPortfolios = Portfolio::count();
        $totalInvestment = Portfolio::all()->sum(fn($p) => $p->investment_amount);
        $totalValue = Portfolio::all()->sum(fn($p) => $p->current_value);
        $recentUsers = User::where('role', 'user')->latest()->limit(5)->get();
        $recentTransactions = Transaction::with('user')->latest()->limit(10)->get();

        // Asset distribution across all users
        $assetDistribution = Portfolio::selectRaw('asset_type, COUNT(*) as count, SUM(quantity * current_price) as total_value')
            ->groupBy('asset_type')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_users' => $totalUsers,
                'active_users' => $activeUsers,
                'pending_users' => $pendingUsers,
                'total_portfolios' => $totalPortfolios,
                'total_investment' => round($totalInvestment, 2),
                'total_value' => round($totalValue, 2),
                'recent_users' => $recentUsers,
                'recent_transactions' => $recentTransactions,
                'asset_distribution' => $assetDistribution,
            ],
        ]);
    }

    public function users(Request $request)
    {
        $query = User::where('role', 'user');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $users = $query->withCount('portfolios')->latest()->paginate($request->per_page ?? 15);

        return response()->json([
            'status' => 'success',
            'data' => $users,
        ]);
    }

    public function updateUserStatus(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:active,pending,suspended',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $user->update(['status' => $request->status]);

        // Notify user
        Notification::create([
            'user_id' => $user->id,
            'title' => 'Account Status Updated',
            'message' => "Your account status has been changed to: {$request->status}.",
            'type' => $request->status === 'active' ? 'success' : 'warning',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "User status updated to {$request->status}",
            'user' => $user->fresh(),
        ]);
    }

    public function deleteUser(User $user)
    {
        if ($user->role === 'admin') {
            return response()->json(['status' => 'error', 'message' => 'Cannot delete admin users'], 422);
        }

        $user->delete();

        return response()->json(['status' => 'success', 'message' => 'User deleted successfully']);
    }

    public function userDetails(User $user)
    {
        $user->load(['portfolios', 'transactions', 'notifications']);
        $portfolios = $user->portfolios;
        $totalInvestment = $portfolios->sum(fn($p) => $p->investment_amount);
        $totalValue = $portfolios->sum(fn($p) => $p->current_value);

        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => $user,
                'stats' => [
                    'total_investment' => round($totalInvestment, 2),
                    'total_value' => round($totalValue, 2),
                    'profit_loss' => round($totalValue - $totalInvestment, 2),
                    'portfolio_count' => $portfolios->count(),
                ],
            ],
        ]);
    }

    public function sendNotification(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'nullable|in:info,success,warning,danger',
            'user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        if ($request->user_id) {
            Notification::create([
                'user_id' => $request->user_id,
                'title' => $request->title,
                'message' => $request->message,
                'type' => $request->type ?? 'info',
            ]);
        } else {
            // Broadcast to all users
            $users = User::where('role', 'user')->get();
            foreach ($users as $user) {
                Notification::create([
                    'user_id' => $user->id,
                    'title' => $request->title,
                    'message' => $request->message,
                    'type' => $request->type ?? 'info',
                ]);
            }
        }

        return response()->json(['status' => 'success', 'message' => 'Notification sent']);
    }

    public function analytics()
    {
        $portfoliosByType = Portfolio::selectRaw('asset_type, COUNT(*) as count, SUM(quantity * current_price) as total_value, SUM(quantity * buy_price) as total_investment')
            ->groupBy('asset_type')
            ->get()
            ->map(function ($item) {
                $item->profit_loss = $item->total_value - $item->total_investment;
                return $item;
            });

        $userGrowth = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $userGrowth[] = [
                'month' => $date->format('M Y'),
                'users' => User::where('role', 'user')
                    ->where('created_at', '<=', $date->endOfMonth())
                    ->count(),
            ];
        }

        $topInvestors = User::where('role', 'user')
            ->withCount('portfolios')
            ->has('portfolios')
            ->orderByDesc('portfolios_count')
            ->limit(5)
            ->get()
            ->map(function ($user) {
                $portfolios = $user->portfolios;
                $user->total_investment = $portfolios->sum(fn($p) => $p->investment_amount);
                $user->total_value = $portfolios->sum(fn($p) => $p->current_value);
                return $user;
            });

        return response()->json([
            'status' => 'success',
            'data' => [
                'portfolios_by_type' => $portfoliosByType,
                'user_growth' => $userGrowth,
                'top_investors' => $topInvestors,
            ],
        ]);
    }
}
