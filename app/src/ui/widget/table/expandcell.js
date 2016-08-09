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
        var isOpen = !cell.param.isOpen;

        var line = cell.line;
        line.updateByExpand(isOpen, cell);

        var expandLine = line.expandLine;
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


