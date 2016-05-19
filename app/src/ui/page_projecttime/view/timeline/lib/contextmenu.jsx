import API from '../../../api.js';

export default class ContextMenu extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isShow: false,
      left: 0,
      top: 0,
    }
  }

  componentDidMount() {
    API.signal_timelineContextmenu_show.listen(this.show.bind(this));
  }

  componentDidUnMount() {
    API.signal_timelineContextmenu_show.unlisten(this.show.bind(this)); 
  }
  
  show(e, param) {
    this.setState({
      isShow: true,
      left: param.x,
      top: param.y
    });

    $('body').one('click', this.hide.bind(this));
  }
  hide(e, param) {
    this.setState({
      isShow: false,
    })
  }

  onAddNewTask() {
    //show popup.
    
  }

  render() {
    var style = {
      display: this.state.isShow ? 'block': 'none',
      left: this.state.left,
      top: this.state.top,
    }

    return (
        <ul style={style} className="dropdown-menu" aria-labelledby="dropdownMenu4">
          <li><a href="#" onClick={this.onAddNewTask}>添加任务</a></li>
        </ul>
    );
  }
}    