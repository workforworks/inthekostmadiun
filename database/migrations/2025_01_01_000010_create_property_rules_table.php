<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_rules', function (Blueprint $table) {
            $table->id();

            $table->foreignId('property_id')
                ->constrained('properties')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->string('rule_name', 100);
            $table->text('rule_value')->nullable();
            $table->boolean('is_allowed')->nullable();

            $table->timestamps();

            $table->index('property_id', 'idx_property_rules_property');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_rules');
    }
};
