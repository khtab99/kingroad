<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\SliderResource;
use App\Models\User;
use App\Services\RepositoryService;
use Illuminate\Http\Request;


class AdminSliderController extends Controller
{

       protected $repository;
    public function __construct()
    {
        $this->repository = RepositoryService::setModel(new User());
    }

    public function index(Request $request)
    {
        $Sliders = $this->repository->applySearch($request->get('search'), ['name', 'email'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return SliderResource::collection($Sliders);
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
    