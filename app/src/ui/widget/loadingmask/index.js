import './style.less';
import Loading from 'Loading';

var LoadingMask = React.createClass({
	getInitialState(){
		return {
			isShow: false
		}
	},
	show(){
		this.setState({
			isShow: true
		})
	},
	hide(){
		this.setState({
			isShow: false
		})
	},
	render(){
		var style = this.state.isShow ? {display: 'block'}: {display: 'none'};
		return (<div className='mask' style={style}>
			<Loading/>
		</div>);
	}
})
module.exports = LoadingMask;
