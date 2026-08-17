<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();

            $table->foreignId('owner_id')
                ->constrained('users')
                ->restrictOnDelete()
                ->cascadeOnUpdate();

            $table->foreignId('location_id')
                ->constrained('locations')
                ->restrictOnDelete()
                ->cascadeOnUpdate();

            $table->string('name', 150);
            $table->string('slug', 180)->unique();
            $table->text('description')->nullable();

            $table->enum('type', ['kost', 'boarding_house'])->default('kost');

            $table->enum('tenant_type', ['male', 'female', 'mixed'])->nullable();

            $table->decimal('price_monthly', 15, 2)->nullable();
            $table->decimal('price_daily', 15, 2)->nullable();
            $table->decimal('deposit', 15, 2)->nullable();

            $table->enum('status', [
                'draft',
                'pending_verification',
                'verified',
                'surveyed',
                'suspended',
            ])->default('draft');

            $table->unsignedBigInteger('view_count')->default(0);
            $table->unsignedBigInteger('contact_click_count')->default(0);

            $table->timestamp('published_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('owner_id', 'idx_properties_owner');
            $table->index('location_id', 'idx_properties_location');
            $table->index('status', 'idx_properties_status');
            $table->index('type', 'idx_properties_type');
            $table->index('tenant_type', 'idx_properties_tenant_type');
            $table->index('price_monthly', 'idx_properties_price_monthly');
            $table->index('deleted_at', 'idx_properties_deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
