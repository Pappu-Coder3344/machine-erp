<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pm_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('machine_id')->constrained()->cascadeOnDelete();
            $table->foreignId('assigned_to_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('code', 50)->unique();
            $table->string('frequency', 50);
            $table->date('last_pm_date')->nullable();
            $table->date('next_due_date');
            $table->string('status', 50)->default('Planned');
            $table->text('exception_reason')->nullable();
            $table->boolean('vendor_aware')->default(false);
            $table->boolean('defer_requested')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pm_plans');
    }
};
