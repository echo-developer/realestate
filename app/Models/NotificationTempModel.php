<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class NotificationTempModel extends Model
{
    use HasFactory;

    public function getdata($term = '',$lang='',$peginate=10)
    {
        $query = DB::table('pref_notification_templates')
            ->where('pref_notification_templates.status', '!=', config('constants.STATUS_DELETE'));
        if ($term) {
            $query->where('pref_notification_templates.template_for', 'like', "%{$term}%");
        }
        return $query->paginate($peginate);
    }
 
public function createNotificationTemplate(array $data)
{

    $notification_templatesId = DB::table('pref_notification_templates')->insertGetId([
        'order' => $data['order'],
        'status' => $data['status'],
        'template_for' => $data['name'],
        'template_key' => $data['template_key'],
        'all_template_keys' => $data['all_template_keys'],
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $notification_templatesNames = array_map(function ($lang, $content) use ($notification_templatesId, $data) {
        return [
            'notification_template_id' => $notification_templatesId,
            'lang' => $lang,
            'content' => $content,
        ];
    }, array_keys($data['content']),$data['content']);

     DB::table('pref_notification_templates_names')->insert($notification_templatesNames);

    

    return [
        'message' => 'Notification Template added successfully.',
        'notification_templates_id' => $notification_templatesId
    ];
}
public function getnotificationsDetails($id)
{
    $NotificationTemplates = DB::table('pref_notification_templates_names')
        ->join('pref_notification_templates', 'pref_notification_templates_names.notification_template_id', '=', 'pref_notification_templates.id')
        ->where('pref_notification_templates_names.notification_template_id', '=', $id) // Filter by notification_templates_id, not id
        ->select(
            'pref_notification_templates.template_for',
            'pref_notification_templates.template_key',
            'pref_notification_templates.all_template_keys',
            'pref_notification_templates_names.content',
            'pref_notification_templates.id as notification_templates_id',
            'pref_notification_templates.order',
            'pref_notification_templates.status',
            'pref_notification_templates_names.lang'  
        )
        ->get();



    return $NotificationTemplates;
}
public function updateNotificationTemplate($data)
{
    DB::beginTransaction();

    try {
        $notification_templatesData = [
            'order' => $data['order'],
            'status' => $data['status'],
            'template_for' => $data['name'],
            'all_template_keys' => $data['all_template_keys'],
            'updated_at' => now(),
        ];

        DB::table('pref_notification_templates')
            ->where('id', $data['notification_template_id'])
            ->update($notification_templatesData);

            $notification_templatesNames = array_map(function ($lang, $content) use ( $data) {
                return [
                    'notification_template_id' => $data['notification_template_id'],
                    'lang' => $lang,
                    'content' => $content,
                ];
            }, array_keys($data['content']), $data['content']);

        foreach ($notification_templatesNames as $notification_templatesName) {
            DB::table('pref_notification_templates_names')
                ->where('notification_template_id', $notification_templatesName['notification_template_id'])
                ->where('lang', $notification_templatesName['lang'])
                ->update([
                    'content' => $notification_templatesName['content'],
                ]);
        }

        // Commit the transaction
        DB::commit();

        return [
            'message' => 'notificationTemplate updated successfully.',
            'notification_template_id' => $data['notification_template_id'],
        ];
    } catch (\Exception $e) {
        // Rollback the transaction in case of an error
        DB::rollBack();

        return [
            'error' => 'Something went wrong! Please try again later.',
            'details' => $e->getMessage(),
        ];
    }
}
public function NotificationStatusUpdate($data)
{
    DB::table('pref_notification_templates')
        ->where('id', $data['id'])
        ->update([
            'status' => $data['status'],
            'updated_at' => now(),
        ]);
    return [
        'message' => 'notification_templates status updated.',
    ];
}
public function DeleteNotificationTmplate($id = '')
    {
        $deleteEmailTemplate =  DB::table('pref_notification_templates')
            ->where('id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
     
        return [
            'message' => 'Notification Templates deleted successfully.',
        ];
    }
}