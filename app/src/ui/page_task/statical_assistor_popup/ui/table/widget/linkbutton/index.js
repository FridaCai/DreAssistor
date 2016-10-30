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
        
        var param = JSON.parse(transferText);

        switch(param.target){
            case 'treenode':
                this.dragDataFromTree(param.data);
                break;
            case 'draghandler':
                this.dragDataFromDragHandler(param.data);
                break;
        }
    },

    dragDataFromTree(data){
        
        var handler = this.props.param.dragDataFromTree;
        var scope = this.props.param.scope;
        handler && handler.call(scope, data);
    },

    dragDataFromDragHandler(data){
        var handler = this.props.param.dragDataFromDragHandler;
        var scope = this.props.param.scope;
        handler && handler.call(scope, data);  
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