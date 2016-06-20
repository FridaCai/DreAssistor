import API from '../api.js';
import MessageBox from '../../widget/messagebox.js';

var AssistorPopup = React.createClass({
    getInitialState: function() {
        return {
        };
    },
    
    show: function(state) {
        var newState = state || this.state;
        this.setState(newState, this.updateJqueryComponent);

        debugger;//what about templateTask???
        this.refs.msgbox.show();
    },

    getContent: function() {
        return (
          <div className='assistorPopup'>
                <div className='teacherPanel'>
                    <ul className="nav nav-tabs">
                      <li role="presentation" className="active"><a href="#">前辈A</a></li>
                      <li role="presentation"><a href="#">前辈B</a></li>
                      <li role="presentation"><a href="#">前辈C</a></li>
                    </ul>
                </div>
                <div className='infoSearchPanel'>
                    
                    //豆豆类别对应的属性
                </div>
            </div>
        )

    },

    updateJqueryComponent: function() {
        return;
    },

    onOkClk:function() {
    },
    render: function() {
        var content = this.getContent();
        var title = this.state.title;
        return (<MessageBox width={700} title={title} okHandler={this.onOkClk} ref='msgbox' children={content}/>);
    },
});

module.exports = AssistorPopup;