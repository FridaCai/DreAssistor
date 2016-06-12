import Util from '../../../util.js';
import API from '../api.js';
import SubTask from '../data/subtask.js';

var BreakDownList = React.createClass({
    getInitialState: function() {
        return {
            task: this.props.task,
        }
    },

    onDoneClk: function(id){
        var subtask = this.state.task.findSubTask(id);
        subtask.setIsDone(true);
        this.forceUpdate();
    },
    onUnDoneClk: function(id){
        var subtask = this.state.task.findSubTask(id);
        subtask.setIsDone(false);
        this.forceUpdate();
    },
    onDeleteClk: function(id){
        this.state.task.deleteSubTask(id);
        this.forceUpdate();
    },
    onAddClk: function(){
        var param = {
            id: Util.generateUUID(),
            label: this.refs.labelInput.value, //todo: never trust user input.
            isDone: false,
        }
        var subtask = new SubTask();
        subtask.init(param);
        this.state.task.addSubTask(subtask);

        this.refs.labelInput.value = '';
        this.forceUpdate();
    },
    render: function(){
        var newValue = '';
        return (
            <div className='listContainer'>
                <ul className="list-group">
                {
                    this.state.task.subtasks.map((function(subtask){
                        var label = subtask.label;
                        var isDone = subtask.isDone;
                        var id = subtask.id;

                        var radioBtnName = `status_${id}`;

                        return (
                            <li className="list-group-item" key={id}>
                                {label}
                                <div className='buttonGroup'>
                                    <input name={radioBtnName} type="radio" 
                                        defaultChecked={isDone} onChange={this.onDoneClk.bind(this, id)}/>
                                    <label>完成</label>
                                    <input name={radioBtnName} type="radio" 
                                        defaultChecked={!isDone} onChange={this.onUnDoneClk.bind(this, id)}/>
                                    <label>未完成</label>
                                    <button className='btn btn-default deleteBtn' 
                                        onClick={this.onDeleteClk.bind(this, id)}>
                                        Delete
                                    </button>
                                </div>
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
