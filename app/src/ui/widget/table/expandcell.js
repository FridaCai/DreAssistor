//more like a component like radio group rather than table cell;
import Signal from 'Signal';

var ExpandCell = React.createClass({
    getInitialState() {
        return {
            isOpen:false,
            label: this.props.param.label,
            expandComponent: this.props.param.expandComponent,
        }
    },

/*    _$: function(selector){
        if(!selector)
            return $(ReactDOM.findDOMNode(this));
        else return $(ReactDOM.findDOMNode(this)).find(selector);
    },

    _$container: function(selector){
        var container = this._$().parents('tr').next();

        if(!selector)
            return container;
        else return container.find(selector);
    },
*/
    componentDidMount(){
  //      this._$container().hide();
   //     this._$container('td').css({height:'100%'});
    },

    onToggle(){
        var isOpen = !this.state.isOpen;
        var expandComponent = this.state.expandComponent;
        this.props.signal_expand_toggle.dispatch({
            isOpen: isOpen, 
            expandComponent: expandComponent
        });
    },

    render(){
        var label = this.state.label;
        var expandComponent = this.state.expandComponent;

        var glyphiconClass = this.state.isOpen ? 'up': 'down';
        var className = `expandBtn glyphicon glyphicon-chevron-${glyphiconClass}`;
        
        return (<div>
            <span>{label}</span>
            <span className={className} onClick={this.onToggle}></span>
        </div>)
    },
})

ExpandCell.signal_expand_toggle = new Signal();

module.exports = ExpandCell;


