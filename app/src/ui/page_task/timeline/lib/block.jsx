import API from '../../../api.js';
import Util from '../../../../../util.js';
import Task from '../../../data/task.js';


export default class Block extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      left: undefined,
      top: undefined,
      width: undefined,
      height: undefined,
      isShow: false,

      parent: undefined,
      startTime: 0,
      endTime: 0,
    }
  }

  show(param) {
    this.setState({
      isShow: true,
      left: param.left,
      top: param.top,
      width: param.width,
      height: param.height,
      parent: param.parent,
      startTime: param.startTime,
      endTime: param.endTime,
    });
  }

  hide() {
    this.setState({isShow: false});
  }
  onContextMenu(e) {
    var self = this;
    API.signal_timelineContextmenu_show.dispatch({
      left: e.clientX,
      top: e.clientY,
      btns: [{
        label: '添加任务',
        handler: function(){
          var task = new Task(); //default task; new Task
          task.init({
            id: Util.generateUUID(),
            name: '未命名',
            startTime: self.state.startTime,
            endTime: self.state.endTime,
            desc: '',
            markColor: 2201331,
            attachments: [],
            creatorId: API.getLoginUser().id,
            peopleIds: [],
            priority: 0,
          });

          var parent = self.state.parent; //project or subproject
          //task.setParent(parent);
          //API.addTask(task, parent);
          parent.addTask(task);
          API.signal_page_refresh.dispatch();
        }
      }],
    });
    e.preventDefault();

  }

  render () {
    var style = {
      left: `${this.state.left}px`,
      top: `${this.state.top}px`,
      width: `${this.state.width}px`,
      height: `${this.state.height}px`,
      display: this.state.isShow ? 'block': 'none',
    }

    return (
      <div className='rct-block' style={style} onContextMenu={this.onContextMenu.bind(this)}></div>
    )
  }
}

