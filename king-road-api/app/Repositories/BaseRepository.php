<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use App\Repositories\Contracts\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class BaseRepository implements BaseRepositoryInterface
{
    protected $model;
    protected Builder $query;

    public function __construct(Model $model)
    {
        $this->model = $model;
        $this->query = $model->newQuery();
        
    }


    /**
     * Get all records with applied filters, search, and sorts.
     */
    public function all(array $columns = ['*'])
    {
        return $this->query->get($columns);

    }
    /**
     * Get paginated results
     */
    public function paginate($paginate = 15, array $columns = ['*'])
    {
        return $this->query->select($columns)->paginate($paginate);
    }

    public function allComplex(array $filters = [], array $columns = ['*'], $searchTerm = null, array $searchFields = [])
    {
        return $this->query->applyComplexQueries($filters, $searchTerm, $searchFields)->get($columns);
    }
    public function paginateComplex(array $filters = [], array $columns = ['*'], $searchTerm = null, array $searchFields = [], $paginate = 10)
    {
        return $this->query->applyComplexQueries($filters, $searchTerm, $searchFields)->select($columns)->paginate($paginate);
    }
    /**
     * Find a record by ID
     */
    public function find($id, array $columns = ['*'])
    {
        $model = $this->query->select($columns)->find($id);
        if (!$model) {
            throw new ModelNotFoundException(__("message.not_found"));
        }
        return $model;
    }


    /**
     * Find a record by dynamic conditions
     */
    public function findBy(array $conditions, array $columns = ['*'])
    {
        return $this->applyFilters($conditions)->query->first($columns);

    }

    /**
     * Create a new record
     */
    public function create(array $data)
    {
        return $this->model->create($data);
    }

    /**
     * Update an existing record by ID
     */
    public function update(array $data, $id)
    {
        $record = $this->find($id);
        if ($record) {
            $record->update($data);
            return $record;
        } else {
            throw new ModelNotFoundException("No record found for ID: {$id}");
        }

    }

    /**
     * Delete a record by ID
     */
    public function delete($id)
    {
        $record = $this->find($id);
        if ($record) {
            return $record->delete();
        } else {
            throw new ModelNotFoundException("No record found for ID: {$id}");
        }
    }

    /**
     * Apply complex queries (e.g., whereIn, whereBetween, whereHas)
     */
    public function applyComplexQueries(array $filters, $searchTerm = null, array $searchFields = [])
    {

        $this->query->applyFilters($filters);

        $this->query->applySearch($searchTerm, $searchFields);

        return $this;
    }

    public function applyWith(array $relations = [])
    {
        if (!empty($relations)) {
            $this->query->with($relations);
        }
        return $this;
    }

    /**
     * Apply filters dynamically with support for:
     * - Basic filters: ['status' => ['=', 'active']]
     * - whereIn: ['role' => ['in', ['admin', 'editor']]]
     * - whereBetween: ['created_at' => ['between', ['2024-01-01', '2024-01-31']]]
     * - whereNull / whereNotNull: ['deleted_at' => ['null', true]]
     */
    public function applyFilters(array $filters = [])
    {
        foreach ($filters as $field => $condition) {
            if (!is_array($condition)) {
                $this->query->where($field, '=', $condition);
                continue;
            }

            [$operator, $value] = $condition;

            switch (strtolower($operator)) {
                case 'in':
                    $this->query->whereIn($field, $value);
                    break;
                case 'not in':
                    $this->query->whereNotIn($field, $value);
                    break;
                case 'between':
                    $this->query->whereBetween($field, $value);
                    break;
                case 'not between':
                    $this->query->whereNotBetween($field, $value);
                    break;
                case 'null':
                    if ($value) {
                        $this->query->whereNull($field);
                    } else {
                        $this->query->whereNotNull($field);
                    }
                    break;
                default:
                    $this->query->where($field, $operator, $value);
                    break;
            }
        }
        return $this;
    }

    /**
     * Apply sorting dynamically
     */
    public function applySorts(array $sorts = [])
    {
        foreach ($sorts as $column => $direction) {
            $this->query->orderBy($column, $direction);
        }
        return $this;
    }

    /**
     * Apply search with custom operator (default: LIKE)
     */
    public function applySearch($searchTerm = null, array $searchFields = [], $operator = 'LIKE')
    {
        if ($searchTerm && !empty($searchFields)) {
            $this->query->where(function ($q) use ($searchTerm, $searchFields, $operator) {
                foreach ($searchFields as $field) {
                    $q->orWhere($field, $operator, $operator === 'LIKE' ? "%{$searchTerm}%" : $searchTerm);
                }
            });
        }
        return $this;
    }

    public function orderBy($column, $direction = 'asc')
    {
        $this->query->orderBy($column, $direction);
        return $this;
    }
}
