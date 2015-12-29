<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\DevTools\Entity\Event;

use Webiny\Component\EventManager\Event;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;

/**
 * This class is passed along the following EntityAbstract events:
 *
 * - BeforeSave
 * - AfterSave
 * - Extend
 */
class EntityEvent extends Event
{

    /**
     * @var EntityAbstract
     */
    private $entity;


    /**
     * Base constructor.
     */
    function __construct(EntityAbstract $entity) {
        $this->entity = $entity;

        parent::__construct();
    }

    /**
     * Returns an instance of EntityAbstract
     *
     * @return EntityAbstract
     */
    public function getEntity() {
        return $this->entity;
    }
}