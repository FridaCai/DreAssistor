import API from '../api.js';
import MessageBox from '../../widget/messagebox.js';

import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import ColorPicker from 'react-colors-picker';
import 'react-colors-picker/assets/index.css';

var TaskPopup = React.createClass({
	getInitialState: function() {
        return {
            popupTitle: '',
            taskName: '',
            desc: '',
            startTime: 0,
            endTime: 0,
            color: 0,
            attachedFiles: [],

            allPriorities: [],
            prioritySelectedKey: 0,
        }
    },

    show: function(newState) {
        this.setState(newState, this.updateJqueryComponent);
        this.refs.msgbox.show();
    },
    
    updateJqueryComponent: function() {
        var container = this.refs.priorityDropdown;

        var options = [];
        for(var key in this.state.allPriorities){
            var priority = this.state.allPriorities[key];
            var label = priority.label;
            options.push({
                id: key,
                label: label
            });
        };

        var defaultKey = this.state.prioritySelectedKey;
        var param = {
            id: "priorityDropdown", //string.
            defaultKey: defaultKey, //string. existed id in options.
            options: options,
            onchange: (function(key){
                this.setState({prioritySelectedKey: key});
            }).bind(this),
        };
        CDropDown.create(container, param);
    },


    onOkClk:function() {
        /*var desc = ;
        var name = ;
        var startTime = ;
        var endTime = ;
        var color = ;
        var priority = ;

        this.state.onOKHandler({
            
        })*/
    },

    render: function() {
        var content = this.getContent();
        return (<MessageBox title={this.state.popupTitle} okHandler={this.onOkClk} ref='msgbox' children={content}/>);
    },

    getContent: function() {
        return null;
    },

});

module.exports = TaskPopup;




