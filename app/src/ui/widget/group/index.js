var Group = React.createClass({
	getInitialState(){
		return {
		}
	},

	render(){
		var {scope, isReadOnly, items} = this.props.param;
        return (
        	<div className='buttonGroup'>
	        	{
	        		items.map(function(p, index){
						var {component, param, v} = p;

						var eleParam = $.extend({scope: scope, isReadOnly: isReadOnly}, param);
				    	var el = React.createElement(component, {param: eleParam, key:index, v:v});
				    	return el;
					})
	        	}
        	</div>
    	)
	}
})



module.exports = Group;

