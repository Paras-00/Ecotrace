@extends('layouts.app')

@section('content')
<div class="card" style="max-width: 600px; margin: 0 auto;">
    <h2 style="margin-top: 0; margin-bottom: 1.5rem; text-align: center;">
        {{ __('messages.submit_request') }}
    </h2>

    <!-- Display Validation Errors -->
    @if ($errors->any())
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); border-radius: 6px; padding: 1rem; margin-bottom: 1.5rem;">
            <ul style="margin: 0; padding-left: 1.2rem; color: #f87171;">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <!-- Form submission -->
    <form action="{{ route('recycle.store') }}" method="POST" enctype="multipart/form-data">
        <!-- Unit V: CSRF Field -->
        @csrf

        <!-- Unit V: Method Field (demonstrating method field explicitly, though POST is native) -->
        @method('POST')

        <div style="margin-bottom: 1.25rem;">
            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.9rem;">Your Full Name *</label>
            <input type="text" name="user_name" value="{{ old('user_name') }}" required 
                style="width: 100%; padding: 0.75rem; border-radius: 6px; border: 1px solid var(--border-color); background: rgba(0,0,0,0.2); color: white; box-sizing: border-box;">
        </div>

        <div style="margin-bottom: 1.25rem;">
            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.9rem;">Email Address *</label>
            <input type="email" name="user_email" value="{{ old('user_email') }}" required 
                style="width: 100%; padding: 0.75rem; border-radius: 6px; border: 1px solid var(--border-color); background: rgba(0,0,0,0.2); color: white; box-sizing: border-box;">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div>
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.9rem;">Device Brand *</label>
                <select name="device_brand" id="device_brand" required
                    style="width: 100%; padding: 0.75rem; border-radius: 6px; border: 1px solid var(--border-color); background: #0f172a; color: white; box-sizing: border-box;">
                    <option value="">Select Brand</option>
                    <option value="Apple" {{ old('device_brand') == 'Apple' ? 'selected' : '' }}>Apple</option>
                    <option value="Samsung" {{ old('device_brand') == 'Samsung' ? 'selected' : '' }}>Samsung</option>
                    <option value="Dell" {{ old('device_brand') == 'Dell' ? 'selected' : '' }}>Dell</option>
                    <option value="HP" {{ old('device_brand') == 'HP' ? 'selected' : '' }}>HP</option>
                </select>
            </div>
            <div>
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.9rem;">Device Model *</label>
                <input type="text" name="device_model" value="{{ old('device_model') }}" placeholder="e.g. iPhone 14 Pro, XPS 13" required
                    style="width: 100%; padding: 0.75rem; border-radius: 6px; border: 1px solid var(--border-color); background: rgba(0,0,0,0.2); color: white; box-sizing: border-box;">
            </div>
        </div>

        <div style="margin-bottom: 1.25rem;">
            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.9rem;">Serial Number * (Formated like: SN-XXXXXXXX)</label>
            <input type="text" name="serial_number" value="{{ old('serial_number') }}" placeholder="SN-12345678" required 
                style="width: 100%; padding: 0.75rem; border-radius: 6px; border: 1px solid var(--border-color); background: rgba(0,0,0,0.2); color: white; box-sizing: border-box;">
        </div>

        <div style="margin-bottom: 1.25rem;">
            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.9rem;">Target Collection Center *</label>
            <select name="facility_id" required
                style="width: 100%; padding: 0.75rem; border-radius: 6px; border: 1px solid var(--border-color); background: #0f172a; color: white; box-sizing: border-box;">
                <option value="">Select Location</option>
                @foreach ($facilities as $facility)
                    <option value="{{ $facility->id }}" {{ old('facility_id') == $facility->id ? 'selected' : '' }}>
                        {{ $facility->name }} ({{ $facility->city }}, {{ $facility->state }})
                    </option>
                @endforeach
            </select>
        </div>

        <!-- Unit IV: Uploaded Files -->
        <div style="margin-bottom: 1.25rem;">
            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.9rem;">Device Photo Verification *</label>
            <input type="file" name="image" required
                style="width: 100%; padding: 0.5rem; border-radius: 6px; border: 1px solid var(--border-color); background: rgba(0,0,0,0.2); color: white; box-sizing: border-box;">
            <span style="font-size: 0.8rem; color: var(--text-muted);">Format: JPEG, PNG, JPG, WEBP. Max 2MB.</span>
        </div>

        <div style="margin-bottom: 2rem;">
            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.9rem;">Additional Notes</label>
            <textarea name="notes" rows="3" placeholder="Condition details, key components missing, etc."
                style="width: 100%; padding: 0.75rem; border-radius: 6px; border: 1px solid var(--border-color); background: rgba(0,0,0,0.2); color: white; box-sizing: border-box;">{{ old('notes') }}</textarea>
        </div>

        <button type="submit" class="btn" style="width: 100%;">
            Submit Request
        </button>
    </form>
</div>
@endsection
