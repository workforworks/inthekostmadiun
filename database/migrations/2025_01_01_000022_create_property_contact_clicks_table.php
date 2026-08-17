<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_contact_clicks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('property_id')
                ->constrained('properties')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->enum('channel', ['whatsapp', 'phone', 'email'])->default('whatsapp');

            $table->string('ip_address', 45)->nullable();

            $table->timestamp('created_at')->nullable()->useCurrent();

            $table->index('property_id', 'idx_property_contact_clicks_property');
            $table->index('user_id', 'idx_property_contact_clicks_user');
            $table->index('channel', 'idx_property_contact_clicks_channel');
            $table->index('created_at', 'idx_property_contact_clicks_created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_contact_clicks');
    }
};
