<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSurveyorRequest;
use App\Http\Requests\Admin\UpdateSurveyorRequest;
use App\Models\Surveyor;
use App\Services\Admin\SurveyorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SurveyorController extends Controller
{
    public function __construct(
        protected SurveyorService $surveyorService
    ) {}

    /**
     * Display a listing of surveyors.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status']);
        $surveyors = $this->surveyorService->getPaginatedSurveyors($filters, 10);

        return Inertia::render('Admin/Surveyors/Index', [
            'surveyors' => $surveyors,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? 'all',
            ],
        ]);
    }

    /**
     * Store a newly created surveyor in storage.
     */
    public function store(StoreSurveyorRequest $request): RedirectResponse
    {
        $this->surveyorService->createSurveyor($request->validated());

        return redirect()
            ->route('admin.surveyors.index')
            ->with('success', 'Data surveyor berhasil ditambahkan.');
    }

    /**
     * Update the specified surveyor in storage.
     */
    public function update(UpdateSurveyorRequest $request, Surveyor $surveyor): RedirectResponse
    {
        $this->surveyorService->updateSurveyor($surveyor, $request->validated());

        return redirect()
            ->route('admin.surveyors.index')
            ->with('success', 'Data surveyor berhasil diperbarui.');
    }

    /**
     * Toggle the status of the specified surveyor.
     */
    public function toggleStatus(Surveyor $surveyor): RedirectResponse
    {
        $this->surveyorService->toggleSurveyorStatus($surveyor);
        $statusText = $surveyor->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()
            ->route('admin.surveyors.index')
            ->with('success', "Status surveyor {$surveyor->name} berhasil {$statusText}.");
    }

    /**
     * Remove the specified surveyor from storage.
     */
    public function destroy(Surveyor $surveyor): RedirectResponse
    {
        $name = $surveyor->name;
        $this->surveyorService->deleteSurveyor($surveyor);

        return redirect()
            ->route('admin.surveyors.index')
            ->with('success', "Data surveyor {$name} berhasil dihapus.");
    }
}
