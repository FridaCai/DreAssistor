var PrivacyRadioGroup = React.createClass({
    privacy: {
        PUBLIC: '0',
        PRIVATE: '1',
    },
    getInitialState: function() {
        return {
            privacy: this.props.privacy,
        };
    },
    onChange: function(value){
        this.setState({
            privacy: value,
        })
    },
    getValue: function(){
        return this.state.privacy;
    },
    render: function(){
        return (
            <div className='options'>
                <input type='radio' name='privacy' 
                    defaultChecked={this.state.privacy === this.privacy.PRIVATE} 
                    onChange={this.onChange.bind(this, this.privacy.PRIVATE)}/>
                >
                <label>仅自己可见</label>
                <input type='radio' name='privacy' 
                    defaultChecked={this.state.privacy === this.privacy.PUBLIC}
                    onChange={this.onChange.bind(this, this.privacy.PUBLIC)}/>
                <label>所有人</label>
            </div>
        )     
    }
}) 
module.exports = PrivacyRadioGroup;