<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Webiny\Component\Mongo\Index\SingleIndex;

/**
 * Class ApiTokenLog
 *
 * @property string   $id
 * @property string   $method
 * @property ApiToken $token
 * @property array    $request
 *
 * @package Apps\Core\Php\Entities
 *
 */
class ApiTokenLog extends AbstractEntity
{
    protected static $entityCollection = 'ApiTokenLogs';
    protected static $entityMask = '{id}';

    protected static function entityIndexes()
    {
        return [
            new SingleIndex('token', 'token'),
            new SingleIndex('expire', 'createdOn', false, false, false, 604800) // expire after 7 days
        ];
    }

    public function __construct()
    {
        parent::__construct();

        $this->attr('token')->many2one()->setEntity('Apps\Core\Php\Entities\ApiToken');
        $this->attr('request')->object()->setToArrayDefault();
        $this->attr('method')->char()->setToArrayDefault();

        $this->attributes->removeKey('modifiedOn');
    }
}