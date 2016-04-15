import BaseCheckboxGroup from './BaseCheckboxGroup';
import Checkbox from './Checkbox';

class CheckboxGroup extends BaseCheckboxGroup {

	render() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        let label = null;
        if (this.props.label) {
            label = <label key="label" className="control-label">{this.props.label}</label>;
        }

        let validationMessage = null;
        if (this.state.isValid === false) {
            validationMessage = <span className="help-block">{this.state.validationMessage}</span>;
        }

		return (
			<div className={this.classSet({disabled: this.props.disabled}, this.props.className)}>
				<div className={this.classSet(cssConfig)}>{label}
					<div className="clearfix"></div>
					{this.getOptions()}
				</div>
                {validationMessage}
			</div>
		);
	}
}

export default CheckboxGroup;