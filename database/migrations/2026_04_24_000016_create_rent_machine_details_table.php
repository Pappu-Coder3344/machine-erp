<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rent_machine_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('machine_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vendor_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('agreement_id')->nullable()->constrained()->nullOnDelete();
            $table->string('asset_tag', 50)->nullable()->unique();
            $table->date('receive_date')->nullable();
            $table->decimal('monthly_rent', 12, 2)->nullable();
            $table->string('return_replace_status', 50)->default('No Request');
            $table->text('contract_notes')->nullable();
            $table->timestamps();

            $table->unique('machine_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rent_machine_details');
    }
};
