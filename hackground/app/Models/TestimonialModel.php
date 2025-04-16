<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class TestimonialModel extends Model
{

    /**
     * Create a new testimonial and store it in the database.
     */
    public function createTestimonial(array $data)
    {

        $testimonialId = DB::table('testimonial')->insertGetId([
            'image' => $data['image'] ?? null,
            'order' => $data['order'],
            'status' => $data['status'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $testimonialNames = array_map(function ($lang, $name, $subname, $description) use ($testimonialId) {
            return [
                'testimonial_id' => $testimonialId,
                'lang' => $lang,
                'name' => $name,
                'subname' => $subname,
                'description' => $description,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, array_keys($data['name']), $data['name'], $data['subname'], $data['description']);

        $addTestimonial = DB::table('testimonial_names')->insert($testimonialNames);

        return [
            'message' => 'Testimonial added successfully.',
            'testimonial_id' => $testimonialId
        ];
    }

    public function getTestimonials($term = null,$lang ='',$peginate)
    {
        $query = DB::table('testimonial_names')
            ->join('testimonial', 'testimonial_names.testimonial_id', '=', 'testimonial.id')
            ->where([
                ['testimonial_names.lang', '=', $lang],
                ['testimonial.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                'testimonial.id',
                'testimonial_names.name',
                'testimonial_names.subname',
                'testimonial.order',
                'testimonial.status',
                'testimonial.image'
            );
        if ($term) {
            $query->where('testimonial_names.name', 'like', "%{$term}%");
        }
        return $query->orderBy('testimonial.created_at','desc')->paginate($peginate);
    }
    public function getTestimonialsDetails($id)
    {
        $Testimonials = DB::table('testimonial_names')
            ->join('testimonial', 'testimonial_names.testimonial_id', '=', 'testimonial.id')
            ->where('testimonial_names.testimonial_id', '=', $id) // Filter by testimonial_id, not id
            ->select(
                'testimonial_names.id',
                'testimonial_names.name',
                'testimonial_names.subname',
                'testimonial_names.description',
                'testimonial.id as testimonial_id',
                'testimonial.order',
                'testimonial.status',
                'testimonial.image',
                'testimonial_names.lang'  // Include language column to identify language
            )
            ->get();



        return $Testimonials;
    }
    public function updateTestimonial($data)
    {
        DB::beginTransaction();

        try {
            $testimonialData = [
                'order' => $data['order'],
                'status' => $data['status'],
                'image' => $data['image'],
                'updated_at' => now(),
            ];

            DB::table('testimonial')
                ->where('id', $data['testimonial_id'])
                ->update($testimonialData);

            $testimonialNames = array_map(function ($lang, $name, $subname, $description) use ($data) {
                return [
                    'testimonial_id' => $data['testimonial_id'],
                    'lang' => $lang,
                    'name' => $name,
                    'subname' => $subname,
                    'description' => $description,
                    'updated_at' => now(),
                ];
            }, array_keys($data['name']), $data['name'], $data['subname'], $data['description']);

            foreach ($testimonialNames as $testimonialName) {
                DB::table('testimonial_names')
                    ->where('testimonial_id', $testimonialName['testimonial_id'])
                    ->where('lang', $testimonialName['lang'])
                    ->update([
                        'name' => $testimonialName['name'],
                        'subname' => $testimonialName['subname'],
                        'description' => $testimonialName['description'],
                        'updated_at' => $testimonialName['updated_at'],
                    ]);
            }

            // Commit the transaction
            DB::commit();
            

            return [
                'message' => 'Testimonial updated successfully.',
                'testimonial_id' => $data['testimonial_id'],
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


    public function TestimonialStatusUpdate($data)
    {
        DB::table('testimonial')
            ->where('id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'testimonial status updated.',
        ];
    }
    public function DeleteTestimonial($id = '')
    {
        $deleteTestimonial =  DB::table('testimonial')
            ->where('id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
      
        return [
            'message' => 'testimonial deleted successfully.',
        ];
    }
    use HasFactory;
}
