import {CellDOM} from 'Table';

var ExpandLindDOM = React.createClass({
	getInitialState(){
		return {
			line: this.props.line,
		}
	},

	update(){
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


	    var line = this.state.line;
	    var isOpen = line.isOpen;
	    var component = line.cells[0].param.expandComponent;
	    var container = this.refs.cell.refs.component.refs.expandDiv;

		if(!isOpen){
            ReactDOM.unmountComponentAtNode(container);  
            runExpandAmination(isOpen).then((function(){
                $(this.refs.line).hide();    
            }).bind(this));    
        }else{
            $(this.refs.line).show();    
            runExpandAmination(isOpen).then((function(){
                var el = React.createElement(component); 
                ReactDOM.render(el, container);
            }).bind(this));
        }
	},

	componentDidMount(){
		this.update();
	},
	componentWillUpdate(){
		this.update();
	},
	render(){
		var line = this.state.line;
		var key = line.id;
		var widthStyle = {width: '100%'};
		var cell = line.cells[0];

		return (
			<tr ref='line'>
 				<CellDOM cell={cell} widthStyle={widthStyle} key={cell.id} ref='cell'/>
            </tr>
		)
	}
})


module.exports = ExpandLindDOM;


