var DragHandler = React.createClass({
	getInitialState: function() {
        return {
            label: this.props.param.label,
        };
    },
    onDragOver(e){
      e.preventDefault();
    },
    onDrop(e){
        /*var transferText = e.dataTransfer.getData('text');
        if(!transferText)
            return;
        
        var data = JSON.parse(transferText);
        var handler = this.props.param.onDragDataIn;
        var scope = this.props.param.scope;
        handler && handler.call(scope, data);

        //to avoid refresh the whole table.
        this.setState({
        	label: data.label,
        	path: data.path
        })*/
    },
    
	render(){
		var label = this.state.label;
        return ( 
            <button
                className="btn btn-primary btn-xs draghandler" 
                onDragOver={this.onDragOver}
                onDrop={this.onDrop}>
                {label}
            </button>
    	)



	}
})

module.exports = DragHandler;