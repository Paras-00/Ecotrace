<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class RequestLifecycleLogger
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Start time of the request
        $startTime = microtime(true);

        // Continue the request lifecycle
        $response = $next($request);

        // End time of the request
        $endTime = microtime(true);
        $duration = round(($endTime - $startTime) * 1000, 2); // duration in milliseconds

        // Log the lifecycle event
        Log::info("Request [{$request->method()}] {$request->fullUrl()} processed in {$duration}ms");

        // Unit II: Attaching Custom Headers
        $response->headers->set('X-EcoTrace-Duration-MS', $duration);
        $response->headers->set('X-EcoTrace-Version', '1.0.0-Beta');

        // Unit II: Attaching Cookies
        // Set a cookie tracking the user's last activity timestamp
        $response->cookie('last_activity', now()->timestamp, 120); // cookie valid for 120 minutes

        return $response;
    }
}
