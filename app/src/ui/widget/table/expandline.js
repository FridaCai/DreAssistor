import {CellDOM} from 'Table';

var ExpandLindDOM = React.createClass({
	getInitialState(){
		return {
			line: this.props.line,
		}
	},

	update(ignoreAnimation){
		var duration = ignoreAnimation ? 0:500;

		//no animation when initial.
		duration = 500;
		duration = 0;

	    var runExpandAmination = (function(isOpen){
	        var h = isOpen ? 700 : 0;
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

	    var {expandComponent, expandComponentParam} = line.cells[0].param;
	    var container = this.refs.cell.refs.component.refs.expandDiv;

		if(!isOpen){
            ReactDOM.unmountComponentAtNode(container);  
            runExpandAmination(isOpen).then((function(){
                $(this.refs.line).hide();    
            }).bind(this));    
        }else{
            $(this.refs.line).show();    
            runExpandAmination(isOpen).then((function(){
                var el = React.createElement(expandComponent, expandComponentParam); 
                ReactDOM.render(el, container);
            }).bind(this));
        }
	},

	componentDidMount(){
		this.update(true);
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


