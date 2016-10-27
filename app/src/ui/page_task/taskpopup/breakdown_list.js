import Util from 'Util';
import API from '../api.js';
import Subtasks from '../data/subtasks.js';
import Subtask from '../data/subtask.js';
import RadioGroup from 'RadioGroup';

var BreakDownList = React.createClass({
    getInitialState: function() {
        return {
            subtasks: this.props.param.subtasks,
            isReadOnly: this.props.param.isReadOnly
        }
    },
    getValue(){
        return this.state.subtasks;
    },
  
    onDeleteClk: function(id){
        this.state.subtasks.deleteById(id);
        this.forceUpdate();
    },
    onAddClk: function(){
        var subtaskObj = {
            id: Util.generateUUID(),
            label: this.refs.labelInput.value, //todo: never trust user input.
            status: false,
        }
        
        this.state.subtasks.add(Subtask.create(subtaskObj));
        this.refs.labelInput.value = '';
        this.forceUpdate();
    },
    render: function(){
        var newValue = '';
        var isReadOnly = this.state.isReadOnly;

        return (
            <div className='listContainer'>
                <ul className="list-group">
                {
                    this.state.subtasks.map((function(subtask){
                        var label = subtask.label;
                        var id = subtask.id;

                        var radioGroup = {
                            id: `status_${id}`,
                            selectedId: subtask.status ? 0: 1,
                            options: [{
                                id: 0,
                                label:"完成"
                            },{
                                id: 1,
                                label: "未完成"
                            }],
                            onChange: (function(selectedId){
                                subtask.status = (selectedId === 0 ? true: false);
                            }).bind(this),
                            isReadOnly: isReadOnly
                        }

                        return (
                            <li className="list-group-item" key={id}>
                                {label}
                                <button className='btn btn-default deleteBtn' 
                                    onClick={this.onDeleteClk.bind(this, id)}
                                    disabled={isReadOnly}>
                                    Delete
                                </button>
                                <RadioGroup param={radioGroup} ref='completeStatusRadioGroup'/>
                            </li>          
                        )
                    }).bind(this))
                }
                </ul>
                <div className="input-group">
                  <input disabled={isReadOnly} type="text" className="form-control" ref='labelInput' defaultValue={newValue} placeholder="请输入子豆豆名称" />
                  <span className="input-group-btn">
                    <button className="btn btn-default" type="button" disabled={isReadOnly} onClick={this.onAddClk}>
                        添加子豆豆
                    </button>
                  </span>
                </div>
            </div>
        )
    }
});
module.exports = BreakDownList;
