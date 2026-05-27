<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Facility extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'facilities';
    
    protected $fillable = [
        'name',
        'address',
        'city',
        'state',
        'zip',
        'latitude',
        'longitude',
        'phone',
        'email',
        'accepted_items',
        'rating'
    ];

    protected $casts = [
        'latitude' => 'double',
        'longitude' => 'double',
        'rating' => 'double',
    ];
}
