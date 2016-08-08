import './style.less';


var Input = React.createClass({
	getInitialState(){
		return {
			v: this.props.param.v,
			onChange: this.props.param.onChange,
			onBlur: this.props.param.onBlur,	
			scope: this.props.param.scope,
		}
	},
	onChange(e){
		var value = e.target.value;
		var scope = this.state.scope;
		this.state.onChange && this.state.onChange.call(scope, value);
	},
	onBlur(){

	},
	render(){
        return (
            <input ref='input' 
            	defaultValue={this.state.v}
                type='text' 
                onChange={this.onChange} //todo: onchange and onblur.
                onBlur={this.onBlur}/>
        )
	},
	getValue(){
		return this.refs.input.value;
	},
})
module.exports = Input;

