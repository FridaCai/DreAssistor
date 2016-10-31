import Datetime from 'react-datetime';
import Input from 'Input';
import Util from 'Util';
import 'react-datetime/css/react-datetime.css';
import './style.less';

var Time = React.createClass({
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
				var param = {
					value: value ? Util.convertUnixTimeToTime(value): "",
					isReadOnly: isReadOnly,
					className: 'Time readonly'
				}
				return (<Input param={param}/>);	
			}else{
				return (<Datetime closeOnSelect={true} defaultValue={value} ref='time' onChange={this.onChange}/>);
			}
		}).call(this);
	}
})
module.exports = Time;
