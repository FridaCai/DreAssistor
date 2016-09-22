var Group = React.createClass({
	getInitialState(){
		return {
		}
	},

	render(){
		var scope = this.props.param.scope;
        return (
        	<div className='buttonGroup'>
	        	{
	        		this.props.param.map(function(p, index){
						var {component, param} = p;

						var eleParam = $.extend({scope: scope}, param);
				    	var el = React.createElement(component, {param: eleParam, key:index});
				    	return el;
					})
	        	}
        	</div>
    	)
	}
})



module.exports = Group;

