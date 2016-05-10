import API from '../api.js';
import Project from '../data/project.js';

var CreateProjectPopup = React.createClass({
	getInitialState: function() {
        return {
            isShow: false,
            selectedData: [], //{projectId: '', yearId: ''}
        }
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        if(nextState.isShow !== this.state.isShow){
            return true;
        }
        return false;
    },

    componentDidMount: function() {
       
    },

    hide: function() {
        this.setState({
            isShow: false,
        })
    },
    onMaskClk:function() {
        this.hide();  
    },
    onCloseBtnClk: function() {
        this.hide();
    },
    onCancelBtnClk: function() {
        this.hide();
    },
    onProjctItemClk: function(projectId, yearId) {
        var selected = this.state.selectedData.find((data) => {
            return (data.projectId === projectId && data.yearId === yearId);
        });

        if(selected) {
            this.state.selectedData = this.state.selectedData.filter((data) => {
                if(data.projectId === projectId && data.yearId === yearId) {
                    return false;
                }
                return true;
            })
        }else{
            this.state.selectedData.push({
                projectId: projectId,
                yearId: yearId,
            })
        }
    },
    onAddBtnClk:function() {
        var addedProjects = [];
        var creator = 'pai'; //hardcode now.

        var getProjectName = (function(rawProjectId, mobileYearId) {
            var project = API.getProjectTemplates().find((project) => {
                return (project.projectId === rawProjectId);
            })

            var mobileYear = project.mobileYears.find((mobileYear) => {
                return (mobileYearId === mobileYear.id);
            })

            return `${project.label}-MY${mobileYear.label}`;
        }).bind(this);


        this.state.selectedData.map((selectedData) => {
            var projectId = selectedData.projectId;
            var yearId = selectedData.yearId;

            var project = new Project();
            project.init({
                projectId: projectId,
                mobileYearId: yearId,
                name: getProjectName(projectId, yearId),
                children: [],
                tasks: [],
                creator: creator,
            });

            addedProjects.push(project);
        });

        API.signal_projects_add.dispatch({projects: addedProjects});
        this.hide();
    },


    render: function() {
        if(!this.state.isShow) 
            return null;

        var projects = API.getFilteredProjects(API.getProjects(), API.getProjectTemplates());
        return (
            <div className="createProjectPopup" data-reactid=".0.1.3">
                <div className="mask" onClick={this.onMaskClk}></div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <span>常用项目</span>
                        <span className='closeBtn' onClick={this.onCloseBtnClk}>X</span>
                    </div>
                    <div className="panel-body">
                        <ul>
                            {
                                projects.map(project => {
                                    var projId = project.projectId;
                                    var projLabel = project.label;
                                    var years = project.mobileYears;

                                    return (<li key={projId}>
                                        <span>{projLabel}</span>
                                        <ul>
                                        {
                                            years.map(year => {
                                                var yearId = year.id;
                                                var yearLabel = year.label;

                                                return(
                                                    <li key={yearId}>
                                                        <input type="checkbox" ref='projectCheckbox' onClick={this.onProjctItemClk.bind(this, projId, yearId)}/>
                                                        <span>{yearLabel}</span>
                                                    </li>
                                                );
                                            })
                                        }
                                        </ul>
                                    </li>);
                                })
                            }
                        </ul>
                    </div>

                    <div className="footer">
                      <a href="#" className="btn btn-primary" role="button" onClick={this.onAddBtnClk}>确定</a> 
                      <a href="#" className="btn btn-default" role="button" onClick={this.onCancelBtnClk}>取消</a>
                    </div>
                </div>
            </div>
        );   
    }
});

module.exports = CreateProjectPopup;




