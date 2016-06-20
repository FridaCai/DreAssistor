var RadioGroup = React.createClass({
    getInitialState: function() {
        return {
            selectedId: this.props.param.selectedId,
        }
    },

    onStatusChange:function(selectedId){
        this.props.onStatusChange(selectedId);
    },

    shouldComponentUpdate: function(){
        return false;
    },
    
    render: function(){
        var id = this.props.param.id;
        var options = this.props.param.options;
        var selectedId = this.props.param.selectedId;

        return (
            <div className='radioGroup'>
            {
                options.map((function(option){
                    var optionId = option.id;
                    var label = option.label;
                    var defaultChecked = (optionId === selectedId);

                    return (
                        <div key={optionId} className='item'>
                            <input name={id} type="radio" defaultChecked={defaultChecked} 
                                onChange={this.onStatusChange.bind(this, optionId)}/>
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