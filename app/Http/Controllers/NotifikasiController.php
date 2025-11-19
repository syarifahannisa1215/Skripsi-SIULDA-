<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotifikasiController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth()->user();
        return response()->json([
            'unread' => $user->unreadNotifications,
            'read' => $user->readNotifications->take(5),
        ]);
    }

    public function markAsRead(Request $request): JsonResponse
    {
        auth()->user()->unreadNotifications->markAsRead();
        return response()->json(['status' => 'success']);
    }
}
