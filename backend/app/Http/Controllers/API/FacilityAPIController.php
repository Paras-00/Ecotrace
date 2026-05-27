<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FacilityAPIController extends Controller
{
    /**
     * Get list of e-waste collection facilities.
     * 
     * Unit II: JSON Response
     * Unit VI: Implementing Rest APIs for the website
     */
    public function index(Request $request): JsonResponse
    {
        $query = Facility::query();

        // Optional filtering by city
        if ($request->has('city')) {
            $query->where('city', 'like', '%' . $request->query('city') . '%');
        }

        // Optional filtering by zip
        if ($request->has('zip')) {
            $query->where('zip', $request->query('zip'));
        }

        // Optional filtering by accepted items
        if ($request->has('category')) {
            $query->where('accepted_items', 'all', [$request->query('category')]);
        }

        $facilities = $query->get();

        return response()->json([
            'status' => 'success',
            'count' => $facilities->count(),
            'data' => $facilities
        ], 200);
    }

    /**
     * Get details for a single facility.
     */
    public function show(string $id): JsonResponse
    {
        $facility = Facility::find($id);

        if (!$facility) {
            return response()->json([
                'status' => 'error',
                'message' => 'Collection center not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $facility
        ], 200);
    }
}
