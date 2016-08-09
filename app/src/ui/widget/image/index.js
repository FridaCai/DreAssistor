var Image = React.createClass({
	render(){
		var url = this.props.param.url;
		return (<img src={url}/>)
	}
})
module.exports = Image;