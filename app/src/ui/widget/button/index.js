import './style.less';


var Button = React.createClass({
	getInitialState(){
		return {
			value: this.props.param.value,
			onClick: this.props.param.onClick,
			scope: this.props.param.scope,
		}
	},
	onClick(e){
		var scope = this.state.scope;
		this.state.onClick && this.state.onClick.call(scope);
	},


	render(){
		var value = this.state.value;

        return (
        	<button className="btn btn-primary btn-xs" onClick={this.onClick}>{value}</button>
        )
	}
})
module.exports = Button;

