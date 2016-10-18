import './style.less';
import Util from 'Util';
import Curve from '../uidata/curve.js';
import Checkbox from 'Checkbox';

var ColorCheckbox = React.createClass({
	getInitialState(){
		return {
			color: this.props.param.color,
			isCheck: this.props.param.isCheck,
			label: this.props.param.label,	
			scope: this.props.param.scope,
		}
	},

	onCheckboxChange(e){
		var isCheck = e.currentTarget.checked; 
		this.props.param.onCheckboxChange.call(this.state.scope, isCheck);
	},
	
	render(){
		var isCheck = this.state.isCheck;
		var color = this.state.color;
		var style = {
			background: Util.convertIntColorToHex(color),
		}
		var label = this.state.label;

		var checkboxParam = {
			isCheck: isCheck,
			onChange: this.onCheckboxChange
		}
		return (
			<div className='colorcheckbox'>
				<Checkbox param={checkboxParam}/>
				<span className='colorBlock' style={style}></span>	
				<span>{label}</span>
			</div>
		)
	}
})

module.exports = ColorCheckbox;

