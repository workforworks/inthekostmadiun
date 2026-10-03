<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreOwnerRequest;
use App\Services\Admin\OwnerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OwnerController extends Controller
{
    public function __construct(
        protected OwnerService $ownerService
    ) {}

    /**
     * Display a listing of owner accounts.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'registration_source']);
        $owners = $this->ownerService->getPaginatedOwners($filters, 10);
        $stats = $this->ownerService->getOwnerStats();

        return Inertia::render('Admin/Owners/Index', [
            'owners' => $owners,
            'stats' => $stats,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? 'all',
                'registration_source' => $filters['registration_source'] ?? 'all',
            ],
        ]);
    }

    /**
     * Store a newly created owner account by Admin.
     */
    public function store(StoreOwnerRequest $request): RedirectResponse
    {
        $this->ownerService->createOwnerByAdmin(
            $request->validated(),
            $request->user()->id,
            $request
        );

        return redirect()
            ->route('admin.owners.index')
            ->with('success', 'Akun Owner berhasil dibuat.');
    }

    /**
     * Update the verification status of the specified owner.
     */
    public function updateVerification(Request $request, User $owner): RedirectResponse
    {
        $request->validate([
            'verification_status' => ['required', 'in:pending,verified,rejected,suspended'],
        ]);

        $this->ownerService->updateVerificationStatus(
            $owner,
            $request->verification_status,
            $request->user()->id,
            $request
        );

        $labels = [
            'verified' => 'Terverifikasi',
            'pending' => 'Menunggu Verifikasi',
            'rejected' => 'Ditolak',
            'suspended' => 'Ditangguhkan',
        ];
        $label = $labels[$request->verification_status] ?? $request->verification_status;

        return redirect()
            ->route('admin.owners.index')
            ->with('success', "Status verifikasi {$owner->name} diubah menjadi {$label}.");
    }

    /**
     * Update the account status of the specified owner.
     */
    public function updateAccountStatus(Request $request, User $owner): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'in:active,inactive,suspended'],
        ]);

        $this->ownerService->updateAccountStatus(
            $owner,
            $request->status,
            $request->user()->id,
            $request
        );

        $labels = [
            'active' => 'Aktif',
            'inactive' => 'Non-Aktif',
            'suspended' => 'Ditangguhkan',
        ];
        $label = $labels[$request->status] ?? $request->status;

        return redirect()
            ->route('admin.owners.index')
            ->with('success', "Status akun {$owner->name} diubah menjadi {$label}.");
    }

    /**
     * Toggle the status of the specified owner account.
     */
    public function toggleStatus(Request $request, User $owner): RedirectResponse
    {
        $this->ownerService->toggleOwnerStatus($owner, $request->user()->id, $request);
        $statusText = $owner->status === 'active' ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()
            ->route('admin.owners.index')
            ->with('success', "Status akun owner {$owner->name} berhasil {$statusText}.");
    }
}


