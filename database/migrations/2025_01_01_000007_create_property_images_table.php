<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_images', function (Blueprint $table) {
            $table->id();

            $table->foreignId('property_id')
                ->constrained('properties')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->string('image_url', 500);

            $table->enum('category', [
                'exterior',
                'room',
                'bathroom',
                'facility',
                'parking',
                'environment',
                'other',
            ])->default('other');

            $table->string('caption', 255)->nullable();
            $table->boolean('is_primary')->default(false);
            $table->integer('sort_order')->default(0);

            $table->timestamps();

            $table->index('property_id', 'idx_property_images_property');
            $table->index('category', 'idx_property_images_category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_images');
    }
};
