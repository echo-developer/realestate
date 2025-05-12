<?php

namespace App\Http\Controllers\Api;

use App\Models\BadgesNames;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BadgesController extends Controller
{
    public function getBadges(Request $request)
    {
        $lang = $request->input('lang');

        $badges = BadgesNames::with(['badge' => function ($query) {
            $query->select('badge_id', 'icon', 'status');
        }])
            ->whereHas('badge', function ($query) {
                $query->where('status', '!=', config('constants.STATUS_DELETE'));
            })
            ->where('lang', $lang)
            ->select('badge_id', 'name', 'description')
            ->orderByDesc('badge_id')
            ->get();

        if ($badges->isEmpty()) {
            return response()->json([
                'status' => 0,
                'message' => 'No badges found for the selected language.',
                'data' => []
            ]);
        }

        $formattedBadges = $badges->map(function ($badge) {
            return [
                'badge_id' => $badge->badge->badge_id ?? null,
                'icon' => isset($badge->badge->icon) ? asset('user_upload/badges/' . $badge->badge->icon) : null,
                'badge_name' => $badge->name,
                'description' => $badge->description,
            ];
        });

        return response()->json([
            'status' => 1,
            'message' => 'Badges fetched successfully.',
            'data' => $formattedBadges
        ]);
    }
}
