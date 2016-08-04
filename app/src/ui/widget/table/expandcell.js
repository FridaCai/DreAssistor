//todo: more like a component like radio group rather than table cell; 
import API from './api.js';

var ExpandCellDOM = React.createClass({
    /*
        cell.param = {
            label: '曲线图',
            expandComponent: CurveComponent,
            isOpen: false,
        }
    */
    getInitialState() {
        return {
            cell: this.props.cell,
        }
    },

    onToggle(){
        var cell = this.state.cell;
        var isOpen = !cell.param.isOpen;

        this.setState({isOpen:isOpen});
        API.signal_expand_toggle.dispatch({
            isOpen:isOpen, 
            cell: cell,
        });
    },

    render(){
        var cell = this.state.cell;
        var label = cell.param.label;
        var isOpen = cell.param.isOpen;

        var glyphiconClass = isOpen ? 'up': 'down';
        var className = `expandBtn glyphicon glyphicon-chevron-${glyphiconClass}`;
        
        return (<div onClick={this.onToggle}>
            <span>{label}</span>
            <span className={className} ></span>
        </div>)
    },
})



module.exports = ExpandCellDOM;


