<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AdviceController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ContactController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/contact', [ContactController::class, 'store']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::put('/auth/change-password', [AuthController::class, 'changePassword']);

    // Portfolio
    Route::get('/portfolio/summary', [PortfolioController::class, 'summary']);
    Route::put('/portfolio/{portfolio}/price', [PortfolioController::class, 'updatePrice']);
    Route::apiResource('/portfolio', PortfolioController::class);

    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/recent', [TransactionController::class, 'recentActivity']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::put('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
    Route::put('/notifications/mark-all-read', [NotificationController::class, 'markAllRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);

    // Advice
    Route::get('/advice', [AdviceController::class, 'index']);
    Route::post('/advice/generate', [AdviceController::class, 'generate']);
    Route::put('/advice/{advice}/read', [AdviceController::class, 'markRead']);

    // Reports
    Route::get('/reports/portfolio', [ReportController::class, 'portfolioReport']);
    Route::get('/reports/transactions', [ReportController::class, 'transactionReport']);

    // Admin routes
    Route::middleware([\App\Http\Middleware\AdminMiddleware::class])->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/users/{user}', [AdminController::class, 'userDetails']);
        Route::put('/users/{user}/status', [AdminController::class, 'updateUserStatus']);
        Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);
        Route::post('/notifications/send', [AdminController::class, 'sendNotification']);
        Route::get('/analytics', [AdminController::class, 'analytics']);
        
        // Contact Messages
        Route::get('/messages', [ContactController::class, 'index']);
        Route::put('/messages/{contactMessage}/status', [ContactController::class, 'updateStatus']);
        Route::delete('/messages/{contactMessage}', [ContactController::class, 'destroy']);
    });
});
