var Label = React.createClass({
	getValue(){
		return this.props.param.v;
	},
	render(){
		var v = this.props.param.v;
		return (<span title={v}>{v}</span>);
	}
})
module.exports = Label;
