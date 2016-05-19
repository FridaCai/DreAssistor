import API from '../../../api.js';


export default class Block extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      left: undefined,
      top: undefined,
      width: undefined,
      height: undefined,
      isShow: false,
    }
  }

  show(param) {
    this.setState({
      isShow: true,
      left: param.left,
      top: param.top,
      width: param.width,
      height: param.height,
    });
  }

  hide() {
    this.setState({isShow: false});
  }
  onContextMenu(e) {
    var x = e.clientX;
    var y = e.clientY;
    API.signal_timelineContextmenu_show.dispatch({
      x: x,
      y:y
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
      <div className='rct-block' style={style} onContextMenu={this.onContextMenu}></div>
    )
  }
}

