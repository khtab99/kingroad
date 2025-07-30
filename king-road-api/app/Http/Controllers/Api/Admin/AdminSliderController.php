<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\SliderResource;
use App\Models\Slider;
use App\Services\RepositoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class AdminSliderController extends Controller
{

       protected $repository;
    public function __construct()
    {
        $this->repository = RepositoryService::setModel(new Slider());
    }

    public function index(Request $request)
    {
        $Sliders = $this->repository->applySearch($request->get('search'), ['title', 'id'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return SliderResource::collection($Sliders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title_en' => 'nullable|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'status' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->only([
            'title_en',
            'title_ar',
            'description_en',
            'description_ar',
            'status',

        ]);

              if ($request->hasFile('image')) {
            $path = $request->file('image')->store('sliders', 'public');
            $data['image'] = Storage::url($path);
        }



        $Slider = $this->repository->create($data);
        return handleSuccessReponse(1, 'Slider created successfully', new SliderResource($Slider));
    }

    public function show($id)
    {
        $Slider = $this->repository->find($id);

        return handleSuccessReponse(1, 'Slider retrieved successfully', new SliderResource($Slider));
    }

    public function destroy($id)
    {

    
        $Slider = $this->repository->find($id);
    
        if (!$Slider) {
            return handleErrorResponse(0, 'Slider not found');
        }
  
        $Slider->delete();
        return handleSuccessReponse(1, 'Slider deleted successfully');
    }

    public function update(Request $request, $id)
    {
        $Slider = $this->repository->find($id);
        if (!$Slider) {
            return handleErrorResponse(0, 'Slider not found');
        }
        $Slider->update($request->all());
        return handleSuccessReponse(1, 'Slider updated successfully', new SliderResource($Slider));
    }

 


}
    