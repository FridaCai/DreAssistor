import CDropDown from '../../widget/dropdown/dropdown.js';

var TaskTemplatePanel = React.createClass({
    getDom1: function(){
        return (
            <div className='taskTemplateContainer'>
                <div className='line name'>
                    <label>Root Cause</label>
                    <textarea defaultValue={''}></textarea>
                </div>
                
                <div className='line name'>
                    <label>Solution</label>
                    <textarea defaultValue={''}></textarea>
                </div>

                <div className='line name'>
                    <label>执行</label>
                    <textarea defaultValue={''}></textarea>
                </div>

                <div className='line name'>
                    <label>反馈</label>
                    <textarea defaultValue={''}></textarea>
                </div>
                <div className='line name'>
                    <button>导出ppt</button>
                </div>
                
            </div>
        )
    },

    getDom2: function(){
        return (
            <div className='taskTemplateContainer'>
                <div className='line'>
                    <button>导入excel</button>
                </div>
                <img src='/app/res/curve.png'/>
            </div>
        )
    },

    updateJqueryComponent: function(){
        (function updateTaskTemplateDropdown(){
            var container = this.refs.templateTypeDropdown;
            var options = [{
                id: 0,
                label: "普通模版",
            },{
                id: 1,
                label: "Hot Issue 模版"
            },{
                id: 2,
                label: "尺寸检测模版"
            }];

            var defaultKey = 0;
            var param = {
                id: "templateTypeDropdown", //string.
                defaultKey: defaultKey, //string. existed id in options.
                options: options,
                onchange: (function(key){
                    //this.refs.taskTemplatePanel.updateByType(key);
                }).bind(this),
            };
            this.templateTypeDropdown = CDropDown.create(container, param);
        }).call(this);
    },

    componentDidMount: function(){
        this.updateJqueryComponent();
    },

    render: function(){
        return (
            <div className='taskTemplateContainer'>
                <span ref='templateTypeDropdown'/>
                {this.getDom2()}
            </div>
        )
        
    }

});
module.exports = TaskTemplatePanel;
