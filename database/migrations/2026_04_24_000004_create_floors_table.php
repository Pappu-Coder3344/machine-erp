<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('floors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('factory_unit_id')->constrained()->cascadeOnDelete();
            $table->foreignId('shift_id')->nullable()->constrained()->nullOnDelete();
            $table->string('code', 50)->unique();
            $table->string('name', 150);
            $table->string('area_type', 50)->nullable();
            $table->unsignedInteger('machine_capacity')->nullable();
            $table->string('supervisor_name', 150)->nullable();
            $table->string('status', 50)->default('Active');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['factory_unit_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('floors');
    }
};
