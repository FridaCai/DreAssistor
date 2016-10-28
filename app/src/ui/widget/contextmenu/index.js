import './style.less';

export default class ContextMenu extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isShow: false,
      left: 0,
      top: 0,
      btns: [], 
    }
  }

  show(param) {
    this.setState({
      isShow: true,
      left: param.left,
      top: param.top,
      btns: param.btns,
    });

    $('body').one('click', this.hide.bind(this));
  }

  hide(e, param) {
    this.setState({
      isShow: false,
    })
  }
  onBtnClk(handler, e){
    e.stopPropagation();
    $('body').css({
      cursor:'auto'
    });
    $('html').css({
      cursor:'auto'
    });

    if(handler){
      handler.call(this);
    }
  }
  render() {
    var style = {
      display: this.state.isShow ? 'block': 'none',
      left: this.state.left,
      top: this.state.top,
    }


    var i=0;
    return (
      <div className='contextmenu'>
        <ul style={style} className="dropdown-menu" aria-labelledby="dropdownMenu4">
        {
          
          this.state.btns.map((function(btn){
            var label = btn.label;
            var handler = btn.handler;
            var className = "";

            var disabled = btn.disabled;
            if(disabled){
              className = 'disabled'; 
              handler = null;
            }

            return (
              <li className={className} key={`btn_${i++}`}><a href="javascript:void(0);" onClick={this.onBtnClk.bind(this, handler)}>{label}</a></li>
            )
          }).bind(this))
        }
        </ul>
      </div>
    )
  }
}    