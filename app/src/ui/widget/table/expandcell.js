var ExpandCell = React.createClass({
    getInitialState() {
        return {
            isOpen:false,
            label: this.props.param.label,
            expandComponent: this.props.param.expandComponent,
        }
    },

    _$: function(selector){
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

    componentDidMount(){
        this._$container().hide();
        this._$container('td').css({height:'100%'});
    },

    onToggle(){
        var isOpen = !this.state.isOpen;
        this.setState({
            isOpen: isOpen
        })

        //var container = this._expandContainer().find('.expandDiv')[0];
        if(!isOpen){
            //ReactDOM.unmountComponentAtNode(container);  
            
            this.runExpandAmination(isOpen).then((function(){
                this._$container().hide();    
            }).bind(this));    
        }else{
            this._$container().show();
            this.runExpandAmination(isOpen).then((function(){
                //var el = React.createElement(this.state.expandComponent); 
                //ReactDOM.render(el, container);
            }).bind(this));
        }
    },

    runExpandAmination(isOpen){
        var h = isOpen ? 500 : 0;
        var duration = 500;

        return new Promise((function(resolve, reject){
            this._$container().animate({
                height:h
            }, duration, function() {
                resolve();
            });
        }).bind(this))
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
module.exports = ExpandCell;


