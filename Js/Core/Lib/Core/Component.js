import _ from 'lodash';
import React from 'react';
import md5 from 'blueimp-md5';
import isMobile from 'ismobilejs';
import classNames from 'classnames';
import Webiny from 'webiny';
import LinkState from './LinkState';
import Dispatcher from './Dispatcher';
import UiDispatcher from './UiDispatcher';

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.__listeners = [];
        this.__cursors = [];
        this.__mounted = true;
        this.bindMethods('bindTo', 'isRendered', 'i18n');
    }

    /**
     * Method for a more convenient use of i18n module - this will automatically generate a complete namespace for the label
     * If this method is called without parameters, it will return Webiny.I18n module, from which you can use other functions as well
     * @param text
     * @param variables
     * @param options
     * @returns {*}
     */
    i18n(text, variables, options = {}) {
        if (!text) {
            return Webiny.I18n;
        }

        const namespace = options.namespace || _.get(this.props, 'i18nNamespace');

        if (!namespace) {
            throw new Error('Using i18n but namespace is undefined.');
        }

        if (!/^[a-zA-Z0-9\.]+$/.test(namespace)) {
            throw new Error('Namespace "' + namespace + '" contains invalid characters, only letters, numbers and dots (".") are allowed.');
        }

        const key = _.trimEnd(namespace, '.') + '.' + md5(text);
        return Webiny.I18n.render(key, text, variables);
    }

    componentWillMount() {
        // This is deprecated and will be removed in the next release
        if (this.props.ui) {
            UiDispatcher.register(this.props.ui, this);
        }
    }

    componentDidMount() {
        // Reserved for future system-wide functionality
        if (this.props.onComponentDidMount) {
            this.props.onComponentDidMount(this);
        }
    }

    /* eslint-disable */
    componentWillReceiveProps(nextProps) {
        // This is deprecated and will be removed in the next release
        if (nextProps.ui !== this.props.ui) {
            UiDispatcher.unregister(this.props.ui);
            UiDispatcher.register(nextProps.ui, this);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Reserved for future system-wide functionality
        return true;
    }

    componentWillUpdate(nextProps, nextState) {
        // Reserved for future system-wide functionality
    }

    componentDidUpdate(prevProps, prevState) {
        // Reserved for future system-wide functionality
    }

    /* eslint-enable */

    componentWillUnmount() {
        // Release event listeners
        _.forEach(this.__listeners, unsubscribe => {
            unsubscribe();
        });
        this.__listeners = [];

        // Release data cursors
        _.forEach(this.__cursors, cursor => {
            if (cursor && cursor.tree) {
                cursor.release();
            }
        });
        this.__cursors = [];

        if (this.props.ui) {
            UiDispatcher.unregister(this.props.ui);
        }
        this.__mounted = false;
    }

    setState(key, value = null, callback = null) {
        if (!this.isMounted()) {
            return;
        }

        if (_.isObject(key)) {
            return super.setState(key, value);
        }

        if (_.isString(key)) {
            const state = this.state;
            _.set(state, key, value);
            return super.setState(state, callback);
        }
    }

    isMounted() {
        return this.__mounted;
    }

    isRendered() {
        if (_.has(this.props, 'renderIf')) {
            return _.isFunction(this.props.renderIf) ? this.props.renderIf() : this.props.renderIf;
        }
        return true;
    }

    getClassName() {
        return Object.getPrototypeOf(this).constructor.name;
    }

    isMobile() {
        return isMobile.any;
    }

    dispatch(action, data) {
        return Dispatcher.dispatch(action, data);
    }

    on(event, callback) {
        const stopListening = Dispatcher.on(event, callback);
        this.__listeners.push(stopListening);
        return stopListening;
    }

    classSet(...sets) {
        return classNames(...sets);
    }

    /**
     * @param key
     * @param callback
     * @param defaultValue
     * @returns {{value: *, onChange: *}}
     */
    bindTo(key, callback = _.noop, defaultValue = null) {
        const ls = new LinkState(this, key, callback, _.clone(defaultValue));
        return ls.create();
    }

    bindMethods(...methods) {
        if (methods.length === 1 && _.isString(methods[0])) {
            methods = methods[0].split(',').map(x => x.trim());
        }

        _.forEach(methods, (name) => {
            if (name in this) {
                this[name] = this[name].bind(this);
            } else {
                console.info('Missing method [' + name + ']', this);
            }
        });
    }

    /**
     * This method is DEPRECATED.
     * For current release it will remain here to support projects that were developed in the meantime.
     * However, future use of this method will not be supported and it will be removed.
     *
     * @param call
     * @param params
     * @returns {*}
     */
    ui(call, ...params) {
        if (call.indexOf(':') < 0) {
            return UiDispatcher.get(call);
        }
        return UiDispatcher.createSignal(this, call, params);
    }

    watch(key, func) {
        let cursor = null;
        if (_.isFunction(key)) {
            cursor = Webiny.Model.select();
            func = key;
        } else {
            cursor = Webiny.Model.select(key.split('.'));
        }

        cursor.on('update', e => {
            func(e.data.currentData, e.data.previousData, e);
        });

        this.__cursors.push(cursor);
        // Execute callback with initial data
        func(cursor.get());
        return cursor;
    }

    render() {
        if (!this.isRendered()) {
            return null;
        }

        if (this.props.renderer) {
            try {
                // Here we prepare renderer parameters in case any were attached to the function itself using `bindArgs`
                let params = [this];
                if (this.props.renderer.bindArgs) {
                    params = params.concat(this.props.renderer.bindArgs);
                }
                params.push(this);
                return this.props.renderer.call(...params);
            } catch (e) {
                Webiny.Logger && Webiny.Logger.reportError('js', e.message, e.stack);
                if (DEVELOPMENT) {
                    console.error('[RENDER ERROR][' + this.getClassName() + ']', e);
                    return (
                        React.createElement('div', null, [
                            React.createElement('h3', null, '[RENDER ERROR] in component `' + this.getClassName() + '`'),
                            React.createElement('pre', null, e.stack)
                        ])
                    );
                }
            }
        }

        return null;
    }
}

Component.defaultProps = {};

export default Component;
