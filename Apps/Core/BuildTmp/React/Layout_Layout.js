React.createElement("div", {className: "master minimized"}, 
    React.createElement(Navigation, null), 
    React.createElement("div", {className: "master-content container-fluid"}, 
        function(){return ComponentLoader.getComponents("MasterContent");}.bind(this)()
    ), 
    React.createElement(Footer, null)
)