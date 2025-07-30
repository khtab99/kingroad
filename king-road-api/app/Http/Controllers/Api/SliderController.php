<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SliderResource;
use App\Models\Slider;
use App\Services\RepositoryService;
use Illuminate\Http\Request;


class SliderController extends Controller
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

 

}
    