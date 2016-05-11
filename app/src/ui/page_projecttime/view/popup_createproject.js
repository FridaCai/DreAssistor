import API from '../api.js';
import Project from '../data/project.js';
import MessageBox from '../../widget/messagebox.js';

var CreateProjectPopup = React.createClass({
	getInitialState: function() {
        return {
            selectedData: [], //{projectId: '', yearId: ''}
        }
    },

    show: function() {
        this.setState({
            selectedData: [],
        });
        this.refs.msgbox.show({
            isShow: true,
        });
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
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

    onAdd:function() {
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
        
    },

    getContent: function() {
        var projects = API.getFilteredProjects(API.getProjects(), API.getProjectTemplates());
        return (
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
        );   
    },
    render: function() {
        var content = this.getContent();
        return (<MessageBox okHandler={this.onAdd} ref='msgbox' children={content}/>);
    }
});

module.exports = CreateProjectPopup;




