<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('user')->after('password'); // user | admin
            $table->string('status')->default('active')->after('role'); // active | pending | suspended
            $table->string('profile_image')->nullable()->after('status');
            $table->string('risk_preference')->default('medium')->after('profile_image'); // low | medium | high
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'status', 'profile_image', 'risk_preference']);
        });
    }
};
