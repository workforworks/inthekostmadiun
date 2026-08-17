<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_availability', function (Blueprint $table) {
            $table->id();

            $table->foreignId('property_id')
                ->unique('uq_property_availability_property')
                ->constrained('properties')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->unsignedInteger('total_rooms')->default(0);
            $table->unsignedInteger('available_rooms')->default(0);

            $table->enum('status', ['available', 'limited', 'full'])
                ->default('available');

            $table->timestamp('updated_at')->nullable()->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_availability');
    }
};
