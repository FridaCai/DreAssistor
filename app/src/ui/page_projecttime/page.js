import CTimeLine from './view/timeline.js';
import SubProjectList from './view/subprojectlist.js';
import TaskDetail from './view/taskdetail.js';
import TaskList from './view/tasklist.js';
import API from './api.js';
import './page.less';

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
            return (<div className='pageProjectTime'>
                        <CTimeLine data={this.state.data}/>
                        <div className='leftContainer'>
                            <SubProjectList/>
                            <TaskList/>
                        </div>
                        <TaskDetail/>
                    </div>);    
        }
    }
});

module.exports = PageProjectTime;
