//todo: more like a component like radio group rather than table cell; 
import './style.less';
var ExpandCellDOM = React.createClass({
    getInitialState() {
        return {
            cell: this.props.cell,
        }
    },

    onToggle(){
        var cell = this.state.cell;
        var line = cell.line;
        var table = line.parent;
        
        var isOpen = !cell.param.isOpen;
        table.updateByExpand(isOpen, cell);

        var expandLine = table.getBrotherLine(cell.line);
        expandLine.updateByExpand(isOpen, cell);

        cell.param.onExpandToggle();
    },

    render(){
        var cell = this.state.cell;
        var label = cell.param.label;
        var isOpen = cell.param.isOpen;

        var glyphiconClass = isOpen ? 'up': 'down';
        var className = `expandBtn glyphicon glyphicon-chevron-${glyphiconClass}`;
        
        return (<div onClick={this.onToggle}>
            <span>{label}</span>
            <span className={className}></span>
        </div>)
    },
})



module.exports = ExpandCellDOM;


