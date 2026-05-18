<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc');

        if ($request->action) {
            $query->where('action', $request->action);
        }

        $transactions = $query->paginate($request->per_page ?? 15);

        return response()->json([
            'status' => 'success',
            'data' => $transactions,
        ]);
    }

    public function recentActivity(Request $request)
    {
        $transactions = Transaction::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $transactions,
        ]);
    }
}
