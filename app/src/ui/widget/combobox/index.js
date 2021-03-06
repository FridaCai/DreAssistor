import './style.less';


//todo: lose focuse, hide ul
//
var ComboBox = React.createClass({
	getInitialState(){
		return {
			selectedId: this.props.param.selectedId,
			isOpen: false,	
		}
		
	},
	getValue(){
		return this.state.selectedId;
	},
	onToggle(){
		var isOpen = !this.state.isOpen;
		this.setState({isOpen: isOpen});
	},
	onSelect(op){
		var isOpen = false;
		this.setState({isOpen: isOpen, selectedId: op.id});
		this.props.param.onchange && this.props.param.onchange.call(this.props.param.scope, op.id);
	},

	render(){
		var {options, prompt, isReadOnly} = this.props.param;
		var selectedId = this.state.selectedId;
		var selectedItem = (selectedId == undefined) ? null:  options.find(function(op){
			return op.id === selectedId;
		});
		var selectedLabel = selectedItem ? selectedItem.label : prompt;

		var style = this.state.isOpen ? {
			display: 'block'
		}: {
			display: 'none'
		};

		return (
			<span className="cdropdown">
				<button type="button" title={selectedLabel} onClick={this.onToggle} disabled={isReadOnly}>
					<span className="utext">{selectedLabel}</span>
					<span className="caret"></span>
				</button>
				<ul role="menu" style={style}>
				{
					options.map((function(op, index){
						var label = op.label;
						return (
							<li onMouseDown={this.onSelect.bind(this, op)} 
								data={index} role="presentation" 
								title={label} key={op.id}>
								<a role="menuitem" href="javascript:void(0);">{label}</a>
							</li>
						)
					}).bind(this))
				}
				</ul>
			</span>
		)
	}
})
module.exports = ComboBox;