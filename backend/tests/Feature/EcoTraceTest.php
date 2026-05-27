<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Facility;
use App\Models\DeviceModel;

class EcoTraceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    /**
     * Test facility list API.
     */
    public function test_facility_list_api_returns_success()
    {
        $response = $this->getJson('/api/facilities');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'status',
                     'count',
                     'data'
                 ]);
    }

    /**
     * Test device evaluation API with exact match.
     */
    public function test_device_evaluation_exact_match()
    {
        $response = $this->postJson('/api/devices/evaluate', [
            'brand' => 'Apple',
            'model_name' => 'iPhone 13'
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('status', 'success')
                 ->assertJsonPath('data.brand', 'Apple')
                 ->assertJsonPath('data.model_name', 'iPhone 13');
    }

    /**
     * Test device evaluation API with fallback calculations.
     */
    public function test_device_evaluation_fallback()
    {
        $response = $this->postJson('/api/devices/evaluate', [
            'brand' => 'CustomBrand',
            'model_name' => 'CustomModel101',
            'category' => 'Laptop'
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('status', 'success')
                 ->assertJsonPath('matched', false)
                 ->assertJsonPath('data.credit_points', 800);
    }

    /**
     * Test validation failure with invalid serial numbers.
     */
    public function test_recycle_submission_validation_fails_on_invalid_serial()
    {
        // First get a facility from DB to use
        $facility = Facility::first();
        $facilityId = $facility ? $facility->id : 'mock_id';

        $response = $this->postJson('/api/recycle-requests', [
            'user_name' => 'John Doe',
            'user_email' => 'john@example.com',
            'device_brand' => 'Apple',
            'device_model' => 'iPhone 13',
            'serial_number' => 'INVALID-1234', // Doesn't match SN- prefix
            'facility_id' => $facilityId
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['serial_number']);
    }
}
