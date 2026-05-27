<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class DeviceModel extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'device_models';

    protected $fillable = [
        'brand',
        'model_name',
        'category',
        'precious_metals', // object/array: {gold, silver, copper, palladium}
        'credit_points',
        'hazardous_components' // array
    ];

    protected $casts = [
        'credit_points' => 'integer'
    ];
}
