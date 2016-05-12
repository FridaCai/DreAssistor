import API from '../api.js';
import Project from '../data/project.js';
import MessageBox from '../../widget/messagebox.js';
import CDropDown from '../../widget/dropdown/dropdown.js';



var CreateSubProjectPopup = React.createClass({
	getInitialState: function() {
        return {
        }
    },

    show: function() {
        this.forceUpdate(this.updateJqueryComponent);
        this.refs.msgbox.show();
    },
    
    updateJqueryComponent: function() {
        var container = this.refs.projectdropdown;
        var param = {
            id: "projectDropdown", //string.
            defaultKey: "", //string. existed id in options.
            prompt: '请选择所属项目',
            options: [{
                id: "op1Id",
                label: "op1 label",
            },{
                id: "op2Id",
                label: "op2 label",
            }],
            onchange: function(){
                debugger;
            } 
        };


        CDropDown.create(container, param);

    },
   

    onAdd:function() {
        
        
    },

    onPersonCheckboxChange: function() {

    },

    getContent: function() {
        var people = [
            {
                id: '0',
                name: 'pai',
                isIn: true,
            },
            {
                id: '1',
                name: 'frida',
                isIn: false,
            }

        ];

        //var people = API.getPeople();

        return (
            <div className="panel-body createsubprojectpopup">
                <div className='line'>
                    <label>时间包名称:</label>
                    <input type='text' className='name'/>
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
                                            <td><input type='checkbox' checked={person.isIn} 
                                                    onChange={this.onPersonCheckboxChange.bind(this, person)}/></td> 
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




