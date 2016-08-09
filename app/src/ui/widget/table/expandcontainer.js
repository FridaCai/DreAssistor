//todo: more like a component like radio group rather than table cell; 
//import './style.less';
var ExpandContainerDOM = React.createClass({
	componentDidMount(){
		$(this.refs.expandDiv).parents('td').css({height: '100%'});
	},
	render(){
		return (
			<div ref='expandDiv' className='expandDiv'></div>
		)
	},
	
})

module.exports = ExpandContainerDOM;