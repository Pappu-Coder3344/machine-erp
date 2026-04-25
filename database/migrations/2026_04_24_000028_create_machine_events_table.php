<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('machine_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('machine_id')->constrained()->cascadeOnDelete();
            $table->foreignId('updated_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('breakdown_ticket_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('pm_plan_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('return_replace_request_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('agreement_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('machine_allocation_id')->nullable()->constrained()->nullOnDelete();
            $table->string('event_type', 100);
            $table->string('linked_ref_type', 100)->nullable();
            $table->text('details');
            $table->string('status_after_event', 50)->nullable();
            $table->dateTime('occurred_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('machine_events');
    }
};
