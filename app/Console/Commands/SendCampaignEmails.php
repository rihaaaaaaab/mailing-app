<?php

namespace App\Console\Commands;

use App\Models\Campaign;
use App\Models\CampaignLog;
use App\Models\Contact;
use App\Models\ContactList;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Carbon;
use Resend\Laravel\Facades\Resend;

class SendCampaignEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'campaigns:send';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send campaign emails to contact lists';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();
        $currentDay = $now->format('l'); 
        $currentTime = $now->format('H:i:s');
        $currentDate = $now->format('Y-m-d');

        $this->info("Current time: {$currentTime}");
        $this->info("Current day: {$currentDay}");
        $this->info("Current date: {$currentDate}");

        // Get all campaigns that match date and day criteria
        $campaigns = Campaign::whereDate('start_date', '<=', $currentDate)
            ->whereJsonContains('days_active', $currentDay)
            ->get();

        $this->info("\nFound {$campaigns->count()} campaigns matching date and day criteria");

        // Filter campaigns by time in PHP
        $campaignsToProcess = $campaigns->filter(function($campaign) use ($currentTime) {
            $startTime = Carbon::createFromFormat('H:i:s', $campaign->time_start);
            $endTime = Carbon::createFromFormat('H:i:s', $campaign->time_end);
            $currentTimeObj = Carbon::createFromFormat('H:i:s', $currentTime);

            // If end time is less than start time, it means it spans to the next day
            if ($endTime->lt($startTime)) {
                $endTime->addDay();
            }

            $isWithinTime = $startTime->lte($currentTimeObj) && $endTime->gte($currentTimeObj);

            $this->info("\nCampaign: {$campaign->name}");
            $this->info("Time start: {$campaign->time_start}");
            $this->info("Time end: {$campaign->time_end}");
            $this->info("Is within time range: " . ($isWithinTime ? '✓' : '✗'));

            return $isWithinTime;
        });

        $this->info("\nFound {$campaignsToProcess->count()} campaigns to process");

        foreach ($campaignsToProcess as $campaign) {
            $this->sendCampaign($campaign);
        }
    }

    private function sendCampaign(Campaign $campaign)
    {
        $this->info("\nProcessing campaign: {$campaign->name}");

        // Create campaign log
        $log = CampaignLog::create([
            'campaign_id' => $campaign->id,
            'started_at' => now(),
        ]);

        $list = ContactList::find($campaign->list_id);
        if (!$list) {
            $this->error("List not found for campaign {$campaign->id}");
            $log->update([
                'completed_at' => now(),
                'errors' => ['List not found']
            ]);
            return;
        }

        $this->info("Found list: {$list->name}");

        $contacts = $list->contacts()
            ->whereDoesntHave('campaigns', function ($query) use ($campaign) {
                $query->where('campaign_id', $campaign->id);
            })
            ->get();

        $this->info("Found {$contacts->count()} contacts to send to");

        $log->update(['total_contacts' => $contacts->count()]);
        $errors = [];

        foreach ($contacts as $contact) {
            try {
                $this->info("Sending to: {$contact->email}");
                
                Mail::send([], [], function ($message) use ($campaign, $contact) {
                    $templateContent = $campaign->template_id 
                        ? \App\Models\Template::find($campaign->template_id)->content 
                        : $campaign->body;

                    $message->from(config('mail.from.address'))
                        ->to($contact->email)
                        ->subject($campaign->subject)
                        ->html($templateContent); // Use the html() method to set the body
                });

                $campaign->contacts()->attach($contact->id);
                $log->increment('successful_sends');
                $this->info("Successfully sent to {$contact->email}");
            } catch (\Exception $e) {
                $log->increment('failed_sends');
                $errors[] = [
                    'email' => $contact->email,
                    'error' => $e->getMessage()
                ];
                $this->error("Failed to send to {$contact->email}: {$e->getMessage()}");
            }
        }

        // Update log with completion status
        $log->update([
            'completed_at' => now(),
            'errors' => $errors
        ]);

        $this->info("Completed processing campaign: {$campaign->name}");
    }
}
