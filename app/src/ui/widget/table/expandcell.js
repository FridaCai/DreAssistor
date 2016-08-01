var ExpandCell = React.createClass({
    getInitialState() {
        return {
            isOpen:false,
        }
    },

    onToggle(){
        var isOpen = !this.state.isOpen;
        this.setState({
            isOpen: isOpen
        })
        this.props.onToggleExpandPanel(isOpen);
    },

    render(){
        var label = this.props.label;
        var glyphiconClass = this.state.isOpen ? 'up': 'down';
        var className = `expandBtn glyphicon glyphicon-chevron-${glyphiconClass}`;
        return (<div>
            <span>{label}</span>
            <span className={className} onClick={this.onToggle}></span>
        </div>)
    },




    onToggleAttachment(key, isOpen){
        this.runExpandCellAmination(key, isOpen).then(function(){

        })
    },
    onToggleCurve(key, isOpen){
        var container = this._$(`.expandContainer.${key}`).find('.expandDiv')[0];

        if(!isOpen){
            ReactDOM.unmountComponentAtNode(container);  
            this.runExpandCellAmination(key, isOpen);
            return;
        }


        this.runExpandCellAmination(key, isOpen).then((function(){
//            var el = React.createElement(CurveComponent); 
  //          ReactDOM.render(el, container);
        }).bind(this))
        
    },

    runExpandCellAmination(key, isOpen){

        var h = isOpen ? 500 : 0;
        var duration = 500;


        return new Promise((function(resolve, reject){
            this._$(`.expandContainer.${key}`).animate({
                height:h
            }, duration, function() {
                resolve();
            });
        }).bind(this))

        
    },
})
module.exports = ExpandCell;