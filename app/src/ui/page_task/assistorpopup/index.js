import API from '../api.js';
import MessageBox from '../../widget/messagebox.js';
import PropertyPanel from './propertypanel.js';
import TeacherPanel from './teacherpanel.js';

var AssistorPopup = React.createClass({
    getInitialState: function() {
        return {
        };
    },
    
    show: function(state) {
        var newState = state || this.state;
        this.setState(newState, this.updateAfterMount);
        this.refs.msgbox.show();
    },

    
    getContent: function() {
        return (
            <div className='assistorPopup'>
                <TeacherPanel/>
                <PropertyPanel/>
            </div>
        )
    },

    onOkClk:function() {
    },
    render: function() {
        var content = this.getContent();
        var title = this.state.title;
        var className = 'assistorMsg';
        return (<MessageBox title={title} 
            okHandler={this.onOkClk} ref='msgbox' children={content} cName={className}/>
        );
    },
});

module.exports = AssistorPopup;