import Util from '../../../util.js';
import API from '../api.js';
import SubTask from '../data/subtask.js';

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
        subtask.isDone = status;
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
                        var isDone = subtask.isDone;
                        var id = subtask.id;

                        var radioBtnName = `status_${id}`;

                        return (
                            <li className="list-group-item" key={id}>
                                {label}
                                <div className='buttonGroup'>
                                    <input name={radioBtnName} type="radio" 
                                        defaultChecked={isDone} onChange={this.onStatusChange.bind(this, subtask, true)}/>
                                    <label>完成</label>
                                    <input name={radioBtnName} type="radio" 
                                        defaultChecked={!isDone} onChange={this.onStatusChange.bind(this, subtask, false)}/>
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
