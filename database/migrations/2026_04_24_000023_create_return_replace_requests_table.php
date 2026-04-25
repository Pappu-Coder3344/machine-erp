<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('return_replace_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('machine_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vendor_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('agreement_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('line_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('requested_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('code', 50)->unique();
            $table->string('request_type', 50);
            $table->string('flow_status', 50)->default('Requested');
            $table->string('approval_stage', 100)->nullable();
            $table->string('reference_code', 50)->nullable();
            $table->date('request_date');
            $table->date('vendor_reply_date')->nullable();
            $table->date('completion_target')->nullable();
            $table->text('line_impact')->nullable();
            $table->text('alternate_support')->nullable();
            $table->text('reason');
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('return_replace_requests');
    }
};
