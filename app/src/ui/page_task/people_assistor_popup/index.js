import API from '../api.js';
import MessageBox from '../../widget/messagebox.js';
import CTimeLine from '../timeline/index.js';

var PeopleAssistorPopup = React.createClass({
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
            <div>
                <ul className="nav nav-tabs">
                  <li role="presentation" className="active"><a href="#">Home</a></li>
                  <li role="presentation"><a href="#">Profile</a></li>
                  <li role="presentation"><a href="#">Messages</a></li>
                </ul>    




                <div>
                    {
                        API.getProjectArr().map(function(project){
                            return (
                                <CTimeLine project={project} key={project.id}/>
                            )
                        })
                    }
                </div>
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
            okHandler={this.onOkClk} ref='msgbox' children={content} cName={className} hideFooter={true}/>
        );
    },
});

module.exports = PeopleAssistorPopup;