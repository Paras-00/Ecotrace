<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Models\DeviceModel;
use App\Models\RecycleRequest;
use App\Rules\ValidSerialNumber;
use App\Mail\RecycleSubmitted;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\View\View;

class RecycleWebController extends Controller
{
    /**
     * Display the e-waste recycle registration form.
     */
    public function index(): View
    {
        $facilities = Facility::all();
        $deviceModels = DeviceModel::all();
        
        return view('web.recycle_form', compact('facilities', 'deviceModels'));
    }

    /**
     * Store a new recycling submission.
     * 
     * Unit IV: Request Data Retrieval, Uploaded Files, Cookies
     * Unit V: Form Validation, Custom Rules, Repopulating Forms
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. Perform Laravel Form Validation with Custom Rule and Custom Error Messages
        $validatedData = $request->validate([
            'user_name' => 'required|string|max:100',
            'user_email' => 'required|email|max:100',
            'device_brand' => 'required|string|max:50',
            'device_model' => 'required|string|max:50',
            'serial_number' => ['required', new ValidSerialNumber],
            'facility_id' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048', // max 2MB file
            'notes' => 'nullable|string|max:500'
        ], [
            'user_name.required' => 'Please enter your name.',
            'user_email.required' => 'An email address is required to receive confirmation.',
            'image.required' => 'You must upload a photo of your device for verification.',
            'image.max' => 'The uploaded photo must not exceed 2MB in size.'
        ]);

        // 2. Retrieve precious metal credit points based on selected model
        $deviceMatch = DeviceModel::where('brand', $validatedData['device_brand'])
            ->where('model_name', $validatedData['device_model'])
            ->first();
            
        $points = $deviceMatch ? $deviceMatch->credit_points : 250; // default 250 points

        // 3. Handle File Upload (Image)
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('devices', 'public');
        }

        // 4. Create Recycle Request using Eloquent ORM (Unit VI)
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

        // 5. Unit IV: Sending Emails
        try {
            Mail::to($recycleRequest->user_email)->send(new RecycleSubmitted($recycleRequest));
        } catch (\Exception $e) {
            // Log mail failure, continue flow
            \Illuminate\Support\Facades\Log::warning("Email failed to send: " . $e->getMessage());
        }

        // 6. Unit IV: Laravel Session - Storing Session Data
        session([
            'last_submission_id' => $recycleRequest->id,
            'last_earned_points' => $points,
            'success_flash' => __('messages.success_message')
        ]);

        // 7. Unit II: Redirecting to Named Routes
        return redirect()->route('recycle.success');
    }

    /**
     * Display success confirmation.
     * 
     * Unit IV: Accessing Session Data
     */
    public function success(): View
    {
        $submissionId = session('last_submission_id');
        
        if (!$submissionId) {
            return redirect()->route('recycle.form');
        }

        $recycleRequest = RecycleRequest::find($submissionId);
        
        return view('web.recycle_success', compact('recycleRequest'));
    }
}
