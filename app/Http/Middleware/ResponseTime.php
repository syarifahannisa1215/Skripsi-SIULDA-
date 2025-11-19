<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ResponseTime
{
    public function handle(Request $request, Closure $next)
    {
        $start = microtime(true);
        $request->attributes->set('_rt_start', $start);
        $response = $next($request);
        $durationMs = (microtime(true) - $start) * 1000;
        $response->headers->set('X-Response-Time', sprintf('%.2f ms', $durationMs));
        return $response;
    }

    public function terminate(Request $request, $response): void
    {
        $start = $request->attributes->get('_rt_start', microtime(true));
        $totalMs = (microtime(true) - $start) * 1000;

        Log::info('http.response_time', [
            'method'   => $request->getMethod(),
            'path'     => '/' . ltrim($request->path(), '/'),
            'status'   => method_exists($response, 'getStatusCode') ? $response->getStatusCode() : null,
            'app_ms'   => (float) $response->headers->get('X-Response-Time', 0),
            'total_ms' => round($totalMs, 2),
            'ip'       => $request->ip(),
        ]);
    }
}
