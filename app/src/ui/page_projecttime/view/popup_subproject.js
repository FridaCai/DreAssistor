import API from '../api.js';
import Util from '../../../util.js';
import MessageBox from '../../widget/messagebox.js';
import CDropDown from '../../widget/dropdown/dropdown.js';
import Subproject from '../data/subproject.js';

var SubProjectPopup = React.createClass({
	getInitialState: function() {
        return {
            popupTitle: '',
            subprojectName: '', //for name input box.
            projectList: [], //for project dropdown 
            projectSelectedKey: '', //for selected item in dropdown
            peopleList: [], 
            peopleSelectedList: [],
        }
    },

    show: function(newState) {
        this.setState(newState, this.updateJqueryComponent);
        this.refs.msgbox.show();
    },
    
    updateJqueryComponent: function() {
        var seperator = Util.SEPERATOR;
        var container = this.refs.projectdropdown;

        var options = [];
        this.state.projectList.map((project)=>{
            options.push({
                id: project.projectId + seperator + project.mobileYearId,
                label: project.name,
            })
        });
        var defaultKey = this.state.projectSelectedKey;
        var param = {
            id: "projectDropdown", //string.
            defaultKey: defaultKey, //string. existed id in options.
            options: options,
            onchange: (function(key){
                var projectId = key.split(seperator)[0];
                var mobileYearId = key.split(seperator)[1];
                var project = API.findProject(projectId, mobileYearId);
                var key = project.projectId + seperator + project.mobileYearId;
                this.setState({projectSelectedKey: key});
            }).bind(this),
        };
        CDropDown.create(container, param);
    },

    onPersonItemClk: function(person){
        var peopleSelectedList = this.state.peopleSelectedList;

        var selected = peopleSelectedList.find((_person) => {
            return (_person.id === person.id);
        });
        
        if(selected) { 
            peopleSelectedList = peopleSelectedList.filter((_person) => {
                if(_person.id === person.id) {
                    return false;
                }
                return true;
            })
        }else{
            peopleSelectedList.push(person);
        }

        this.setState({
            peopleSelectedList: peopleSelectedList,
        })
    },

    onOkClk:function() {
        var name = this.refs.name.value;
        
        var project = (function(arr){
            var projectId = arr[0];
            var mobileYearId = arr[1];
            return API.findProject(projectId, mobileYearId);
        })(this.state.projectSelectedKey.split(Util.SEPERATOR));

        var peopleIds = (function(){
            return this.state.peopleSelectedList.map(function(person){
                return person.id;
            })
        }).call(this);

        this.state.onOKHandler({
            name: name,
            project: project,
            peopleIds: peopleIds,
        })
    },

    render: function() {
        var content = this.getContent();
        return (<MessageBox title={this.state.popupTitle} okHandler={this.onOkClk} ref='msgbox' children={content}/>);
    },

    getContent: function() {
        var name = this.state.subprojectName;
        var peopleList = this.state.peopleList; 
        var peopleSelectedList = this.state.peopleSelectedList;

        var isSelected = function(people){
            var found = peopleSelectedList.find(function(_people) {
                return _people.id === people.id;
            })
            return found ? true : false;
        }

        return (
            <div className="panel-body createsubprojectpopup">
                <div className='line'>
                    <label>时间包名称:</label>
                    <input type='text' className='name' ref='name' defaultValue={name}/>
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
                                peopleList.map(((person) => {
                                    return (
                                        <tr key={person.id}> 
                                            <td>
                                                <input type='checkbox' 
                                                    onChange={this.onPersonItemClk.bind(this, person)} 
                                                    checked={isSelected(person)}/>
                                            </td> 
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

});

module.exports = SubProjectPopup;




