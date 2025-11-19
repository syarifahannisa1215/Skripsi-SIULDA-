<?php

namespace App\Http\Controllers;

use App\Models\Ulasan;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class KelolaUlasanController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'sentiment', 'status']);

        $ulasanList = Ulasan::query()
            ->with(['user:id,name,avatar', 'targetUlasan:id,nama,tipe'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('konten', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('targetUlasan', fn ($q) => $q->where('nama', 'like', "%{$search}%"));
            })
            ->when($request->input('sentiment'), function ($query, $sentiment) {
                $query->where('sentimen_prediksi', $sentiment);
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('visibilitas', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Dashboard/KelolaUlasan', [
            'ulasanList' => $ulasanList,
            'filters' => $filters,
        ]);
    }

    public function update(Request $request, Ulasan $ulasan): RedirectResponse
    {
        $validated = $request->validate([
            'visibilitas' => ['required', Rule::in(['dipublikasikan', 'disembunyikan'])],
        ]);

        $ulasan->visibilitas = $validated['visibilitas'];
        $ulasan->save();

        return back()->with('flash.success', 'Status ulasan berhasil diperbarui.');
    }

    public function destroy(Ulasan $ulasan): RedirectResponse {
        $ulasan->delete();

        return back()->with('flash.success', 'Ulasan berhasil dihapus.');
    }
}
