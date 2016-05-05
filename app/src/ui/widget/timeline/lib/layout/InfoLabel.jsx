import React from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function'

export default class InfoLabel extends React.Component {
  //shouldComponentUpdate = shouldPureComponentUpdate;

  render () {
    return (
      <div className='rct-infolabel'>
        {this.props.label}
      </div>
    )
  }
}

InfoLabel.propTypes = {
  label: React.PropTypes.string.isRequired
}
InfoLabel.defaultProps = {
  label: ''
}
