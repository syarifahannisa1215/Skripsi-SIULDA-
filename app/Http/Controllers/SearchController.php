<?php

namespace App\Http\Controllers;

use App\Models\TargetUlasan;
use App\Models\Ulasan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class SearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $query = $request->input('q');

        if (empty($query) || strlen($query) < 2) {
            return response()->json([]);
        }

        $users = User::where('name', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->limit(3)
            ->get()
            ->map(fn (User $user) => [
                'id' => 'user-'.$user->id,
                'group' => 'Pengguna',
                'name' => $user->name,
                'url' => route('dashboard.users.index', ['search' => $user->name]),
            ]);

        $targets = TargetUlasan::where('nama', 'like', "%{$query}%")
            ->limit(3)
            ->get()
            ->map(fn (TargetUlasan $target) => [
                'id' => 'target-'.$target->id,
                'group' => 'Target Ulasan',
                'name' => $target->nama,
                'url' => route('dashboard.target.index', ['search' => $target->nama]),
            ]);

        $ulasan = Ulasan::where('konten', 'like', "%{$query}%")
            ->with('user:id,name') // Ambil nama user untuk konteks
            ->limit(5)
            ->latest()
            ->get()
            ->map(fn (Ulasan $ulasan) => [
                'id' => 'ulasan-'.$ulasan->id,
                'group' => 'Ulasan',
                'name' => Str::limit($ulasan->konten, 70, '...'),
                'context' => 'oleh ' . ($ulasan->user->name ?? 'User Dihapus'),
                'url' => route('dashboard.ulasan.index', ['search' => $ulasan->konten]),
            ]);

        // Gabungkan semua hasil
        $results = $users->concat($targets)->concat($ulasan);

        return response()->json($results);
    }
}
