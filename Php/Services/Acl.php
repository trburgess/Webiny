<?php

namespace Apps\Webiny\Php\Services;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Services\AbstractService;

/**
 * Class Acl
 * @package Apps\Webiny\Php\Services
 */
class Acl extends AbstractService
{
    protected function serviceApi(ApiContainer $api)
    {
        /**
         * @api.name Get system API token
         * @api.description Returns a system API token for use with 3rd party requests
         */
        $api->get('/token', function () {
            return ['token' => $this->wConfig()->get('Application.Acl.Token')];
        });
    }
}