<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\Dispatchers\Flows;

use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Apps\Core\Php\Dispatchers\AbstractFlow;

/**
 * Class CrudGetFlow
 * @package Apps\Core\Php\Dispatchers
 */
class CrudGetFlow extends AbstractFlow
{

    public function handle(EntityAbstract $entity, $params)
    {
        $id = $params[0];
        try {
            $entity = $entity->findById($id);
            if ($entity) {
                return $entity->toArray($this->wRequest()->getFields(), $this->wRequest()->getFieldsDepth());
            }
        } catch (\MongoException $e) {
            throw new \Exception('Database error', $e->getMessage(), $e->getCode(), 400);
        }
        throw new \Exception('Not found', get_class($entity) . ' with id `' . $id . '` was not found!');
    }

    public function canHandle($httpMethod, $params)
    {
        return $httpMethod === 'GET' && count($params) === 1 && $this->isValidMongoId($params[0]);
    }
}