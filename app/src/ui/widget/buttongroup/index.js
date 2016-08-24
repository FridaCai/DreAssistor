import './style.less';


var ButtonGroup = React.createClass({
	getInitialState(){
		return {
		}
	},
	onClick(handler){
		var scope = this.props.param.scope;
		handler && handler.call(scope);
	},


	render(){
		var dom = this.props.param.map((function(btnParam, index){
			var {value, onClick} = btnParam;
			return (
				<button
					key={index} 
					className="btn btn-primary btn-xs" 
					onClick={this.onClick.bind(this, onClick)}>
					{value}
				</button>
			)
		}).bind(this))

        return (
        	<div className='buttonGroup'>
	        	{dom}
        	</div>
    	)
	}
})
module.exports = ButtonGroup;

