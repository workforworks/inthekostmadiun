<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();

            $table->string('lead_code', 50)->unique();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->foreignId('property_id')
                ->constrained('properties')
                ->restrictOnDelete()
                ->cascadeOnUpdate();

            $table->foreignId('owner_id')
                ->constrained('users')
                ->restrictOnDelete()
                ->cascadeOnUpdate();

            $table->enum('source', ['website', 'whatsapp', 'survey', 'direct', 'other'])
                ->default('website');

            $table->enum('status', ['new', 'contacted', 'follow_up', 'interested', 'rented', 'lost'])
                ->default('new');

            $table->string('user_name', 100)->nullable();
            $table->string('user_phone', 30)->nullable();
            $table->string('user_email', 150)->nullable();

            $table->text('notes')->nullable();

            $table->timestamp('first_contacted_at')->nullable();
            $table->timestamp('converted_at')->nullable();

            $table->timestamps();

            $table->index('user_id', 'idx_leads_user');
            $table->index('property_id', 'idx_leads_property');
            $table->index('owner_id', 'idx_leads_owner');
            $table->index('status', 'idx_leads_status');
            $table->index('source', 'idx_leads_source');
            $table->index('created_at', 'idx_leads_created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
