<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pm_executions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pm_plan_id')->constrained()->cascadeOnDelete();
            $table->foreignId('executed_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('execution_date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('status', 50)->default('In Progress');
            $table->string('machine_condition')->nullable();
            $table->string('spare_use_note')->nullable();
            $table->text('observation_note')->nullable();
            $table->text('completion_summary')->nullable();
            $table->date('next_due_date')->nullable();
            $table->dateTime('approved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pm_executions');
    }
};
