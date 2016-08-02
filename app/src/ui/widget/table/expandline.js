import Line from './line.js';

module.exports = class ExpandLine extends Line {
    static create(param){
        var expandLine = new ExpandLine();
        expandLine.init(param);
        return expandLine;
    }


    _createDom(){
    	//2 status. close; open(load component.);
    	return (<ExpandLindDom 
    		key={this.id}
    		isOpen={false} 
    		component={null} 
    		signal_line_expand={this.signal_line_expand}/>
		);
    }
}

var ExpandLindDom = React.createClass({
	getInitialState(){
		return {
			isOpen: this.props.isOpen || false,
			component: this.props.component || null, 
			signal_line_expand: this.props.signal_line_expand || null,
		}
	},

	//should be called after setState
	onToggle(e, param){
		var isOpen = param.isOpen;
		this.setState({isOpen: isOpen}, this.update);
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



	    var isOpen = this.state.isOpen;
		if(!isOpen){
            ReactDOM.unmountComponentAtNode(this.refs.expandDiv);  
            runExpandAmination(isOpen).then((function(){
                $(this.refs.line).hide();    
            }).bind(this));    
        }else{
            $(this.refs.line).show();    
            runExpandAmination(isOpen).then((function(){
                var el = React.createElement(this.state.expandComponent); 
                ReactDOM.render(el, this.refs.expandDiv);
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
					<div className='expandDiv' ref='expandDiv'></div>
				</td>
			</tr>
		)

		/*
			<tr ref='line'>
				<td style="width: 100%; height: 100%;">
					<div className='expandDiv'></div>
				</td>
			</tr>
		*/
	}
})





