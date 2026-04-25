<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pm_execution_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pm_execution_id')->constrained()->cascadeOnDelete();
            $table->string('item_name');
            $table->string('checklist_group', 100)->nullable();
            $table->text('observation')->nullable();
            $table->string('status', 50)->default('Pending');
            $table->unsignedSmallInteger('sequence')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pm_execution_items');
    }
};
