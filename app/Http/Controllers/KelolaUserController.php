<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class KelolaUserController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'role']);

        $userList = User::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($request->input('role'), function ($query, $role) {
                $query->where('role', $role);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Dashboard/KelolaUser', [
            'userList' => $userList,
            'filters' => $filters,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['admin', 'user'])],
        ]);

        if ($user->id === auth()->id() && $user->role === 'admin' && $validated['role'] === 'user') {
            return back()->with('flash.error', 'Anda tidak dapat menurunkan peran Anda sendiri.');
        }

        $user->role = $validated['role'];
        $user->save();

        return back()->with('flash.success', 'Peran pengguna berhasil diperbarui.');
    }

    public function destroy(User $user): RedirectResponse {
        $user->delete();
        return back()->with('flash.success', 'User berhasil dihapus.');
    }
}
