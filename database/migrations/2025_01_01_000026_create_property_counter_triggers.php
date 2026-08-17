<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Trigger ini otomatis menambah properties.view_count dan
     * properties.contact_click_count setiap kali ada insert baru
     * ke property_views / property_contact_clicks, supaya backend
     * tidak perlu query COUNT() manual tiap kali menampilkan angka
     * kunjungan / klik hubungi.
     */
    public function up(): void
    {
        DB::unprepared('
            CREATE TRIGGER trg_property_views_after_insert
            AFTER INSERT ON property_views
            FOR EACH ROW
            UPDATE properties
            SET view_count = view_count + 1
            WHERE id = NEW.property_id
        ');

        DB::unprepared('
            CREATE TRIGGER trg_property_contact_clicks_after_insert
            AFTER INSERT ON property_contact_clicks
            FOR EACH ROW
            UPDATE properties
            SET contact_click_count = contact_click_count + 1
            WHERE id = NEW.property_id
        ');
    }

    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS trg_property_views_after_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_property_contact_clicks_after_insert');
    }
};
