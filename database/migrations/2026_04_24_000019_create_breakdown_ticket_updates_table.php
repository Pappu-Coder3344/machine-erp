<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('breakdown_ticket_updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('breakdown_ticket_id')->constrained()->cascadeOnDelete();
            $table->foreignId('updated_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('updated_role_snapshot', 100)->nullable();
            $table->string('status_snapshot', 50)->nullable();
            $table->string('next_step')->nullable();
            $table->string('support_need')->nullable();
            $table->text('work_note');
            $table->text('handover_note')->nullable();
            $table->dateTime('logged_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('breakdown_ticket_updates');
    }
};
