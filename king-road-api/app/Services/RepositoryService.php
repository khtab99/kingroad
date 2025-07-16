<?php

namespace App\Services;

use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contracts\BaseRepositoryInterface;

class RepositoryService
{
    /**
     * Dynamically create a repository for the given model.
     *
     * @param Model $model
     * @return BaseRepositoryInterface
     */
    public function forModel(Model $model): BaseRepositoryInterface
    {
        return new BaseRepository($model);
    }

    public static function setModel(Model $model): BaseRepositoryInterface
    {
        return new BaseRepository($model);
    }
}
