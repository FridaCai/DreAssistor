import './style.less';

var TextArea = React.createClass({
	getInitialState(){
		return {
			value: this.props.param.value,
			onChange: this.props.param.onChange,
			onBlur: this.props.param.onBlur,	
			scope: this.props.param.scope,
			isReadOnly: this.props.param.isReadOnly
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
		var {value, onChange, onBlur, scope, isReadOnly} = this.state;

        return (
        	<textarea 
        		defaultValue={value} 
        		disabled={this.state.isReadOnly}
        		onChange={this.onChange}
                onBlur={this.onBlur}>
    		</textarea>
        )
	}
})
module.exports = TextArea;

