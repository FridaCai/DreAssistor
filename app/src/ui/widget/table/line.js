import {CellDOM} from 'Table';

var LineDOM = React.createClass({
	getInitialState(){
		return {
			line: this.props.line,
		}
	},

	render(){
		var line = this.state.line;

		var widthStyle = (function(line){
			var cells = line.cells;
	        var tmp = cells.filter(function(cell){
	            return !cell.isHide;
	        })
	        var percentage = `${(1/tmp.length)*100}%`;
	        return {width: percentage};
		})(line);

		return (
			<tr>
            {
                line.cells.map((function(cell){
                	if(!cell.isHide){
                		return (<CellDOM cell={cell} widthStyle={widthStyle} key={cell.id} isReadOnly={this.props.isReadOnly}/>)	
                	}
                }).bind(this))
            }
            </tr>
		)
	}
})
module.exports = LineDOM;