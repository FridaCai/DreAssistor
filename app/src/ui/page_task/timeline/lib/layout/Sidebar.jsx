import { _get, arraysEqual } from '../utils.js'
//import API from '../../../../api.js'


export default class Sidebar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      scrollTop: 0,
      componentTop: 0
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.fixedHeader === 'absolute' && window && window.document && this.state.scrollTop !== nextState.scrollTop) {
      return true
    }

    return !(arraysEqual(nextProps.groups, this.props.groups) &&
             nextProps.keys === this.props.keys &&
             nextProps.width === this.props.width &&
             nextProps.lineHeight === this.props.lineHeight &&
             nextProps.fixedHeader === this.props.fixedHeader &&
             nextProps.zIndex === this.props.zIndex &&
             nextProps.groupHeights === this.props.groupHeights &&
             nextProps.height === this.props.height)
  }

  scroll (e) {
    if (this.props.fixedHeader === 'absolute' && window && window.document) {
      const scroll = window.document.body.scrollTop
      this.setState({
        scrollTop: scroll
      })
    }
  }

  setComponentTop () {
    const viewportOffset = this.refs.sidebar.getBoundingClientRect()
    this.setState({
      componentTop: viewportOffset.top
    })
  }

  componentDidMount () {
    this.setComponentTop()
    this.scroll()

    this.scrollEventListener = {
      handleEvent: (event) => {
        this.scroll()
      }
    }

    window.addEventListener('scroll', this.scrollEventListener)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.scrollEventListener)
  }

  componentWillReceiveProps () {
    this.setComponentTop()
  }

  onProjectClk(projectId, mobileYearId) {
    /*var project = API.findProject(projectId, mobileYearId);
    API.setSelectedProject(project);
    API.signal_page_refresh.dispatch();*/
  }

  onProjectDeleteBtnClk(projectId, mobileYearId) {
    /*var msg = '确定删除？';
 
    API.signal_msgbox_show.dispatch({
      msg: msg,
      okHandler: function() {
        API.deleteProject(projectId, mobileYearId);
        
        API.signal_page_refresh.dispatch();
      }
    });

    event.stopPropagation();*/
  }

  render () {
    const {
      fixedHeader, width, lineHeight, zIndex, groupHeights, height, headerHeight
    } = this.props

    const {groupIdKey, groupTitleKey} = this.props.keys

    const {
      scrollTop
    } = this.state

    const sidebarStyle = {
      width: `${width}px`,
      height: `${height}px`
    }

    const headerStyle = {
      height: `${headerHeight}px`,
      lineHeight: `${lineHeight}px`,
      width: `${width}px`
    }

    const groupsStyle = {
      width: `${width}px`
    }

    if (fixedHeader === 'fixed') {
      headerStyle.position = 'fixed'
      headerStyle.zIndex = zIndex
      groupsStyle.paddingTop = headerStyle.height
    } else if (fixedHeader === 'absolute') {
      let componentTop = this.state.componentTop
      if (scrollTop >= componentTop) {
        headerStyle.position = 'absolute'
        headerStyle.top = `${scrollTop - componentTop}px`
        headerStyle.left = '0'
        groupsStyle.paddingTop = headerStyle.height
      }
    }

    const header = <div ref='sidebarHeader' className='rct-sidebar-header' style={headerStyle}>
                     {this.props.children}
                   </div>

    let groupLines = []
    let i = 0

    this.props.groups.forEach((group, index) => {
      const elementStyle = {
        height: `${groupHeights[index] - 1}px`,
        lineHeight: `${groupHeights[index] - 1}px`
      }

      var isSub = _get(group, 'isSub');
      var projectId = _get(group, 'projectId');
      var mobileYearId = _get(group, 'mobileYearId');

      var dom = (
        <div key={_get(group, groupIdKey)} 
            className={'rct-sidebar-row ' + (i % 2 === 0 ? ' rct-sidebar-row-even' : ' rct-sidebar-row-odd')} 
            style={elementStyle}>
          <span>{_get(group, groupTitleKey)}</span>
        </div>
      );
      
      groupLines.push(dom);
      i += 1
    })

    return (
      <div ref='sidebar' className='rct-sidebar' style={sidebarStyle}>
        {header}
        <div style={groupsStyle}>
          {groupLines}
        </div>
      </div>
    )
  }
}

Sidebar.propTypes = {
  groups: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.object]).isRequired,
  width: React.PropTypes.number.isRequired,
  lineHeight: React.PropTypes.number.isRequired,
  zIndex: React.PropTypes.number,
  fixedHeader: React.PropTypes.oneOf(['fixed', 'absolute', 'none']),
  keys: React.PropTypes.object.isRequired,
  children: React.PropTypes.node
}
Sidebar.defaultProps = {
  fixedHeader: 'none',
  zIndex: 12,
  children: null
}