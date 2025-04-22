<?php

namespace App\Console\Commands;

use App\Models\PrefProperty;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SendWeeklyPropertySuggestions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-weekly-property-suggestions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = DB::table('user_activity')->select('user_id', 'city_id')->distinct()->get();

        foreach ($users as $user) {
            $properties = PrefProperty::select('id', 'name', 'slug')->where('status', 1)
                ->whereHas('location', function ($query) use ($user) {
                    $query->where('city', $user->city_id);
                })
                ->with('location:pid,locality', 'additional:pid,possession_status,bhk_type', 'settings:pid,expected_price,area_in_sqft,parking_ability')
                ->take(5)
                ->get();

            if ($properties->isEmpty()) continue;

            $propertyCardsHtml = generatePropertyCardHTML($properties);

            $email = getField('email', 'users', 'id', $user->user_id);

            $data_parse = [
                'username' => getField('name', 'users', 'id', $user->user_id),
                'location' => get_name_by_id('city_names', 'city_id', $user->city_id, 'en'),
                'property_cards' => $propertyCardsHtml,
                'All_PROPERTY_LINK' => config('app.frontend_url') . '/property-listing?' . http_build_query([
                    'city'     => $user->city_id
                ]),

            ];

            SendMail($email, 'property_suggestions', $data_parse);
        }

        logger("Weekly property suggestions sent.");
    }
}
