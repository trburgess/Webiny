import Webiny from 'Webiny';
import Component from './Component'; // Need to import this file directly because at this point `Webiny` is not fully populated

class ModalComponent extends Component {

    constructor(props) {
        super(props);
        this.bindMethods('show,hide,renderDialog');
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (DEVELOPMENT && Webiny.isHotReloading()) {
            return true;
        }
        const omitProps = ['renderer', 'renderDialog'];
        const newProps = _.omit(nextProps, omitProps);
        const oldProps = _.omit(this.props, omitProps);
        return !_.isEqual(newProps, oldProps) || !_.isEqual(nextState, this.state);
    }

    hide() {
        return this.refs.dialog.hide();
    }

    show() {
        return this.refs.dialog.show();
    }

    isAnimating() {
        return this.refs.dialog.isAnimating();
    }

    renderDialog() {
        if (_.isFunction(this.props.renderDialog)) {
            return this.props.renderDialog.call(this, this);
        }

        throw new Error('Implement renderDialog() method in your modal component class or add a renderDialog() function through props!');
    }
}

ModalComponent.defaultProps = {
    renderDialog: null,
    renderer() {
        const dialog = this.renderDialog();
        return React.cloneElement(dialog, {ref: 'dialog', onHidden: this.props.onHidden});
    }
};

export default ModalComponent;
