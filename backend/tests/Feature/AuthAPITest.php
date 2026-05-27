<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\RecycleRequest;

class AuthAPITest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Clear users database for a clean testing sandbox state
        User::truncate();
        RecycleRequest::truncate();
    }

    /**
     * Test user registration successfully.
     */
    public function test_user_registration_success()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Alice Green',
            'email' => 'alice@ecotrace.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123'
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('status', 'success')
                 ->assertJsonStructure([
                     'status',
                     'message',
                     'data' => [
                         'user' => ['id', 'name', 'email'],
                         'token'
                     ]
                 ]);

        $this->assertTrue(User::where('email', 'alice@ecotrace.com')->exists());
    }

    /**
     * Test registration fails with validation errors.
     */
    public function test_user_registration_validation_fails()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => '',
            'email' => 'not-an-email',
            'password' => '123',
            'password_confirmation' => 'abc'
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    /**
     * Test registration fails for duplicate emails.
     */
    public function test_user_registration_duplicate_email()
    {
        // Register first user
        User::create([
            'name' => 'Bob Brown',
            'email' => 'bob@ecotrace.com',
            'password' => bcrypt('password123')
        ]);

        // Attempt duplicate
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Bob Duplicate',
            'email' => 'bob@ecotrace.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test user login successfully.
     */
    public function test_user_login_success()
    {
        // Register user
        User::create([
            'name' => 'Bob Brown',
            'email' => 'bob@ecotrace.com',
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'bob@ecotrace.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('status', 'success')
                 ->assertJsonStructure([
                     'status',
                     'message',
                     'data' => [
                         'user' => ['id', 'name', 'email'],
                         'token'
                     ]
                 ]);
    }

    /**
     * Test login fails with incorrect password.
     */
    public function test_user_login_invalid_credentials()
    {
        // Register user
        User::create([
            'name' => 'Bob Brown',
            'email' => 'bob@ecotrace.com',
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'bob@ecotrace.com',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(401)
                 ->assertJsonPath('status', 'error')
                 ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test user recycling history retrieval.
     */
    public function test_user_recycling_history()
    {
        // Seed a request for our user
        RecycleRequest::create([
            'user_name' => 'Alice Green',
            'user_email' => 'alice@ecotrace.com',
            'device_brand' => 'Apple',
            'device_model' => 'iPhone 13',
            'serial_number' => 'SN-ABC123456',
            'status' => 'pending',
            'credit_points' => 350,
            'facility_id' => 'f1'
        ]);

        $response = $this->getJson('/api/auth/history?email=alice@ecotrace.com');

        $response->assertStatus(200)
                 ->assertJsonPath('status', 'success')
                 ->assertJsonPath('count', 1)
                 ->assertJsonStructure([
                     'status',
                     'count',
                     'data' => [
                         '*' => [
                             'id',
                             'device_brand',
                             'device_model',
                             'serial_number',
                             'credit_points',
                             'status',
                             'notes',
                             'image_url',
                             'created_at'
                         ]
                     ]
                 ]);
    }
}
