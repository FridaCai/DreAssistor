var Checkbox = React.createClass({
	render(){
		var {isCheck, onChange, label, isReadOnly} = this.props.param;

		label = label || '';
		onChange = onChange || function(){};
		isCheck = isCheck || false;

		var labelDom = (function(){
			if(label)
				return (<label>{label}</label>);
			else return null;
		})();

		return (
			<div className='checkBox' style={{float: 'left'}}>
				<input type="checkbox" 
					disabled={isReadOnly}
					defaultChecked={isCheck} 
					onChange={onChange}>
				</input>	
				{labelDom}
			</div>
			
		)
	}
})
module.exports = Checkbox;