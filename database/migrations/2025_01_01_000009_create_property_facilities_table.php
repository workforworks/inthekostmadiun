<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_facilities', function (Blueprint $table) {
            $table->unsignedBigInteger('property_id');
            $table->unsignedBigInteger('facility_id');

            $table->timestamp('created_at')->nullable()->useCurrent();

            $table->primary(['property_id', 'facility_id']);

            $table->foreign('property_id')
                ->references('id')->on('properties')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->foreign('facility_id')
                ->references('id')->on('facilities')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_facilities');
    }
};
