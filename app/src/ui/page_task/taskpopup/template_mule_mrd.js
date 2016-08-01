import RadioGroup from 'RadioGroup';
//import CurveComponent from '../../component_curve/index.js';

import './template_mule_mrd.less';

var ExpandCell = React.createClass({
    getInitialState() {
        return {
            isOpen:false,
        }
    },

    onToggle(){
        var isOpen = !this.state.isOpen;
        this.setState({
            isOpen: isOpen
        })
        this.props.onToggleExpandPanel(isOpen);
    },

    render(){
        var label = this.props.label;
        var glyphiconClass = this.state.isOpen ? 'up': 'down';
        var className = `expandBtn glyphicon glyphicon-chevron-${glyphiconClass}`;
        return (<div>
            <span>{label}</span>
            <span className={className} onClick={this.onToggle}></span>
        </div>)
    }
})


var MuleMRDTemplate = React.createClass({
    getInitialState() {
        return {
            param: this.props.param,
            project: this.props.project,
        }
    },

    _$: function(selector){
        if(!selector)
            return $(ReactDOM.findDOMNode(this));
        else return $(ReactDOM.findDOMNode(this)).find(selector);
    },

    onToggleAttachment(key, isOpen){
        this.runExpandCellAmination(key, isOpen).then(function(){

        })
    },
    onToggleCurve(key, isOpen){
        var container = this._$(`.expandContainer.${key}`).find('.expandDiv')[0];

        if(!isOpen){
            ReactDOM.unmountComponentAtNode(container);  
            this.runExpandCellAmination(key, isOpen);
            return;
        }


        this.runExpandCellAmination(key, isOpen).then((function(){
//            var el = React.createElement(CurveComponent); 
  //          ReactDOM.render(el, container);
        }).bind(this))
        
    },

    runExpandCellAmination(key, isOpen){

        var h = isOpen ? 500 : 0;
        var duration = 500;


        return new Promise((function(resolve, reject){
            this._$(`.expandContainer.${key}`).animate({
                height:h
            }, duration, function() {
                resolve();
            });
        }).bind(this))

        
    },

	render(){
        var tbodyDom = (function(){
            var dom = [];

            Object.keys(this.state.param).map((function(key){
                var value = this.state.param[key];
                var label = value.label;
                var ref = (function(refKey, project, label){
                    return refKey && project ? project[refKey]: '';
                }).call(this, value.refKey, this.state.project, label)

                var radioGroupParam = {
                    id: `${key}_radiogroup`,
                    selectedId: value.status ? 0: 1,
                    options: [{
                        id: 0,
                        label:"完成"
                    },{
                        id: 1,
                        label: "未完成"
                    }],
                    onChange: (function(selectedId){
                        value.status = (selectedId === 0 ? true: false);
                    }).bind(this),
                }

                var inputDom = (function(){
                    var numberValue = value.value;
                    if(numberValue != null){
                        return (
                            <input defaultValue={numberValue}></input>
                        )
                    }
                    return (<ExpandCell label={'曲线图'} onToggleExpandPanel={this.onToggleCurve.bind(this, key)}/>)
                }).bind(this)


                var attachmentDom = (function(){
                    return (<ExpandCell label={'附件'} onToggleExpandPanel={this.onToggleAttachment.bind(this, key)}/>)
                }).bind(this)

                dom.push(
                    <tr key={key}>
                        <td>{label}</td>
                        <td>{ref}</td>
                        <td><RadioGroup param={radioGroupParam}/></td>
                        <td>{inputDom()}</td>
                        <td>{attachmentDom()}</td>
                    </tr>

                )
                dom.push(
                    <tr key={`expandContainer_${key}`} className={`expandContainer ${key}`}>
                        <td colSpan='5'>
                            <div className='expandDiv'></div>
                        </td>
                    </tr>
                )
            }).bind(this))



            return dom;
        }).call(this);


        return (
            <div className='mule_mrd'>
            {
                <table>
                    <thead className="thead-inverse">
                        <tr>
                            <th>属性</th>
                            <th>目标</th>
                            <th>状态</th>
                            <th>实测</th>
                            <th>附件</th>
                        </tr>
                    </thead>
                    <tbody>
                    {tbodyDom}
                    </tbody>
                </table>
            }
            </div>
        )
	}
});
module.exports = MuleMRDTemplate;