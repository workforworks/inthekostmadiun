<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_verifications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('property_id')
                ->constrained('properties')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->enum('status', ['pending', 'verified', 'rejected', 'revision'])
                ->default('pending');

            $table->foreignId('admin_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->text('notes')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('verified_at')->nullable();

            $table->timestamps();

            $table->index('property_id', 'idx_property_verifications_property');
            $table->index('status', 'idx_property_verifications_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_verifications');
    }
};
