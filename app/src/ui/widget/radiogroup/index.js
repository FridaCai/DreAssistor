import './style.less';

var RadioGroup = React.createClass({
    getInitialState: function() {
        return {
            selectedId: this.props.param.selectedId,
        }
    },

    getValue: function() {
        return this.state.selectedId;
    },
    onChange: function(optionId){
        this.setState({selectedId: optionId});
        this.props.param.onChange && this.props.param.onChange.call(this.props.param.scope, optionId);
    },
    render: function(){
        var id = this.props.param.id;
        var label = this.props.param.label;
        var options = this.props.param.options;
        var selectedId = this.state.selectedId;

        return (
            <div className='radioGroup'>
                <label>{label}</label>
                {
                    options.map((function(option){
                        var optionId = option.id;
                        var label = option.label;
                        var defaultChecked = (optionId === selectedId);

                        return (
                            <div key={optionId} className='item'>
                                <input name={id} type="radio" defaultChecked={defaultChecked} 
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