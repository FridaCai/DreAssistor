import './style.less';
var LinkButton = React.createClass({
	getInitialState: function() {
        return {
            label: this.props.param.label,
            path: this.props.param.path,
        };
    },
    onDragOver(e){
      e.preventDefault();
    },
    onDrop(e){
      var data = JSON.parse(e.dataTransfer.getData('text'));
      var handler = this.props.param.onClick;
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