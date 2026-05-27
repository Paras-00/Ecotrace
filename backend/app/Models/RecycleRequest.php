<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class RecycleRequest extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'recycle_requests';

    protected $fillable = [
        'user_name',
        'user_email',
        'device_brand',
        'device_model',
        'serial_number',
        'status',
        'credit_points',
        'notes',
        'image_path',
        'facility_id'
    ];

    protected $casts = [
        'credit_points' => 'integer',
    ];

    /**
     * Get the facility associated with this request.
     */
    public function facility()
    {
        return $this->belongsTo(Facility::class, 'facility_id');
    }
}
