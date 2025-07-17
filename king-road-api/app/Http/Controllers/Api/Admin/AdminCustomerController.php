<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\RepositoryService;
use Illuminate\Http\Request;


class AdminCustomerController extends Controller
{

       protected $repository;
    public function __construct()
    {
        $this->repository = RepositoryService::setModel(new User());
    }

    public function index(Request $request)
    {
        $customers = $this->repository->applySearch($request->get('search'), ['name', 'email'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return UserResource::collection($customers);
    }

    public function show($id)
    {
        $customer = $this->repository->find($id);


        return handleSuccessReponse(1, 'Customer retrieved successfully', new UserResource($customer));
    }

    public function destroy($id)
    {
        $customer = $this->repository->find($id);
        if (!$customer) {
            return handleErrorResponse(0, 'Customer not found');
        }
  
        $customer->delete();
        return handleSuccessReponse(1, 'Customer deleted successfully');
    }

    public function update(Request $request, $id)
    {
        $customer = $this->repository->find($id);
        if (!$customer) {
            return handleErrorResponse(0, 'Customer not found');
        }
        $customer->update($request->all());
        return handleSuccessReponse(1, 'Customer updated successfully', new UserResource($customer));
    }

 


}
    