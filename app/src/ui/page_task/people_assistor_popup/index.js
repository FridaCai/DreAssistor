import API from '../api.js';
import MessageBox from '../../widget/messagebox.js';
import CTimeLine from '../timeline/index.js';

var PeopleAssistorPopup = React.createClass({
    getInitialState: function() {
        return {
            selectedUserIndex: 0,
        };
    },
    
    show: function(state) {
        var newState = state || this.state;
        this.setState(newState, this.updateAfterMount);
        this.refs.msgbox.show();
    },

    onSelectUser: function(index){
        this.setState({
            selectedUserIndex:index,
        })
    },

    getContent: function() {
        var users = API.findUsersHaveProject();
        var selectedUser = users[this.state.selectedUserIndex];
        
        var filter = API.filterProjectsByUser(selectedUser);
        var projects = API.getProjectArr();

        var userIndex = 0;
        return (
            <div>
                <ul className="nav nav-tabs">
                {
                    users.map((function(user){
                        var userName = user.name; 
                        var userId = user.id;
                        var className = (userId === selectedUser.id ? 'active': '');
                        return (
                            <li role="presentation" className={className} key={userId} 
                                onClick={this.onSelectUser.bind(this, userIndex++)}>
                                <a href="javascript:void(0);">{userName}</a>
                            </li>
                        )
                    }).bind(this))
                }
                </ul>    

                <div>
                {
                    //also filter project with userfilter???
                    projects.map(function(project){
                        return (
                            <CTimeLine project={project} key={project.id} filter={filter}/>
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