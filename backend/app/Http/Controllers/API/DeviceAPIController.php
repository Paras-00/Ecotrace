<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DeviceModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeviceAPIController extends Controller
{
    /**
     * Retrieve all device models.
     */
    public function index(): JsonResponse
    {
        $devices = DeviceModel::all();
        
        return response()->json([
            'status' => 'success',
            'data' => $devices
        ], 200);
    }

    /**
     * Evaluate the precious metal content of a device model.
     * 
     * Unit II: JSON Response
     */
    public function evaluate(Request $request): JsonResponse
    {
        $request->validate([
            'brand' => 'required|string',
            'model_name' => 'required|string',
            'category' => 'nullable|string'
        ]);

        $brand = $request->input('brand');
        $modelName = $request->input('model_name');
        $category = $request->input('category', 'Smartphone');

        // Retrieve model specifications
        $device = DeviceModel::where('brand', 'like', '%' . $brand . '%')
            ->where('model_name', 'like', '%' . $modelName . '%')
            ->first();

        if ($device) {
            return response()->json([
                'status' => 'success',
                'matched' => true,
                'data' => [
                    'brand' => $device->brand,
                    'model_name' => $device->model_name,
                    'category' => $device->category,
                    'precious_metals' => $device->precious_metals,
                    'credit_points' => $device->credit_points,
                    'hazardous_components' => $device->hazardous_components
                ]
            ], 200);
        }

        // Fallback calculation for custom models based on category averages
        $fallbackMetals = [];
        $points = 200;
        $hazardous = ['Lead (in solder)', 'Arsenic (in panel)'];

        switch (strtolower($category)) {
            case 'laptop':
                $fallbackMetals = ['gold' => 0.15, 'silver' => 1.0, 'copper' => 100.0, 'palladium' => 0.05];
                $points = 800;
                $hazardous[] = 'Brominated Flame Retardants (BFRs)';
                $hazardous[] = 'Mercury (in older display tubes)';
                break;
            case 'tablet':
                $fallbackMetals = ['gold' => 0.08, 'silver' => 0.5, 'copper' => 40.0, 'palladium' => 0.025];
                $points = 500;
                $hazardous[] = 'Lithium-ion compounds';
                break;
            case 'desktop':
                $fallbackMetals = ['gold' => 0.25, 'silver' => 2.0, 'copper' => 250.0, 'palladium' => 0.10];
                $points = 1500;
                $hazardous[] = 'Beryllium (Motherboard joints)';
                $hazardous[] = 'Cadmium (in components)';
                break;
            default: // Smartphone
                $fallbackMetals = ['gold' => 0.025, 'silver' => 0.25, 'copper' => 12.0, 'palladium' => 0.012];
                $points = 250;
                $hazardous[] = 'Lithium (in battery)';
                break;
        }

        return response()->json([
            'status' => 'success',
            'matched' => false,
            'data' => [
                'brand' => $brand,
                'model_name' => $modelName,
                'category' => $category,
                'precious_metals' => $fallbackMetals,
                'credit_points' => $points,
                'hazardous_components' => $hazardous
            ]
        ], 200);
    }
}
