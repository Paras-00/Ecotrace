<?php

namespace App\Mail;

use App\Models\RecycleRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RecycleSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    public $recycleRequest;

    /**
     * Create a new message instance.
     */
    public function __construct(RecycleRequest $recycleRequest)
    {
        $this->recycleRequest = $recycleRequest;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'EcoTrace - E-Waste Recycle Request Submitted',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.recycle_submitted',
        );
    }
}
