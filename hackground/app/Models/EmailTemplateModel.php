<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class EmailTemplateModel extends Model
{
    protected $table = 'email_templates';
    protected $fillable = ['order', 'status', 'name', 'key'];

    public function createEmailTemplate(array $data)
    {

        $email_templatesId = DB::table('email_templates')->insertGetId([
            'order' => $data['order'],
            'status' => $data['status'],
            'name' => $data['name'],
            'key' => $data['template_key'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $email_templatesNames = array_map(function ($lang, $subject, $content) use ($email_templatesId) {
            return [
                'email_template_id' => $email_templatesId,
                'lang' => $lang,
                'subject' => $subject,
                'content' => $content,
            ];
        }, array_keys($data['subject']), $data['subject'], $data['content']);

        $addEmailTemplate = DB::table('email_templates_names')->insert($email_templatesNames);

        set_flash_message('add');

        return [
            'message' => 'Email Template added successfully.',
            'email_templates_id' => $email_templatesId
        ];
    }

    public function getEmailTemplates($term = null, $lang = '',$peginate)
    {
        $query = DB::table('email_templates')
            ->where('email_templates.status', '!=', config('constants.STATUS_DELETE'));
        if ($term) {
            $query->where('email_templates.name', 'like', "%{$term}%");
        }
        return $query->paginate($peginate);
    }
    public function getEmailTemplatesDetails($id)
    {
        $EmailTemplates = DB::table('email_templates_names')
            ->join('email_templates', 'email_templates_names.email_template_id', '=', 'email_templates.id')
            ->where('email_templates_names.email_template_id', '=', $id) // Filter by email_templates_id, not id
            ->select(
                'email_templates.name',
                'email_templates.key',
                'email_templates_names.content',
                'email_templates_names.subject',
                'email_templates.id as email_templates_id',
                'email_templates.order',
                'email_templates.status',
                'email_templates_names.lang'  // Include language column to identify language
            )
            ->get();



        return $EmailTemplates;
    }
    public function updateEmailTemplate($data)
    {
        DB::beginTransaction();

        try {
            $email_templatesData = [
                'order' => $data['order'],
                'status' => $data['status'],
                'name' => $data['name'],
                'key' => $data['template_key'],
                'updated_at' => now(),
            ];

            DB::table('email_templates')
                ->where('id', $data['email_template_id'])
                ->update($email_templatesData);

            $email_templatesNames = array_map(function ($lang, $subject, $content) use ($data) {
                return [
                    'email_template_id' => $data['email_template_id'],
                    'lang' => $lang,
                    'subject' => $subject,
                    'content' => $content,
                ];
            }, array_keys($data['subject']), $data['subject'], $data['content']);

            foreach ($email_templatesNames as $email_templatesName) {
                DB::table('email_templates_names')
                    ->where('email_template_id', $email_templatesName['email_template_id'])
                    ->where('lang', $email_templatesName['lang'])
                    ->update([
                        'content' => $email_templatesName['content'],
                        'subject' => $email_templatesName['subject'],
                    ]);
            }

            // Commit the transaction
            DB::commit();
            set_flash_message('update');

            return [
                'message' => 'EmailTemplate updated successfully.',
                'email_template_id' => $data['email_template_id'],
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


    public function EmailTemplateStatusUpdate($data)
    {
        DB::table('email_templates')
            ->where('id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'email_templates status updated.',
        ];
    }
    public function DeleteEmailTemplate($id = '')
    {
        $deleteEmailTemplate =  DB::table('email_templates')
            ->where('id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
        set_flash_message('delete');
        return [
            'message' => 'email_templates deleted successfully.',
        ];
    }
    use HasFactory;
}
