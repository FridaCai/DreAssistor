var Input = React.createClass({
	getInitialState(){
		return {
			v: this.props.param.v,
			onChange: this.props.param.onChange,
			onBlur: this.props.param.onBlur,	
		}
	},
	render(){
        return (
            <input ref='input' 
            	defaultValue={this.state.v} key={this.id}
                type='text' 
                onChange={this.state.onChange.bind(this)} //todo: onchange and onblur.
                onBlur={this.state.onBlur.bind(this)}/>
        )
	},
	getValue(){
		return this.refs.input.value;
	},
})
module.exports = Input;

