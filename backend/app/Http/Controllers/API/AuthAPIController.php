<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\RecycleRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthAPIController extends Controller
{
    /**
     * User registration endpoint.
     * POST /api/auth/register
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|max:100', // Unique check is handled manually to provide a beautiful custom JSON response
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Manually check email unique constraint to return a elegant JSON response
        $existing = User::where('email', $request->email)->first();
        if ($existing) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => [
                    'email' => ['This email address is already registered.']
                ]
            ], 422);
        }

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'credits' => 100,
        ]);

        // Generate token
        $token = sha1($user->email . '|' . time());

        return response()->json([
            'status' => 'success',
            'message' => 'User registered successfully.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'token' => $token
            ]
        ], 201);
    }

    /**
     * User login endpoint.
     * POST /api/auth/login
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Find user
        $user = User::where('email', $request->email)->first();

        // Check password
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials',
                'errors' => [
                    'password' => ['Invalid email address or password.']
                ]
            ], 401);
        }

        // Generate token
        $token = sha1($user->email . '|' . time());

        return response()->json([
            'status' => 'success',
            'message' => 'Logged in successfully.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'token' => $token
            ]
        ], 200);
    }

    /**
     * Retrieve user recycling history.
     * GET /api/auth/history
     */
    public function history(Request $request): JsonResponse
    {
        $email = $request->query('email');
        if (!$email) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email query parameter is required.'
            ], 400);
        }

        $history = RecycleRequest::where('user_email', $email)
            ->orderBy('created_at', 'desc')
            ->get();

        // Map data to display cleanly on the frontend
        $formatted = $history->map(function ($item) {
            return [
                'id' => $item->id,
                'device_brand' => $item->device_brand,
                'device_model' => $item->device_model,
                'serial_number' => $item->serial_number,
                'credit_points' => $item->credit_points,
                'status' => $item->status,
                'notes' => $item->notes,
                'image_url' => $item->image_path ? asset('storage/' . $item->image_path) : null,
                'created_at' => $item->created_at ? $item->created_at->toIso8601String() : null,
            ];
        });

        return response()->json([
            'status' => 'success',
            'count' => $formatted->count(),
            'data' => $formatted
        ], 200);
    }
}
