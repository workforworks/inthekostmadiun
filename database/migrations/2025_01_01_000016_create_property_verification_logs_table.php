<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_verification_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('verification_id')
                ->constrained('property_verifications')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->foreignId('admin_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->string('item_name', 100);

            $table->enum('old_status', ['pending', 'verified', 'rejected', 'revision'])->nullable();
            $table->enum('new_status', ['pending', 'verified', 'rejected', 'revision']);

            $table->text('notes')->nullable();

            $table->timestamp('created_at')->nullable()->useCurrent();

            $table->index('verification_id', 'idx_property_verification_logs_verification');
            $table->index('admin_id', 'idx_property_verification_logs_admin');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_verification_logs');
    }
};
