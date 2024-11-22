<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PropertyLengthModel;
use Illuminate\Http\Request;

class PropertyLengthController extends Controller
{
    protected $lengthModel;


    public function __construct(PropertyLengthModel $lengthModel)
    {
        $this->lengthModel = $lengthModel;
    }

    public function PropertylengthView(Request $request)
    {
        $data = $this->lengthModel->getlengths();
        return view('Admin\Property_Setting\property_length', compact('data')); 
    }

    public function Addlength(Request $req)
    {
        // dd($req->all());
        $rules = [
            'room_min' => 'required|numeric|digits_between:1,10',
            'room_max' => 'required|numeric|digits_between:1,10',
            'bedroom_min' => 'required|numeric|digits_between:1,10',
            'bedroom_max' => 'required|numeric|digits_between:1,10',
            'bathroom_min' => 'required|numeric|digits_between:1,10',
            'bathroom_max' => 'required|numeric|digits_between:1,10',
            'floor_min' => 'required|numeric|digits_between:1,10',
            'floor_max' => 'required|numeric|digits_between:1,10',
            'kitchen_min' => 'required|numeric|digits_between:1,10',
            'kitchen_max' => 'required|numeric|digits_between:1,10',
            'garage_min' => 'required|numeric|digits_between:1,10',
            'garage_max' => 'required|numeric|digits_between:1,10',
        ];

        $messages = [
            'room_min.required' => 'The Room Min field is required.',
            'room_min.numeric' => 'The Room Min must be a number.',
            'room_min.digits_between' => 'The Room Min must be between 1 and 10 digits.',
        
            'room_max.required' => 'The Room Max field is required.',
            'room_max.numeric' => 'The Room Max must be a number.',
            'room_max.digits_between' => 'The Room Max must be between 1 and 10 digits.',
        
            'bedroom_min.required' => 'The Bedroom Min field is required.',
            'bedroom_min.numeric' => 'The Bedroom Min must be a number.',
            'bedroom_min.digits_between' => 'The Bedroom Min must be between 1 and 10 digits.',
        
            'bedroom_max.required' => 'The Bedroom Max field is required.',
            'bedroom_max.numeric' => 'The Bedroom Max must be a number.',
            'bedroom_max.digits_between' => 'The Bedroom Max must be between 1 and 10 digits.',
        
            'bathroom_min.required' => 'The Bathroom Min field is required.',
            'bathroom_min.numeric' => 'The Bathroom Min must be a number.',
            'bathroom_min.digits_between' => 'The Bathroom Min must be between 1 and 10 digits.',
        
            'bathroom_max.required' => 'The Bathroom Max field is required.',
            'bathroom_max.numeric' => 'The Bathroom Max must be a number.',
            'bathroom_max.digits_between' => 'The Bathroom Max must be between 1 and 10 digits.',
        
            'floor_min.required' => 'The Floor Min field is required.',
            'floor_min.numeric' => 'The Floor Min must be a number.',
            'floor_min.digits_between' => 'The Floor Min must be between 1 and 10 digits.',
        
            'floor_max.required' => 'The Floor Max field is required.',
            'floor_max.numeric' => 'The Floor Max must be a number.',
            'floor_max.digits_between' => 'The Floor Max must be between 1 and 10 digits.',
        
            'kitchen_min.required' => 'The Kitchen Min field is required.',
            'kitchen_min.numeric' => 'The Kitchen Min must be a number.',
            'kitchen_min.digits_between' => 'The Kitchen Min must be between 1 and 10 digits.',
        
            'kitchen_max.required' => 'The Kitchen Max field is required.',
            'kitchen_max.numeric' => 'The Kitchen Max must be a number.',
            'kitchen_max.digits_between' => 'The Kitchen Max must be between 1 and 10 digits.',
        
            'garage_min.required' => 'The Garage Min field is required.',
            'garage_min.numeric' => 'The Garage Min must be a number.',
            'garage_min.digits_between' => 'The Garage Min must be between 1 and 10 digits.',
        
            'garage_max.required' => 'The Garage Max field is required.',
            'garage_max.numeric' => 'The Garage Max must be a number.',
            'garage_max.digits_between' => 'The Garage Max must be between 1 and 10 digits.',
        ];
        
        $validData = $req->validate($rules , $messages );

        $data = [
            'room_min' => $validData['room_min'],
            'room_max' => $validData['room_max'],
            'bedroom_min' => $validData['bedroom_min'],
            'bedroom_max' => $validData['bedroom_max'],
            'bathroom_min' => $validData['bathroom_min'],
            'bathroom_max' => $validData['bathroom_max'],
            'floor_min' => $validData['floor_min'],
            'floor_max' => $validData['floor_max'],
            'kitchen_min' => $validData['kitchen_min'],
            'kitchen_max' => $validData['kitchen_max'],
            'garage_min' => $validData['garage_min'],
            'garage_max' => $validData['garage_max'],
        ];
        $this->lengthModel->insert($data);
        return redirect()->back();
    }
}
