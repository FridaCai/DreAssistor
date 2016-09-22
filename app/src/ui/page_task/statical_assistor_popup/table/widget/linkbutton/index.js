import './style.less';
var LinkButton = React.createClass({
	getInitialState: function() {
        return {
            label: this.props.param.value,
            path: this.props.param.path,
        };
    },
    onDragOver(e){
      e.preventDefault();
    },
    onDrop(e){
        var transferText = e.dataTransfer.getData('text');
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
        })
    },
    onClick(){
    	var handler = this.props.param.onClick;
		var scope = this.props.param.scope;
		handler && handler.call(scope);
	},

	render(){
		var label = this.state.label;
        return ( 
        	<a className='linkbutton' 
        		onDragOver={this.onDragOver}
             	onDrop={this.onDrop}>
	        	{label}
        	</a>
    	)
	}
})

module.exports = LinkButton;