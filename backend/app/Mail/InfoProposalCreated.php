<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InfoProposalCreated extends Mailable
{
    use Queueable, SerializesModels;

    public int $proposalId;
    public string $proposalName;
    public string $pathToProposal;

    /**
     * Create a new message instance.
     */
    public function __construct($proposalId, $proposalName, $pathToProposal)
    {
        $this->proposalId = $proposalId;
        $this->proposalName = $proposalName;
        $this->pathToProposal = $pathToProposal;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Es gibt eine neue Bewerbung '. $this->proposalId .' | There is a new application '. $this->proposalId,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.infoProposalCreated',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
