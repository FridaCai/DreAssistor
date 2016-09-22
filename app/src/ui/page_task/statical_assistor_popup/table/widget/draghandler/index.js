var DragHandler = React.createClass({
	getInitialState: function() {
        return {
        };
    },

    onDragOver: function(e){
        e.preventDefault(); //otherwise, ondrop does not work.
    },
    onDragStart: function(e){
        var scope = this.props.param.scope;
        var handler = this.props.param.onDragStart;
        handler && handler.call(scope, e);
    },
   
    
	render(){
		var label = this.props.param.label;
        return ( 
            <button draggable='true' 
                className="btn btn-primary btn-xs draghandler" 
                onDragStart={this.onDragStart}
                onDragOver={this.onDragOver}>
                {label}
            </button>
    	)



	}
})

module.exports = DragHandler;