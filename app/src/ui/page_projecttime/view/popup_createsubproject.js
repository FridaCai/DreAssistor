import API from '../api.js';
import Project from '../data/project.js';
import MessageBox from '../../widget/messagebox.js';
import CDropDown from '../../widget/dropdown/dropdown.js';

import Util from '../../../util.js';
import SubProject from '../data/subproject.js';

var CreateSubProjectPopup = React.createClass({
	getInitialState: function() {
        return {
            selectedPeople: [],
            selectedProject: this.props.selectedProject,            
        }
    },

    show: function(newState) {
        this.setState(newState, this.updateJqueryComponent);
        this.refs.msgbox.show();
    },
    
    updateJqueryComponent: function() {
        var options = [];
        var seperator = '___sep___'; //to combine mobileYearId and projectId.

        this.props.projects.map((project)=>{
            options.push({
                id: project.projectId + seperator + project.mobileYearId,
                label: project.name,
            })
        });

        var container = this.refs.projectdropdown;

        var defaultKey = (function(project){
            return project.projectId + seperator + project.mobileYearId;
        })(this.state.selectedProject);

        var param = {
            id: "projectDropdown", //string.
            defaultKey: defaultKey, //string. existed id in options.
            options: options,
            onchange: (function(key){
                var projectId = key.split(seperator)[0];
                var mobileYearId = key.split(seperator)[1];
                
                var project = API.findProject(projectId, mobileYearId);
                this.setState({selectedProject: project});
            }).bind(this)
        };
        CDropDown.create(container, param);
    },
   
    onPersonItemClk: function(person){
        var selected = this.state.selectedPeople.find((_person) => {
            return (_person.id === person.id);
        });

        if(selected) { 
            this.state.selectedPeople = this.state.selectedPeople.filter((_person) => {
                if(_person.id === person.id) {
                    return false;
                }
                return true;
            })
        }else{
            this.state.selectedPeople.push(person);
        }
    },

    onAdd:function() {
        var name = this.refs.name.value;
        var subproject = new SubProject();
        subproject.init({
            id: Util.generateUUID(),
            name: name,
            creator: '0', //AppAPI.getLoginUser().id,
            tasks: [],
            isShow: true,
        });
        this.state.selectedProject.addChild(subproject);
        API.signal_page_refresh.dispatch();

    },

    getContent: function() {
        var people = this.props.people; //todo: get all people.

        return (
            <div className="panel-body createsubprojectpopup">
                <div className='line'>
                    <label>时间包名称:</label>
                    <input type='text' className='name' ref='name'/>
                </div>
                <div className='line'>
                    <label>所属项目:</label>
                    <div className='dropdown project' ref='projectdropdown'></div>
                </div>
                <div className='block'>
                    <label>相关人员:</label>
                    <table className="table">
                        <thead> 
                            <tr> 
                                <th>选择</th> 
                                <th>姓名</th> 
                            </tr> 
                        </thead> 
                        <tbody> 
                            {
                                people.map(((person) => {
                                    return (
                                        <tr key={person.id}> 
                                            <td><input type='checkbox' onClick={this.onPersonItemClk.bind(this, person)}/></td> 
                                            <td>{person.name}</td> 
                                        </tr> 
                                    )
                                }).bind(this))
                            }
                        </tbody>
                      </table>
                </div>
                
            </div>
        );   
    },
    render: function() {
        var content = this.getContent();
        return (<MessageBox title='添加时间包' okHandler={this.onAdd} ref='msgbox' children={content}/>);
    }
});

module.exports = CreateSubProjectPopup;




