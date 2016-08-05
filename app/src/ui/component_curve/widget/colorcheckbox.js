var ColorCheckbox = React.createClass({
	getInitialState(){
		return {
			color: this.props.color,
			isCheck: this.props.isCheck,
			label: this.props.label,	
		}
	},
	onCheckboxChange(){
		debugger;
	},
	render(){
		var isCheck = this.state.isCheck;
		var color = this.state.color;
		var style = {
			background: color,
		}
		var label = this.state.label;

		return (
			<div className='colorcheckbox'>
				<input type="checkbox" checked={isCheck} onChange={this.onCheckboxChange}></input>  
				<span style={style}></span>	
				<span>{label}</span>
			</div>
		)
	}
})

module.exports = ColorCheckbox;