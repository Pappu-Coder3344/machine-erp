<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agreements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained()->restrictOnDelete();
            $table->string('code', 50)->unique();
            $table->string('type', 100);
            $table->date('start_date');
            $table->date('end_date');
            $table->string('coverage')->nullable();
            $table->decimal('monthly_cost', 12, 2)->nullable();
            $table->string('status', 50)->default('Draft');
            $table->string('renewal_risk', 50)->nullable();
            $table->text('terms')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agreements');
    }
};
