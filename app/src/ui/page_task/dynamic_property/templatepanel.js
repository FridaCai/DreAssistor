import API from '../../api.js';

//only general template. there also should be hot issue and size detect templates.
var TemplatePanel = React.createClass({
	getInitialState: function() {
        return {
            type: undefined, //0--general; 1--hot issue, 2--size detect

            hasNewLine: false,
            
        }
    },
    propertyList: undefined,
    updateByType: function(type){
        switch(type){
            case 0:
                this.propertyList = [
                    {
                        key: '文字属性',
                        value: 'abcd',
                        type: 'Text'
                    }, {
                        key: '数值属性',
                        value: '123',
                        type: 'Number',
                    }, {
                        key: '曲线',
                        value: '/app/res/curve.png',
                        type: 'Curve',
                    }, {
                        key: '图片',
                        value: '/app/res/patac.jpeg',
                        type: 'Img',
                    }
                ];
                break;
            case 1: 
                this.propertyList = [
                    
                ];
                break;
            case 2:
                this.propertyList = [

                ];
                break;
        }
    },
    componentDidMount: function(){
        this.updateJqueryComponent();
    },

    updateJqueryComponent: function(){
        if(!this.hasNewLine)
            return;

        var container = this.refs.propertyTypeDropdown;
        var options = [{
            id: 0,
            label:"数值"
        },{
            id: 1,
            label: "文字"
        },{
            id: 2,
            label: "曲线"
        },{
            id: 3,
            label: '图片'
        }];

        var defaultKey = 0;
        var param = {
            id: "propertyTypeDropdown", //string.
            defaultKey: defaultKey, //string. existed id in options.
            options: options,
            onchange: (function(key){
                
            }).bind(this),
        };
        this.propertyTypeDropdown = CDropDown.create(container, param);
    },

    onAddModeEnter: function() {
        this.setState({
            hasNewLine: true,
        })
    },

    onAddTaskBtnClk: function() {
        var state = this.state.propertyList;
        state.push({
            key: 'abc',
            value: 'def',
            type: 'Text',
        });
        this.setState({
            propertyList: state,
        })
    },


    render: function() {




        var getNewLine = (function(){
            if(!this.state.hasNewLine)
                return null;

            return (
                <div className='line'>
                    <label>名称</label>
                    <input/>

                    <label>类型</label>
                    <span ref='propertyTypeDropdown'/>

                    <span className="label label-primary addTaskBtn" onClick={this.onAddTaskBtnClk}>OK</span>
                </div>
            )
        }).bind(this);


        return (
            <div className='taskTemplatePanel'>
                <div>
                    <span className="label label-primary addTaskBtn" onClick={this.onAddModeEnter}>+</span>
                    {getNewLine()}
                    <div className='dynamicPropertyList'>
                    {
                        this.state.propertyList.map((function(property){
                            var key = property.key;
                            var value = property.value;
                            switch(property.type){
                                case 'Text':
                                case 'Number':
                                    return (
                                         <div className='line'>
                                            <label>{key}</label>
                                            <label>{value}</label>
                                        </div>
                                    )
                                case 'Curve':
                                case 'Img':
                                    return (
                                        <div className='line'>
                                            <label>{key}</label>
                                            <img src={value}/>
                                        </div>
                                    )
                               default: 
                                    return null;
                            }
                        }).bind(this))
                    }
                    </div>
                </div>
            </div>
        )
    },
});

module.exports = TemplatePanel;


