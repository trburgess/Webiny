import Webiny from 'Webiny';

export default () => {
    Webiny.registerModule(
        new Webiny.Module('Webiny/Layout/Header', () => import('./Header')),
        new Webiny.Module('Webiny/Layout/Navigation', () => import('./Navigation')),
        new Webiny.Module('Webiny/Layout/UserMenu', () => import('./UserMenu')),
    );
};