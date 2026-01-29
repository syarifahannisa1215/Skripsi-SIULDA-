<?php

namespace App\Http\Controllers;

use App\Models\TargetUlasan;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class KelolaTargetController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'tipe', 'sort']);
        $targetList = TargetUlasan::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('nama', 'like', "%{$search}%")
                    ->orWhere('deskripsi', 'like', "%{$search}%");
            })
            ->when($request->input('tipe'), function ($query, $tipe) {
                $query->where('tipe', $tipe);
            })
            ->when($request->input('sort'), function ($query, $sort) {
                 switch ($sort) {
                    case 'oldest':
                        $query->oldest();
                        break;
                    case 'name_asc':
                        $query->orderBy('nama', 'asc');
                        break;
                    case 'name_desc':
                        $query->orderBy('nama', 'desc');
                        break;
                    case 'latest':
                    default:
                        $query->latest();
                        break;
                }
            }, function ($query) {
                 $query->latest();
            })
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Dashboard/KelolaTarget', [
            'targetList' => $targetList,
            'filters' => $filters,
        ]);
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:target_ulasan,id',
        ]);

        TargetUlasan::whereIn('id', $request->ids)->delete();

        return back()->with('flash.success', count($request->ids) . ' target berhasil dihapus.');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'tipe' => ['required', Rule::in(['PEGAWAI', 'DIVISI'])],
            'deskripsi' => ['nullable', 'string', 'max:500'],
            'metadata' => ['nullable', 'json'],
        ]);

        TargetUlasan::create($validated);

        return back()->with('flash.success', 'Target baru berhasil ditambahkan.');
    }

    public function update(Request $request, TargetUlasan $target): RedirectResponse
    {
        if ($request->has('is_active')) {
             $validated = $request->validate(['is_active' => 'required|boolean']);
        } else {
            $validated = $request->validate([
                'nama' => ['required', 'string', 'max:255'],
                'tipe' => ['required', Rule::in(['PEGAWAI', 'DIVISI'])],
                'deskripsi' => ['nullable', 'string', 'max:500'],
                'metadata' => ['nullable', 'json'],
            ]);
        }

        $target->update($validated);

        return back()->with('flash.success', 'Target berhasil diperbarui.');
    }

    public function destroy(TargetUlasan $target): RedirectResponse {
        $target->delete();

        return back()->with('flash.success', 'Target berhasil dihapus.');
    }
}
