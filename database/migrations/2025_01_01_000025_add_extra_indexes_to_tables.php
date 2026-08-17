<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->index(['status', 'deleted_at', 'published_at'], 'idx_properties_public');
        });

        Schema::table('leads', function (Blueprint $table) {
            $table->index(['property_id', 'status'], 'idx_leads_property_status');
        });

        Schema::table('survey_requests', function (Blueprint $table) {
            $table->index(['property_id', 'status'], 'idx_survey_requests_property_status');
            $table->index(['owner_id', 'status'], 'idx_survey_requests_owner_status');
            $table->index(['preferred_date', 'preferred_time_slot'], 'idx_survey_requests_date_slot');
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropIndex('idx_properties_public');
        });

        Schema::table('leads', function (Blueprint $table) {
            $table->dropIndex('idx_leads_property_status');
        });

        Schema::table('survey_requests', function (Blueprint $table) {
            $table->dropIndex('idx_survey_requests_property_status');
            $table->dropIndex('idx_survey_requests_owner_status');
            $table->dropIndex('idx_survey_requests_date_slot');
        });
    }
};
