import CellDOM from './cell.js';

var LineDOM = React.createClass({
	getInitialState(){
		return {
			line: this.props.line,
		}
	},

	render(){
		var line = this.state.line;
		var key = line.id;

		var widthStyle = (function(line){
			var cells = line.cells;
	        var tmp = cells.filter(function(cell){
	            return !cell.isHide;
	        })
	        return `${(1/tmp.length)*100}%`;
		})(line);

		return (
			<tr key={key}>
            {
                line.cells.map(function(cell){
                	return (<CellDOM cell={cell} widthStyle={widthStyle}/>)
                })
            }
            </tr>
		)
	}
})
module.exports = LineDOM;