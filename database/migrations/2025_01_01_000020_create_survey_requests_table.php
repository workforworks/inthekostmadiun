<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('survey_requests', function (Blueprint $table) {
            $table->id();

            $table->string('request_code', 50)->unique();

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

            $table->foreignId('survey_package_id')
                ->nullable()
                ->constrained('survey_packages')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->string('name', 100);
            $table->string('phone', 30);
            $table->string('email', 150)->nullable();

            // Catatan tambahan dari user saat submit survey
            $table->text('notes')->nullable();

            $table->enum('survey_type', ['photo_report', 'live_video_call']);

            // Admin & tim yang menghubungi user dan orang yang mensurvey
            // secara manual via WhatsApp - hasil survey tidak disimpan di sistem
            $table->enum('status', [
                'requested',
                'contacted',
                'scheduled',
                'completed',
                'cancelled',
            ])->default('requested');

            $table->date('preferred_date')->nullable();

            $table->enum('preferred_time_slot', ['pagi', 'siang', 'malam'])->nullable();

            $table->timestamp('contacted_at')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            // Catatan internal admin (bukan catatan user)
            $table->text('admin_notes')->nullable();

            $table->timestamps();

            $table->index('user_id', 'idx_survey_requests_user');
            $table->index('property_id', 'idx_survey_requests_property');
            $table->index('owner_id', 'idx_survey_requests_owner');
            $table->index('status', 'idx_survey_requests_status');
            $table->index('scheduled_at', 'idx_survey_requests_scheduled_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_requests');
    }
};
