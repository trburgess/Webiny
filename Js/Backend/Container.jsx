class Container extends Webiny.View {

	constructor() {
		super();

		this.state = {
			loading: true
		};
	}

	componentWillMount() {
		Webiny.Router.start(window.location.pathname).then(routerEvent => {
			this.setState({loading: false});
		}, (e) => {
			console.error(e);
		});
	}

	componentDidMount() {
		this.unsubscribe = Webiny.EventManager.listen('RenderRoute', (route) => {
			return this.setState({
				time: new Date().getTime()
			});
		});
	}

	onDidUpdate() {
		window.scrollTo(0, 0);
		// Since this is a top level component, it will emit RouteChanged event after everything has finished rendering
		Webiny.EventManager.emit('RouteChanged', Webiny.Router.getActiveRoute());
	}

	render() {

		var content = (
			<div className="preloader" style={{display: 'block'}}>
				<span className="loader">
					<span className="loader-inner"></span>
				</span>
				<i className="demo-icon icon-hkt-icon"></i>
			</div>
		);

		if (!this.state.loading) {
			return <Webiny.Components.Router.Placeholder onDidUpdate={this.onDidUpdate} name="Layout"/>;
		}
		return content;
	}
}

export default Container;