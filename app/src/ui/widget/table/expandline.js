import {CellDOM} from 'Table';

var ExpandLindDOM = React.createClass({
	getInitialState(){
		return {
			isOpen: this.props.isOpen || false,
			component: this.props.component || null, 
			//signal_line_expand: this.props.signal_line_expand || null,
			line: this.props.line,
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
		var line = this.state.line;
		var key = line.id;
		var widthStyle = {width: '100%'};

		return (
			<tr ref='line'>
            {
                line.cells.map(function(cell){
                	return (<CellDOM cell={cell} widthStyle={widthStyle} key={cell.id}/>)
                })
            }
            </tr>
		)
	}
})


module.exports = ExpandLindDOM;


