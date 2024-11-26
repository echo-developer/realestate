<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class EmailTemplateModel extends Model
{
    public function createEmailTemplate(array $data)
    {

        $email_templatesId = DB::table('pref_email_templates')->insertGetId([
            'order' => $data['order'],
            'status' => $data['status'],
            'name' => $data['name'],
            'key' => $data['template_key'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $email_templatesNames = array_map(function ($lang, $subject, $content) use ($email_templatesId, $data) {
            return [
                'email_template_id' => $email_templatesId,
                'lang' => $lang,
                'subject' => $subject,
                'content' => $content,
            ];
        }, array_keys($data['subject']), $data['subject'], $data['content']);

        $addEmailTemplate = DB::table('pref_email_templates_names')->insert($email_templatesNames);

        set_flash_message('add');

        return [
            'message' => 'Email Template added successfully.',
            'email_templates_id' => $email_templatesId
        ];
    }

    public function getEmailTemplates($term = null, $lang = '')
    {
        $query = DB::table('pref_email_templates')
            ->where('pref_email_templates.status', '!=', config('constants.STATUS_DELETE'));
        if ($term) {
            $query->where('pref_email_templates.name', 'like', "%{$term}%");
        }
        return $query->paginate(2);
    }
    public function getEmailTemplatesDetails($id)
    {
        $EmailTemplates = DB::table('pref_email_templates_names')
            ->join('pref_email_templates', 'pref_email_templates_names.email_templates_id', '=', 'pref_email_templates.id')
            ->where('pref_email_templates_names.email_templates_id', '=', $id) // Filter by email_templates_id, not id
            ->select(
                'pref_email_templates_names.id',
                'pref_email_templates_names.name',
                'pref_email_templates_names.subname',
                'pref_email_templates_names.description',
                'pref_email_templates.id as email_templates_id',
                'pref_email_templates.order',
                'pref_email_templates.status',
                'pref_email_templates.image',
                'pref_email_templates_names.lang'  // Include language column to identify language
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
                'image' => $data['image'],
                'updated_at' => now(),
            ];

            DB::table('pref_email_templates')
                ->where('id', $data['email_templates_id'])
                ->update($email_templatesData);

            $email_templatesNames = array_map(function ($lang, $name, $subname, $description) use ($data) {
                return [
                    'email_templates_id' => $data['email_templates_id'],
                    'lang' => $lang,
                    'name' => $name,
                    'subname' => $subname,
                    'description' => $description,
                    'updated_at' => now(),
                ];
            }, array_keys($data['name']), $data['name'], $data['subname'], $data['description']);

            foreach ($email_templatesNames as $email_templatesName) {
                DB::table('pref_email_templates_names')
                    ->where('email_templates_id', $email_templatesName['email_templates_id'])
                    ->where('lang', $email_templatesName['lang'])
                    ->update([
                        'name' => $email_templatesName['name'],
                        'subname' => $email_templatesName['subname'],
                        'description' => $email_templatesName['description'],
                        'updated_at' => $email_templatesName['updated_at'],
                    ]);
            }

            // Commit the transaction
            DB::commit();
            set_flash_message('update');

            return [
                'message' => 'EmailTemplate updated successfully.',
                'email_templates_id' => $data['email_templates_id'],
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
        DB::table('pref_email_templates')
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
        $deleteEmailTemplate =  DB::table('pref_email_templates')
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
