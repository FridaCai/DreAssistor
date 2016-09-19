'use strict';
import Radium from 'radium';

const Loading = (props) => {
    return (
        <div style={props.style}>
            loading...
        </div>
    );
};

Loading.propTypes = {
    style: React.PropTypes.object
};

const Toggle = (props) => {
    const style = props.style;
    const rotateZDegree = props.rotateZDegree;

    
    const height = style.height;
    const width = style.width;
    let midHeight = height * 0.5;
    let points = `0,0 0,${height} ${width},${midHeight}`;

    var s = $.extend({
        transform: `rotateZ(${rotateZDegree}deg)`
    }, style.base);

    return (
        <div style={s} >
            <div style={style.wrapper}>
                <svg height={height} width={width}>
                    <polygon
                        points={points}
                        style={style.arrow}
                    />
                </svg>
            </div>
        </div>
    );
};

Toggle.propTypes = {
    style: React.PropTypes.object
};

const Header = (props) => {
    const style = props.style;
    return (
        <div style={style.base}>
            <div style={style.title}>
                {props.node.name}
            </div>
        </div>
    );
};

Header.propTypes = {
    style: React.PropTypes.object,
    node: React.PropTypes.object.isRequired
};

class Container extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        const {style, decorators, terminal, onClick, node} = this.props;
        return (
            <div
                ref="clickable"
                onClick={onClick}
                style={style.container}>
                { !terminal ? this.renderToggle() : null }
                <decorators.Header
                    node={node}
                    style={style.header}
                />
            </div>
        );
    }
    renderToggle(){
        return this.renderToggleDecorator();
    }
    renderToggleDecorator(){
        var {style, decorators, animations} = this.props;
        var degree = animations.toggle.animation.rotateZ;

        return (<decorators.Toggle style={style.toggle} rotateZDegree={degree}/>);
    }
}

Container.propTypes = {
    style: React.PropTypes.object.isRequired,
    decorators: React.PropTypes.object.isRequired,
    terminal: React.PropTypes.bool.isRequired,
    onClick: React.PropTypes.func.isRequired,
    animations: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.bool
    ]).isRequired,
    node: React.PropTypes.object.isRequired
};

Container = Radium(Container);

export default {
    Loading,
    Toggle,
    Header,
    Container
};
