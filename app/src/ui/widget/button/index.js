import './style.less';


var Button = React.createClass({
	getInitialState(){
		return {
		}
	},

	onClick(){
		var scope = this.props.param.scope;
		var handler = this.props.param.onClick;
		handler && handler.call(scope);
	},

	render(){
		var label = this.props.param.label;
        return (
        	<div className='buttonGroup'>
	        	<button
					className="btn btn-primary btn-xs" 
					onClick={this.onClick}>
					{label}
				</button>
        	</div>
    	)
	}
})
module.exports = Button;

