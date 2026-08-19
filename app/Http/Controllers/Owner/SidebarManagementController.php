<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SidebarManagementController extends Controller
{
    // public function dashboard() : Response
    // {
    //     return Inertia::render('Owner/Dashboard');
    // }
    public function kostSaya() : Response
    {
        return Inertia::render('Owner/KostSaya');
    }
    public function tambahKost() : Response
    {
        return Inertia::render('Owner/TambahKost');
    }
    public function verifikasiCenter() : Response
    {
        return Inertia::render('Owner/Verifikasi');
    }
    public function profile() : Response
    {
        return Inertia::render('Owner/Profil');
    }
}
