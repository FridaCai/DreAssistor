import './style.less';
import Util from 'Util';
var ColorCheckbox = React.createClass({
	getInitialState(){
		return {
			color: this.props.param.color,
			isCheck: this.props.param.isCheck,
			label: this.props.param.label,	
		}
	},
	onCheckboxChange(){
	},
	render(){
		var isCheck = this.state.isCheck;
		var color = this.state.color;
		var style = {
			background: Util.convertIntColorToHex(color),
		}
		var label = this.state.label;

		return (
			<div className='colorcheckbox'>
				<input type="checkbox" checked={isCheck} onChange={this.onCheckboxChange}></input>  
				<span className='colorBlock' style={style}></span>	
				<span>{label}</span>
			</div>
		)
	}
})

module.exports = ColorCheckbox;