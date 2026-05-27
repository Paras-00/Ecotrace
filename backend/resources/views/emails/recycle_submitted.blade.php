<!DOCTYPE html>
<html>
<head>
    <title>E-Waste Recycling Request Received</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #10b981;">EcoTrace Recycling Initiative</h2>
        <p>Dear {{ $recycleRequest->user_name }},</p>
        <p>Thank you for participating in eco-friendly disposal. We have received your request to recycle your device. Together, we are preventing hazardous elements from entering the landfill and recovering valuable resources.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f8fafc;">
                <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Brand</th>
                <td style="padding: 10px; border: 1px solid #cbd5e1;">{{ $recycleRequest->device_brand }}</td>
            </tr>
            <tr>
                <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Model</th>
                <td style="padding: 10px; border: 1px solid #cbd5e1;">{{ $recycleRequest->device_model }}</td>
            </tr>
            <tr style="background-color: #f8fafc;">
                <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Serial Number</th>
                <td style="padding: 10px; border: 1px solid #cbd5e1;">{{ $recycleRequest->serial_number }}</td>
            </tr>
            <tr>
                <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Estimated Credits</th>
                <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #10b981;">{{ $recycleRequest->credit_points }} Points</td>
            </tr>
            <tr style="background-color: #f8fafc;">
                <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Status</th>
                <td style="padding: 10px; border: 1px solid #cbd5e1; text-transform: uppercase;">{{ $recycleRequest->status }}</td>
            </tr>
        </table>
        
        <p><strong>Next Steps:</strong> Please bring your device to the designated collection center. Once the center verifies the device details and matches the serial number, your credit points will be finalized in your account.</p>
        
        <p style="font-size: 0.9em; color: #64748b;">This email was sent automatically by EcoTrace Platform. Please do not reply directly to this email.</p>
    </div>
</body>
</html>
