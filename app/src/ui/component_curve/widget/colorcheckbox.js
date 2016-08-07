import './style.less';
import Util from 'Util';
import Curve from '../uidata/curve.js';

var ColorCheckbox = React.createClass({
	getInitialState(){
		return {
			color: this.props.param.color,
			isCheck: this.props.param.isCheck,
			label: this.props.param.label,	
		}
	},

	onCheckboxChange(e){
		var isCheck = e.currentTarget.checked; 
		this.props.param.onCheckboxChange(isCheck);
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
				<input type="checkbox" defaultChecked={isCheck} onChange={this.onCheckboxChange}></input>  
				<span className='colorBlock' style={style}></span>	
				<span>{label}</span>
			</div>
		)
	}
})

module.exports = ColorCheckbox;