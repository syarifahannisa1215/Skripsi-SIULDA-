<?php

namespace App\Http\Controllers;

use App\Models\Ulasan;
use App\Models\TargetUlasan; // <-- PASTIKAN BARIS INI ADA
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function index(Request $request): Response
    {
        $ulasan = Ulasan::with(['user', 'targetUlasan'])
            ->where('visibilitas', 'dipublikasikan')
            ->latest()
            ->paginate(9)
            ->withQueryString();

        $targetUlasanList = TargetUlasan::where('is_active', true)
            ->orderBy('tipe')
            ->orderBy('nama')
            ->get(['id', 'nama', 'tipe']);

//        return view('landing', [
//           'ulasan' => $ulasan,
//           'targetUlasanList' => $targetUlasanList,
//           'flash' => [
//               'success' => 'Ulasan berhasil dipublikasikan',
//           ],
//        ]);
        return Inertia::render('Landing', [
            'ulasan' => $ulasan,
            'targetUlasanList' => $targetUlasanList,
            'flash' => [
                'success' => session('flash.success'),
            ],
        ]);
    }
}
