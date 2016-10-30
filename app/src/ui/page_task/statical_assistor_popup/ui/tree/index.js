'use strict';


import { StyleRoot } from 'radium';
import {Treebeard, decorators} from 'Tree';

import data from './data'; //for testing.
import styles from './styles';
import * as filters from './filter';
import API from '../../api';

const HELP_MSG = 'Select A Node To See Its Data Structure Here...';

// Example: Customising The Header Decorator To Include Icons
decorators.Header = (props) => {
    const style = props.style;
    const iconType = props.node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = { marginRight: '5px' };
    return (
        <a style={style.base} draggable='true' href='javascript:void(0);'>
            <div style={style.title}>
                <i className={iconClass} style={iconStyle}/>
                {props.node.name}
            </div>
        </a>
    );
};

class NodeViewer extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        const style = styles.viewer;
        let json = JSON.stringify(this.props.node, null, 4);
        if(!json){ json = HELP_MSG; }
        return (
            <div style={style.base}>
                {json}
            </div>
        );
    }
}

NodeViewer.propTypes = {
    node: React.PropTypes.object
};

class DataTree extends React.Component {
    constructor(props){
        super(props);
        this.state = {data};
        this.onToggle = this.onToggle.bind(this);
    }
    onToggle(node, toggled){
        if(this.state.cursor){this.state.cursor.active = false;}
        node.active = true;
        if(node.children){ node.toggled = toggled; }
        this.setState({ cursor: node });

        API.signal_treeNode_click.dispatch({entity: node.instance});
    }
    onFilterMouseUp(e){
        const filter = e.target.value.trim();
        if(!filter){ return this.setState({data}); }
        var filtered = filters.filterTree(data, filter);
        filtered = filters.expandFilteredNodes(filtered, filter);
        this.setState({data: filtered});
    }
    render(){
        return (
            <StyleRoot className='datatree'>
                <div style={styles.component}>
                    <Treebeard
                        data={this.state.data}
                        onToggle={this.onToggle}
                        decorators={decorators}
                    />
                </div>
               
            </StyleRoot>

        );
    }
}
module.exports = DataTree;
