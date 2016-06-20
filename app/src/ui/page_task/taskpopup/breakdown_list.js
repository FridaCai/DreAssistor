import Util from '../../../util.js';
import API from '../api.js';
import SubTask from '../data/subtask.js';
import RadioGroup from '../../widget/radiogroup/index.js';

var BreakDownList = React.createClass({
    getInitialState: function() {
        return {
            subtasks: this.props.subtasks,
        }
    },
    getValue(){
        return this.state.subtasks;
    },

    onStatusChange: function(subtask, status){
        subtask.isDone = (status === 0 ? true: false);
    },
  
    onDeleteClk: function(id){
        var sts = this.state.subtasks.filter(function(st){
            return !(id === st.id);
        })

        this.setState({
            subtasks: sts,
        })
    },
    onAddClk: function(){
        var subtask = {
            id: Util.generateUUID(),
            label: this.refs.labelInput.value, //todo: never trust user input.
            isDone: false,
        }
        
        this.state.subtasks.unshift(subtask);

        this.refs.labelInput.value = '';
        this.forceUpdate();
    },
    render: function(){
        var newValue = '';
        return (
            <div className='listContainer'>
                <ul className="list-group">
                {
                    this.state.subtasks.map((function(subtask){
                        var label = subtask.label;
                        var id = subtask.id;

                        var radioGroup = {
                            id: `status_${id}`,
                            selectedId: subtask.isDone ? 0: 1,
                            options: [{
                                id: 0,
                                label:"完成"
                            },{
                                id: 1,
                                label: "未完成"
                            }]
                        }

                        return (
                            <li className="list-group-item" key={id}>
                                {label}
                                <button className='btn btn-default deleteBtn' 
                                    onClick={this.onDeleteClk.bind(this, id)}>
                                    Delete
                                </button>
                                <RadioGroup param={radioGroup} ref='completeStatusRadioGroup' onStatusChange={this.onStatusChange.bind(this, subtask)}/>
                            </li>          
                        )
                    }).bind(this))
                }
                </ul>
                <div className="input-group">
                  <input type="text" className="form-control" ref='labelInput' defaultValue={newValue} placeholder="请输入子豆豆名称" />
                  <span className="input-group-btn">
                    <button className="btn btn-default" type="button" onClick={this.onAddClk}>
                        添加子豆豆
                    </button>
                  </span>
                </div>
            </div>
        )
    }
});
module.exports = BreakDownList;
