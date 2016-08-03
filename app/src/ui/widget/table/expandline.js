var ExpandLindDom = React.createClass({
	getInitialState(){
		return {
			isOpen: this.props.isOpen || false,
			component: this.props.component || null, 
			//signal_line_expand: this.props.signal_line_expand || null,
			cell: this.props.cell,
		}
	},

	/*onToggle(e, param){
		var isOpen = param.isOpen;
		this.setState({isOpen: isOpen}, this.update);
	},*/

	update(isOpen, component){
	    var runExpandAmination = (function(isOpen){
	        var h = isOpen ? 500 : 0;
	        var duration = 500;

	        return new Promise((function(resolve, reject){
	            $(this.refs.line).animate({
	                height:h
	            }, duration, function() {
	                resolve();
	            });
	        }).bind(this))
	    }).bind(this);



	    var isOpen = this.state.isOpen;
		if(!isOpen){
            //ReactDOM.unmountComponentAtNode(this.refs.expandDiv);  
            runExpandAmination(isOpen).then((function(){
                $(this.refs.line).hide();    
            }).bind(this));    
        }else{
            $(this.refs.line).show();    
            runExpandAmination(isOpen).then((function(){
                //var el = React.createElement(this.state.expandComponent); 
                //ReactDOM.render(el, this.refs.expandDiv);
            }).bind(this));
        }
	},

	componentDidMount(){
		//this.state.signal_line_expand.listen(this.onToggle); //todo: signal_line_expand -> signal_expand_toggle
		this.update();
	},

	componentWillUnmount(){
		//this.state.signal_line_expand.unlisten(this.onToggle); //todo: signal_line_expand -> signal_expand_toggle		
	},
	
	render(){
		return (
			<tr ref='line' className='expandLine'>
				<td>
					{this.state.cell.getDom()}
				</td>
			</tr>
		)
	}
})





