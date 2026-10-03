<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSurveyChecklistRequest;
use App\Http\Requests\Admin\UpdateSurveyChecklistRequest;
use App\Models\SurveyChecklist;
use App\Services\Admin\SurveyChecklistService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SurveyChecklistController extends Controller
{
    public function __construct(
        protected SurveyChecklistService $surveyChecklistService
    ) {}

    /**
     * Display a listing of survey checklists.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'category', 'status']);
        $checklists = $this->surveyChecklistService->getPaginatedChecklists($filters, 15);

        return Inertia::render('Admin/SurveyChecklists/Index', [
            'checklists' => $checklists,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'category' => $filters['category'] ?? 'all',
                'status' => $filters['status'] ?? 'all',
            ],
            'categories' => [
                ['key' => 'room', 'label' => 'Kamar (Room)'],
                ['key' => 'bathroom', 'label' => 'Kamar Mandi (Bathroom)'],
                ['key' => 'facility', 'label' => 'Fasilitas Umum (Facility)'],
                ['key' => 'environment', 'label' => 'Lingkungan (Environment)'],
            ],
        ]);
    }

    /**
     * Store a newly created survey checklist in storage.
     */
    public function store(StoreSurveyChecklistRequest $request): RedirectResponse
    {
        $this->surveyChecklistService->createChecklist($request->validated());

        return redirect()
            ->route('admin.survey-checklists.index')
            ->with('success', 'Item checklist survey berhasil ditambahkan.');
    }

    /**
     * Update the specified survey checklist in storage.
     */
    public function update(UpdateSurveyChecklistRequest $request, SurveyChecklist $surveyChecklist): RedirectResponse
    {
        $this->surveyChecklistService->updateChecklist($surveyChecklist, $request->validated());

        return redirect()
            ->route('admin.survey-checklists.index')
            ->with('success', 'Item checklist survey berhasil diperbarui.');
    }

    /**
     * Toggle the status of the specified survey checklist.
     */
    public function toggleStatus(SurveyChecklist $surveyChecklist): RedirectResponse
    {
        $this->surveyChecklistService->toggleChecklistStatus($surveyChecklist);
        $statusText = $surveyChecklist->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()
            ->route('admin.survey-checklists.index')
            ->with('success', "Item checklist '{$surveyChecklist->name}' berhasil {$statusText}.");
    }

    /**
     * Remove the specified survey checklist from storage.
     */
    public function destroy(SurveyChecklist $surveyChecklist): RedirectResponse
    {
        $name = $surveyChecklist->name;
        $this->surveyChecklistService->deleteChecklist($surveyChecklist);

        return redirect()
            ->route('admin.survey-checklists.index')
            ->with('success', "Item checklist '{$name}' berhasil dihapus.");
    }
}
