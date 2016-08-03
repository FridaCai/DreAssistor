//todo: more like a component like radio group rather than table cell; 
var ExpandCellDOM = React.createClass({
    getInitialState() {
        return {
            label: this.props.param.label,
            expandComponent: this.props.param.expandComponent,
            isOpen:false,
            //onToggle: this.props.param.onToggle,
        }
    },

    onToggle(){
        /*var isOpen = !this.state.isOpen;
        var expandComponent = this.state.expandComponent;
        this.props.signal_expand_toggle.dispatch({
            isOpen: isOpen, 
            expandComponent: expandComponent
        });*/

        /*var isOpen = !this.state.isOpen;
        this.setState({isOpen:isOpen});
        this.props.cell.signal_expand_toggle.dispatch({
            isOpen:isOpen, 
            expandComponent: this.state.expandComponent,
            cell: this,
        });*/
    },

    render(){
        var label = this.state.label;

        var glyphiconClass = this.state.isOpen ? 'up': 'down';
        var className = `expandBtn glyphicon glyphicon-chevron-${glyphiconClass}`;
        
        return (<div>
            <span>{label}</span>
            <span className={className} onClick={this.onToggle}></span>
        </div>)
    },
})


module.exports = ExpandCellDOM;


