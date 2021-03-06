import './style.less';

var RadioGroup = React.createClass({
    getInitialState: function() {
        return {
            selectedId: this.props.param.selectedId,
        }
    },
    componentWillReceiveProps: function(newProp){
        this.setState({selectedId: newProp.param.selectedId})
    },
    getValue: function() {
        return this.state.selectedId;
    },
    onChange: function(optionId){
        this.setState({selectedId: optionId});
        this.props.param.onChange && this.props.param.onChange.call(this.props.param.scope, optionId);
    },
    render: function(){
        var {id, label, options, isReadOnly} = this.props.param;
        var selectedId = this.state.selectedId;

        return (
            <div className='radioGroup'>
                <label>{label}</label>
                {
                    options.map((function(option){
                        var optionId = option.id;
                        var label = option.label;
                        var checked = (optionId === selectedId);

                        return (
                            <div key={optionId} className='item'>
                                <input disabled={isReadOnly} name={id} type="radio" checked={checked} 
                                    onChange={this.onChange.bind(this, optionId)}/>
                                <label>{label}</label>    
                            </div>
                        )
                    }).bind(this))
                }
            </div>
        )
    }
})
module.exports = RadioGroup;