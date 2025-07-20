<?php

namespace App\Repositories\Contracts;

interface BaseRepositoryInterface
{
    public function all(array $columns = ['*']);
    public function allComplex(array $filters = [], array $columns = ['*'], $searchTerm = null, array $searchFields = []);
    public function paginate($paginate = 15, array $columns = ['*']);
    public function paginateComplex(array $filters = [], array $columns = ['*'], $searchTerm = null, array $searchFields = [], $paginate = 10);
    public function find($id, array $columns = ['*']);
    public function findBy(array $conditions, array $columns = ['*']);
    public function create(array $data);
    public function update(array $data, $id);
    public function delete($id);
    public function applyComplexQueries(array $filters, $searchTerm = null, array $searchFields = []);
    public function applyWith(array $relations = []);
    public function applyFilters(array $filters = []);
    public function applySorts(array $sorts = []);
    public function applySearch($searchTerm = null, array $searchFields = [], $operator = 'LIKE');
}
