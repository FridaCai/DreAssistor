import ProjectList from './view/projectlist.js';
import CTimeLine from './view/timeline.js';
import SubProjectList from './view/subprojectlist.js';
import TaskDetail from './view/taskdetail.js';
import API from './api.js';

var PageProjectTime = React.createClass({
	getInitialState: function() {
        return {
            isLoading: true,
            data: undefined,
            selectedProject: undefined,
        }
    },
    componentDidMount: function() {
        API.getData().then(


        (function(param) {
            

            this.setState({
                isLoading: false,
                data: param,
            })



        }).bind(this)
        );
    },
    render: function() {
        if(this.state.isLoading) {
            return (<div>Loading...</div>);
        }else{
            return (<div>
                        <ProjectList data={this.state.data}/>
                        <CTimeLine data={this.state.data}/>
                        <SubProjectList/>
                        <TaskDetail/>
                    </div>);    
        }
    }
});

module.exports = PageProjectTime;
