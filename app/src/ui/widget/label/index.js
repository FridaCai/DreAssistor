var Label = React.createClass({
	getValue(){
		return this.props.v;
	},
	render(){
		var v = this.props.v;
		return (<span title={v}>{v}</span>);
	}
})
module.exports = Label;
