class LinkState {

	constructor(component, key) {
		this.component = component;
		this.key = key;
	}

	create() {
        return {
			value: this.__getValue(this.key),
			requestChange: this.__createStateKeySetter()
		}
	}

	__getValue(key) {
		return _.get(this.component.state, key);
	}

	__createStateKeySetter() {
		var component = this.component;
		var key = this.key;

		var _this = this;
		return function stateKeySetter(value, callback) {
			if (typeof value == 'undefined') {
				value = false;
			}
			var oldValue = _this.__getValue(key);

			var partialState = component.state;
			_.set(partialState, key, value);
			component.setState(partialState);
			partialState = null;

			// Execute callback if defined
			var keyFnName = _.capitalize(_.camelCase(key));

			if (callback) {
				callback(value, oldValue);
			} else if (component['onChange' + keyFnName]) {
				component['onChange' + keyFnName].call(component, value, oldValue);
			}
		};
	}
}

export default LinkState;