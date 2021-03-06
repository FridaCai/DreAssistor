import './style.less';


var Input = React.createClass({
	getInitialState(){
		return {
			value: this.props.param.value,
			onChange: this.props.param.onChange,
			onBlur: this.props.param.onBlur,	
			scope: this.props.param.scope,
			isReadOnly: this.props.param.isReadOnly,
			className: this.props.param.className
		}
	},
	getValue(){
		return this.state.value;
	},
	onChange(e){
		var value = e.target.value;
		this.setState({value: value});
		
		var scope = this.state.scope;
		this.state.onChange && this.state.onChange.call(scope, value);
	},
	onBlur(){
		var scope = this.state.scope;
		this.state.onBlur && this.state.onBlur.call(scope);
	},
	render(){
		var className = this.state.className ? this.state.className: '';
        return (
            <input ref='input' 
            	disabled={this.state.isReadOnly}
            	defaultValue={this.state.value}
                type='text' 
                onChange={this.onChange} 
                onBlur={this.onBlur}
                className={className}/>
        )
	}
})
module.exports = Input;

