<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TestimonialModel;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    protected $testimonialModel;

    /**
     * Inject TestimonialModel via Dependency Injection.
     */
    public function __construct(TestimonialModel $testimonialModel)
    {
        $this->testimonialModel = $testimonialModel;
    }
    public function TestimonialView(Request $request)
    {
        $term = $request->input('term');
        $data = $this->testimonialModel->getTestimonials($term);
        return view('Management.testimonial', compact('data'));
        // 
    }

    public function TestimonialImage(Request $req)
    {
        $req->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        if ($req->hasFile('file')) {

            $file = $req->file('file');
            $fileName = time() . '-' . $file->getClientOriginalName();
            $file->move(public_path('testimonial_image'), $fileName);


            return response()->json(['fileName' => $fileName]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }

    public function deleteTestimonialImage(Request $req)
    {
        $filePath = public_path('testimonial_image/' . $req->file);

        if (file_exists($filePath)) {
            unlink($filePath);
            return response()->json(['success' => 'File deleted successfully']);
        }

        return response()->json(['error' => 'File not found', $filePath], 404);
    }

    public function addTestimonial(Request $req)
    {
        $langs = array_keys($req->input('name', []));


        $rules = [
            'order' => 'required|integer',
            'status' => 'required|boolean',
            'image' => 'nullable|string',
            'id' => 'nullable|integer',
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
            $rules["subname.$lang"] = 'required|string|max:255';
            $rules["description.$lang"] = 'required|string|max:255';
        }
        $messages = [
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.',
            'id.required' => 'The ID field is required.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
            $messages["subname.$lang.required"] = "The Name ($lang) field is required.";
            $messages["description.$lang.required"] = "The Name ($lang) field is required.";
        }

        $validated = $req->validate($rules, $messages);

        try {
            $response = $this->testimonialModel->createTestimonial($validated);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    public function TestimonialDetails($id = null)
    {
        if ($id === null) {
            return response()->json(['error' => 'Testimonial ID is required.'], 400);
        }

        $data = $this->testimonialModel->getTestimonialsDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'Testimonial not found.'], 404);
        }

        return response()->json($data);
    }
    public function EditTestimonial(Request $req)
    {

        // Get the languages from the input data
        $langs = array_keys($req->input('name', []));

        // Validation rules (same as add testimonial)
        $rules = [
            'order' => 'required|integer',
            'status' => 'required|boolean',
            'image' => 'nullable|string', // Ensure testimonial exists
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
            $rules["subname.$lang"] = 'required|string|max:255';
            $rules["description.$lang"] = 'required|string|max:255';
        }

        // Custom validation messages (same as add testimonial)
        $messages = [
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
            $messages["subname.$lang.required"] = "The Name ($lang) field is required.";
            $messages["description.$lang.required"] = "The Name ($lang) field is required.";
        }

        // Validate the request (same as add testimonial)
        $validated = $req->validate($rules, $messages);
        $validated['testimonial_id'] = $req->prop_testimonialId;

        try {
            // Call the method to update the testimonial in the model
            $response = $this->testimonialModel->updateTestimonial($validated);

            return response()->json($response);
        } catch (\Exception $e) {
            // Catch and return the error response
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }


    public function TestimonialStatus(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->testimonialModel->TestimonialStatusUpdate($data);
        return response()->json($response);
    }

    public function TestimonialDelete(Request $req)
    {
        $response = $this->testimonialModel->DeleteTestimonial($req->id);
        return response()->json($response);
    }
}
