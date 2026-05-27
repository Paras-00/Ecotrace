<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Unit IV: Sessions & Localization
        // Retrieve locale from session, or fall back to default APP_LOCALE
        $locale = session('locale', config('app.locale', 'en'));
        App::setLocale($locale);

        return $next($request);
    }
}
