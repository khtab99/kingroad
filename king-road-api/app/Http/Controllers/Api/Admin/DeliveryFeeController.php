<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\DeliveryFeeResource;
use App\Models\DeliveryFee;
use App\Services\RepositoryService;
use Illuminate\Http\Request;

class DeliveryFeeController extends Controller
{
    protected $repository;

    public function __construct()
    {
        $this->repository = RepositoryService::setModel(new DeliveryFee());
    }

    public function index()
    {
        $deliveryFees = $this->repository->all();
        return handleSuccessReponse(1, 'Delivery fees retrieved successfully', DeliveryFeeResource::collection($deliveryFees));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'base_fee' => 'required|numeric',
            'additional_per_km' => 'nullable|numeric',
            'free_delivery_min_total' => 'nullable|numeric',
            'region' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $deliveryFee = $this->repository->create($validated);

        return handleSuccessReponse(1, 'Delivery fee created successfully', new DeliveryFeeResource($deliveryFee));
    }

    public function show(string $id)
    {
        $deliveryFee = $this->repository->find($id);
        return handleSuccessReponse(1, 'Delivery fee retrieved successfully', new DeliveryFeeResource($deliveryFee));
    }


        public function update(Request $request, DeliveryFee $deliveryFee)


    {

  $data = $request->only([
            'base_fee',
            'additional_per_km',
            'free_delivery_min_total',
            'region',
            'is_active',
        ]);
 
        if (!$deliveryFee) {
            return handleErrorResponse(0, 'Delivery not found');
        }

        $deliveryFee->update($data);



        return handleSuccessReponse(1, 'Delivery updated successfully', new DeliveryFeeResource($deliveryFee));
    }

    public function destroy(string $id)
    {
        $deliveryFee = $this->repository->find($id);
        $deliveryFee->delete();

        return handleSuccessReponse(1, 'Delivery fee deleted successfully');
    }
}
