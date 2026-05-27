<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\RecycleRequest;
use App\Models\DeviceModel;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class AdminDashboardController extends Controller
{
    /**
     * Display the recycling administration dashboard.
     * 
     * Unit III: Basic Controllers & View Rendering
     * Unit VI: Eloquent CRUD Read
     */
    public function index(): View
    {
        // Fetch all recycling requests from MongoDB ordered by creation time
        $requests = RecycleRequest::with('facility')->orderBy('created_at', 'desc')->get();

        // Calculate recovery statistics
        $totalGold = 0;
        $totalSilver = 0;
        $totalCopper = 0;
        $totalPalladium = 0;

        foreach ($requests as $req) {
            // Find device details
            $device = DeviceModel::where('brand', $req->device_brand)
                ->where('model_name', $req->device_model)
                ->first();

            if ($device && isset($device->precious_metals)) {
                $metals = $device->precious_metals;
                $totalGold += $metals['gold'] ?? 0;
                $totalSilver += $metals['silver'] ?? 0;
                $totalCopper += $metals['copper'] ?? 0;
                $totalPalladium += $metals['palladium'] ?? 0;
            }
        }

        $stats = [
            'gold' => round($totalGold, 4),
            'silver' => round($totalSilver, 4),
            'copper' => round($totalCopper / 1000, 4), // in kg
            'palladium' => round($totalPalladium, 4),
        ];

        return view('web.admin_dashboard', compact('requests', 'stats'));
    }

    /**
     * Delete/Archive a recycling request from the dashboard.
     * 
     * Unit VI: Eloquent CRUD Delete
     * Unit II: Redirecting to Named Routes with Session Flash Data
     */
    public function destroy(string $id): RedirectResponse
    {
        $request = RecycleRequest::find($id);

        if ($request) {
            // Delete device image from storage if exists
            if ($request->image_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($request->image_path);
            }
            
            // Delete the document in MongoDB
            $request->delete();
            
            // Unit IV: Storing session flash data
            session()->flash('admin_success', 'Recycling request successfully archived/deleted.');
        } else {
            session()->flash('admin_error', 'Submission record not found.');
        }

        // Redirect back to admin dashboard
        return redirect()->route('admin.dashboard');
    }
}
