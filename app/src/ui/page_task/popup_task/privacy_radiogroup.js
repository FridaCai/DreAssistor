var PrivacyRadioGroup = React.createClass({
    render: function(){
        return (
            <div className='options'>
                <label>仅自己可见</label>
                <input type='radio' name='privacy'/>
                <label>所有人</label>
                <input type='radio' name='privacy'/>
            </div>
        )     
    }
}) 
module.exports = PrivacyRadioGroup;