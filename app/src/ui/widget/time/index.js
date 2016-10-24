import Datetime from 'react-datetime';
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
		var v = this.props.v;
		return (
			 <Datetime closeOnSelect={true} defaultValue={this.props.param.value} ref='time' onChange={this.onChange}/>
		);
	}
})
module.exports = Time;
