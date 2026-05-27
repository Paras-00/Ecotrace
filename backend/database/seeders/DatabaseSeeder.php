<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\DeviceModel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Clear existing data in MongoDB
        Facility::truncate();
        DB::connection('mongodb')->table('device_models')->truncate();
        DB::connection('mongodb')->table('recycle_requests')->truncate();

        // 2. Seed Facilities using Eloquent ORM
        $facilities = [
            [
                'name' => 'GreenTech Recycling Hub',
                'address' => '540 W 26th St',
                'city' => 'New York',
                'state' => 'NY',
                'zip' => '10001',
                'latitude' => 40.7490,
                'longitude' => -74.0041,
                'phone' => '+1 (212) 555-0199',
                'email' => 'ny@greentechrecycle.com',
                'accepted_items' => ['Smartphone', 'Laptop', 'Tablet', 'Battery', 'Charger'],
                'rating' => 4.8
            ],
            [
                'name' => 'EcoCycle Solutions',
                'address' => '850 Marina Blvd',
                'city' => 'San Francisco',
                'state' => 'CA',
                'zip' => '94123',
                'latitude' => 37.8066,
                'longitude' => -122.4410,
                'phone' => '+1 (415) 555-0144',
                'email' => 'sf@ecocyclesolutions.com',
                'accepted_items' => ['Smartphone', 'Laptop', 'Tablet', 'Desktop', 'Monitor', 'Printer'],
                'rating' => 4.7
            ],
            [
                'name' => 'Silicon Valley E-Waste Depot',
                'address' => '1201 Schallenberger Rd',
                'city' => 'San Jose',
                'state' => 'CA',
                'zip' => '95131',
                'latitude' => 37.3688,
                'longitude' => -121.8906,
                'phone' => '+1 (408) 555-0122',
                'email' => 'sanjose@ewastedepot.com',
                'accepted_items' => ['Smartphone', 'Laptop', 'Tablet', 'Desktop', 'Monitor', 'Server', 'Battery'],
                'rating' => 4.9
            ],
            [
                'name' => 'Metro E-Recyclers',
                'address' => '1420 N Halsted St',
                'city' => 'Chicago',
                'state' => 'IL',
                'zip' => '60642',
                'latitude' => 41.9078,
                'longitude' => -87.6483,
                'phone' => '+1 (312) 555-0188',
                'email' => 'chicago@metroerecyclers.com',
                'accepted_items' => ['Smartphone', 'Laptop', 'Tablet', 'Battery', 'Television', 'Audio Gear'],
                'rating' => 4.5
            ],
            [
                'name' => 'Texas Green Disposal',
                'address' => '2300 E 7th St',
                'city' => 'Austin',
                'state' => 'TX',
                'zip' => '78702',
                'latitude' => 30.2592,
                'longitude' => -97.7188,
                'phone' => '+1 (512) 555-0177',
                'email' => 'austin@texasgreendisposal.com',
                'accepted_items' => ['Smartphone', 'Laptop', 'Tablet', 'Desktop', 'Monitor', 'Battery', 'Charger'],
                'rating' => 4.6
            ],
            [
                'name' => 'Pacific Northwest Recycling',
                'address' => '4735 E Marginal Way S',
                'city' => 'Seattle',
                'state' => 'WA',
                'zip' => '98134',
                'latitude' => 47.5615,
                'longitude' => -122.3392,
                'phone' => '+1 (206) 555-0155',
                'email' => 'seattle@pnwrecycling.com',
                'accepted_items' => ['Smartphone', 'Laptop', 'Tablet', 'Desktop', 'Monitor', 'Printer', 'Cable'],
                'rating' => 4.8
            ]
        ];

        foreach ($facilities as $facility) {
            Facility::create($facility);
        }

        // 3. Seed Device Models using Query Builder
        $devices = [
            [
                'brand' => 'Apple',
                'model_name' => 'iPhone 13',
                'category' => 'Smartphone',
                'precious_metals' => ['gold' => 0.034, 'silver' => 0.35, 'copper' => 15.0, 'palladium' => 0.015],
                'credit_points' => 350,
                'hazardous_components' => ['Lead (in solder)', 'Cadmium (in batteries)', 'Arsenic (in display glass)'],
            ],
            [
                'brand' => 'Apple',
                'model_name' => 'iPhone 14 Pro',
                'category' => 'Smartphone',
                'precious_metals' => ['gold' => 0.040, 'silver' => 0.40, 'copper' => 18.0, 'palladium' => 0.018],
                'credit_points' => 450,
                'hazardous_components' => ['Lead (in circuit boards)', 'Mercury (in LCD screens)', 'Lithium (in battery)'],
            ],
            [
                'brand' => 'Samsung',
                'model_name' => 'Galaxy S22',
                'category' => 'Smartphone',
                'precious_metals' => ['gold' => 0.030, 'silver' => 0.30, 'copper' => 14.0, 'palladium' => 0.014],
                'credit_points' => 320,
                'hazardous_components' => ['Lead (in solder)', 'Cadmium (in battery cells)', 'Arsenic (in panel glass)'],
            ],
            [
                'brand' => 'Samsung',
                'model_name' => 'Galaxy S23 Ultra',
                'category' => 'Smartphone',
                'precious_metals' => ['gold' => 0.038, 'silver' => 0.38, 'copper' => 16.0, 'palladium' => 0.017],
                'credit_points' => 420,
                'hazardous_components' => ['Lead', 'Cadmium', 'Beryllium (in motherboard connectors)'],
            ],
            [
                'brand' => 'Apple',
                'model_name' => 'MacBook Pro 14" (M2)',
                'category' => 'Laptop',
                'precious_metals' => ['gold' => 0.220, 'silver' => 1.50, 'copper' => 150.0, 'palladium' => 0.080],
                'credit_points' => 1200,
                'hazardous_components' => ['Lead (in circuit boards)', 'Brominated Flame Retardants (BFRs in plastics)', 'Mercury (in backlights)', 'Beryllium (in board connectors)'],
            ],
            [
                'brand' => 'Dell',
                'model_name' => 'XPS 13',
                'category' => 'Laptop',
                'precious_metals' => ['gold' => 0.180, 'silver' => 1.20, 'copper' => 120.0, 'palladium' => 0.065],
                'credit_points' => 950,
                'hazardous_components' => ['Lead', 'Brominated Flame Retardants (BFRs in casing)', 'Cadmium (in battery pack)'],
            ],
            [
                'brand' => 'Apple',
                'model_name' => 'iPad Air (5th Gen)',
                'category' => 'Tablet',
                'precious_metals' => ['gold' => 0.090, 'silver' => 0.60, 'copper' => 45.0, 'palladium' => 0.030],
                'credit_points' => 600,
                'hazardous_components' => ['Lead', 'Mercury (in LCD panel)', 'Lithium-ion battery materials'],
            ],
            [
                'brand' => 'HP',
                'model_name' => 'EliteBook 840 G9',
                'category' => 'Laptop',
                'precious_metals' => ['gold' => 0.170, 'silver' => 1.10, 'copper' => 110.0, 'palladium' => 0.060],
                'credit_points' => 900,
                'hazardous_components' => ['Lead (solder and connectors)', 'Brominated Flame Retardants (BFRs)', 'Mercury (display backlighting)'],
            ]
        ];

        foreach ($devices as $device) {
            DB::connection('mongodb')->table('device_models')->insert($device);
        }
    }
}
