<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('portfolio_id')->nullable()->constrained()->onDelete('set null');
            $table->string('action'); // buy | sell | update
            $table->decimal('amount', 15, 2);
            $table->decimal('quantity', 15, 6)->nullable();
            $table->decimal('price', 15, 2)->nullable();
            $table->string('asset_name')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
