import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import './style.less';

var Time = React.createClass({
	getValue(){
		return this.refs.time.state.selectedDate.valueOf();
	},
	render(){
		var v = this.props.v;
		return (
			 <Datetime defaultValue={this.props.param.value} ref='time'/>
		);
	}
})
module.exports = Time;
