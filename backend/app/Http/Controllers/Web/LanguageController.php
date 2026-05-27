<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class LanguageController extends Controller
{
    /**
     * Switch application locale.
     * 
     * Unit II: Redirecting to Named Routes / Controller Actions
     * Unit IV: Session management
     */
    public function switchLang(string $locale): RedirectResponse
    {
        if (in_array($locale, ['en', 'es', 'hi'])) {
            session(['locale' => $locale]);
        }
        
        // Redirect back to the previous page
        return redirect()->back();
    }
}
