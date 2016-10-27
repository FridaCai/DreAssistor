import CP from 'react-colors-picker';
import 'react-colors-picker/assets/index.css';
import './style.less';

var ColorPicker = React.createClass({
	getValue(){
		return this.refs.colorpicker.state.color;
	},

	render(){
		var {isReadOnly, value} = this.props.param;

		return (function(){
			if(isReadOnly){
				var style={background: value};
				return (<div  className='colorpicker readonly' style={style}/>);	
			}else{
				return (<CP ref='colorpicker' animation="slide-up" color={value}/>);
			}
		}).call(this);
	}
})
module.exports = ColorPicker;
