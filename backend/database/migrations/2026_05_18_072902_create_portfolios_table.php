<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('asset_name');
            $table->string('asset_type'); // stocks | crypto | gold | bonds | mutual_funds
            $table->decimal('quantity', 15, 6);
            $table->decimal('buy_price', 15, 2);
            $table->decimal('current_price', 15, 2);
            $table->string('risk_level')->default('medium'); // low | medium | high
            $table->date('purchase_date');
            $table->text('notes')->nullable();
            $table->string('ticker_symbol')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolios');
    }
};
