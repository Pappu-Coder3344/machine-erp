<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('machine_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('machine_id')->constrained()->cascadeOnDelete();
            $table->foreignId('from_floor_id')->nullable()->constrained('floors')->nullOnDelete();
            $table->foreignId('from_line_id')->nullable()->constrained('lines')->nullOnDelete();
            $table->foreignId('to_floor_id')->nullable()->constrained('floors')->nullOnDelete();
            $table->foreignId('to_line_id')->nullable()->constrained('lines')->nullOnDelete();
            $table->foreignId('allocated_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('allocation_type', 50)->default('Allocation');
            $table->dateTime('allocated_at');
            $table->string('reason')->nullable();
            $table->string('status', 50)->default('Active');
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('machine_allocations');
    }
};
