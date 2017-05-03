import Webiny from 'Webiny';

class CaseField extends Webiny.Ui.Component {

}

CaseField.defaultProps = {
    renderer() {
        let content = null;
        let defaultContent = null;
        _.each(React.Children.toArray(this.props.children), child => {
            if (child.type === 'default') {
                defaultContent = child.props.children;
                return;
            }
            const value = child.props.value;
            if (_.isFunction(value) && value(this.props.data) === true || value === _.get(this.props.data, this.props.name)) {
                content = child.props.children;
            }
        });

        if (!content) {
            content = defaultContent;
        }

        const {List, ...props} = this.props;

        return (
            <List.Table.Field {..._.omit(props, ['renderer'])}>
                {() => content}
            </List.Table.Field>
        );
    }
};

export default Webiny.createComponent(CaseField, {modules: ['List'], tableField: true});