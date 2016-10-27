import Datetime from 'react-datetime';
import Input from 'Input';
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
		var {isReadOnly, value} = this.props.param;

		return (function(){
			if(isReadOnly){
				return (<Input param={this.props.param}/>);	
			}else{
				return (<Datetime closeOnSelect={true} defaultValue={value} ref='time' onChange={this.onChange}/>);
			}
		}).call(this);
	}
})
module.exports = Time;
