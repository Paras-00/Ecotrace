<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\RecycleRequest;
use App\Models\DeviceModel;
use App\Rules\ValidSerialNumber;
use App\Mail\RecycleSubmitted;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class RecycleRequestAPIController extends Controller
{
    /**
     * Create a new recycling submission via API.
     * 
     * Unit IV: Request Data Retrieval, Uploaded Files
     * Unit V: Form Validation (API context)
     * Unit VI: Eloquent CRUD Create & REST APIs
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Validate incoming API request
        $validatedData = $request->validate([
            'user_name' => 'required|string|max:100',
            'user_email' => 'required|email|max:100',
            'device_brand' => 'required|string|max:50',
            'device_model' => 'required|string|max:50',
            'serial_number' => ['required', new ValidSerialNumber],
            'facility_id' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // 2MB max
            'notes' => 'nullable|string|max:500'
        ]);

        // 2. Fetch device credit details
        $deviceMatch = DeviceModel::where('brand', $validatedData['device_brand'])
            ->where('model_name', $validatedData['device_model'])
            ->first();
            
        $points = $deviceMatch ? $deviceMatch->credit_points : 250;

        // 3. Handle File Upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('devices', 'public');
        }

        // 4. Save to MongoDB
        $recycleRequest = RecycleRequest::create([
            'user_name' => $validatedData['user_name'],
            'user_email' => $validatedData['user_email'],
            'device_brand' => $validatedData['device_brand'],
            'device_model' => $validatedData['device_model'],
            'serial_number' => $validatedData['serial_number'],
            'status' => 'pending',
            'credit_points' => $points,
            'notes' => $request->input('notes'),
            'image_path' => $imagePath,
            'facility_id' => $validatedData['facility_id']
        ]);

        // 5. Send notification email
        try {
            Mail::to($recycleRequest->user_email)->send(new RecycleSubmitted($recycleRequest));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning("API Mail failed: " . $e->getMessage());
        }

        // 6. Return response in JSON
        return response()->json([
            'status' => 'success',
            'message' => 'E-Waste recycling request registered successfully.',
            'data' => [
                'id' => $recycleRequest->id,
                'user_name' => $recycleRequest->user_name,
                'device_model' => $recycleRequest->device_model,
                'credit_points' => $recycleRequest->credit_points,
                'status' => $recycleRequest->status
            ]
        ], 201);
    }
}
