import CP from 'react-colors-picker';
import 'react-colors-picker/assets/index.css';
import './style.less';

var ColorPicker = React.createClass({
	getValue(){
		return this.refs.time.state.selectedDate.valueOf();
	},
	onChange(time){
		var unixTime = time.valueOf();
		this.props.param.onChange && this.props.param.onChange.call(this.props.param.scope, unixTime);
	},
	render(){
		var {isReadOnly, value} = this.props.param;

		return (function(){
			if(isReadOnly){
				var style={background: value};
				return (<div className='colorpicker readonly' style={style}/>);	
			}else{
				return (<CP animation="slide-up" color={value}/>);
			}
		}).call(this);
	}
})
module.exports = ColorPicker;
