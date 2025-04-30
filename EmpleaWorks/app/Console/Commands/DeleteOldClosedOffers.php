<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Console\Scheduling\Schedule;
use App\Http\Controllers\CompanyController;

class DeleteOldClosedOffers extends Command
{
    protected $signature = 'offers:delete-old-closed';
    protected $description = 'Delete job offers closed for more than 10 days';

    public function handle()
    {
        $controller = new CompanyController();
        $deleted = $controller->deleteOldClosedOffers();
        $this->info("Deleted {$deleted} old closed offers.");
        return 0;
    }

    /**
     * Define the command's schedule.
     */
    public function schedule(Schedule $schedule): void
    {
        $schedule->command(static::class)->daily();
    }
}
