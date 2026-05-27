<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Share global stats with all views dynamically
        view()->composer('*', function ($view) {
            try {
                // Fetch stats from MongoDB collections
                $totalSubmissions = \App\Models\RecycleRequest::count();
                $totalPoints = \App\Models\RecycleRequest::sum('credit_points');
                
                $view->with('global_total_submissions', $totalSubmissions);
                $view->with('global_total_points', $totalPoints);
            } catch (\Exception $e) {
                $view->with('global_total_submissions', 0);
                $view->with('global_total_points', 0);
            }
        });
    }
}
