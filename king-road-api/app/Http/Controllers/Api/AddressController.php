<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Address\CreateAddressRequest;
use App\Http\Requests\Address\UpdateAddressRequest;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AddressController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Get user addresses
     */
    public function index()
    {
        try {
            $addresses = auth()->user()
                ->addresses()
                ->orderBy('is_default', 'desc')
                ->orderBy('created_at', 'desc')
                ->get();

            return handleSuccessReponse(
                1,
                __('message.retrieved'),
                AddressResource::collection($addresses)
            );
        } catch (\Exception $e) {
            Log::error('Get addresses error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Create new address
     */
    public function store(CreateAddressRequest $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                $user = auth()->user();
                $data = $request->validated();
                $data['user_id'] = $user->id;

                // If this is set as default, unset other default addresses
                if ($data['is_default'] ?? false) {
                    $user->addresses()->update(['is_default' => false]);
                }

                // If this is the first address, make it default
                if ($user->addresses()->count() === 0) {
                    $data['is_default'] = true;
                }

                $address = Address::create($data);

                return handleSuccessReponse(
                    1,
                    __('message.created'),
                    new AddressResource($address)
                );
            });
        } catch (\Exception $e) {
            Log::error('Create address error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Get single address
     */
    public function show(Address $address)
    {
        try {
            // Ensure user owns this address
            if ($address->user_id !== auth()->id()) {
                return handleErrorResponse(0, 'Unauthorized access to address');
            }

            return handleSuccessReponse(
                1,
                __('message.retrieved'),
                new AddressResource($address)
            );
        } catch (\Exception $e) {
            Log::error('Get address error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Update address
     */
    public function update(UpdateAddressRequest $request, Address $address)
    {
        try {
            // Ensure user owns this address
            if ($address->user_id !== auth()->id()) {
                return handleErrorResponse(0, 'Unauthorized access to address');
            }

            return DB::transaction(function () use ($request, $address) {
                $data = $request->validated();

                // If this is set as default, unset other default addresses
                if ($data['is_default'] ?? false) {
                    auth()->user()->addresses()
                        ->where('id', '!=', $address->id)
                        ->update(['is_default' => false]);
                }

                $address->update($data);

                return handleSuccessReponse(
                    1,
                    __('message.updated'),
                    new AddressResource($address->fresh())
                );
            });
        } catch (\Exception $e) {
            Log::error('Update address error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Delete address
     */
    public function destroy(Address $address)
    {
        try {
            // Ensure user owns this address
            if ($address->user_id !== auth()->id()) {
                return handleErrorResponse(0, 'Unauthorized access to address');
            }

            return DB::transaction(function () use ($address) {
                $wasDefault = $address->is_default;
                $address->delete();

                // If deleted address was default, make another address default
                if ($wasDefault) {
                    $nextAddress = auth()->user()->addresses()->first();
                    if ($nextAddress) {
                        $nextAddress->update(['is_default' => true]);
                    }
                }

                return handleSuccessReponse(
                    1,
                    __('message.deleted'),
                    null
                );
            });
        } catch (\Exception $e) {
            Log::error('Delete address error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Set address as default
     */
    public function setDefault(Address $address)
    {
        try {
            // Ensure user owns this address
            if ($address->user_id !== auth()->id()) {
                return handleErrorResponse(0, 'Unauthorized access to address');
            }

            return DB::transaction(function () use ($address) {
                // Unset all other default addresses
                auth()->user()->addresses()->update(['is_default' => false]);
                
                // Set this address as default
                $address->update(['is_default' => true]);

                return handleSuccessReponse(
                    1,
                    __('message.updated'),
                    new AddressResource($address->fresh())
                );
            });
        } catch (\Exception $e) {
            Log::error('Set default address error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Get default address
     */
    public function getDefault()
    {
        try {
            $defaultAddress = auth()->user()->addresses()
                ->where('is_default', true)
                ->first();

            if (!$defaultAddress) {
                return handleErrorResponse(0, 'No default address found');
            }

            return handleSuccessReponse(
                1,
                __('message.retrieved'),
                new AddressResource($defaultAddress)
            );
        } catch (\Exception $e) {
            Log::error('Get default address error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }
}