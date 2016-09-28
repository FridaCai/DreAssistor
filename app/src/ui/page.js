import API from '../api.js';
import PageHome from './page_home/page.js';
import PageTask from './page_task/page.js';
import PageHotIssue from './page_hotissue/page.js';
import './page.less';

var PageView = React.createClass({
	getInitialState: function() {
        return {}
    },

    componentDidMount: function() {
        this.refreshPage(PageHome);
        API.signal_page_navigate.listen(this.onPageRefresh);
    },

    componentWillUnmount: function() {
        API.signal_page_navigate.unlisten(this.onPageRefresh);
    },

    onPageRefresh: function(e, param){
        var key = param.key;
        var controller;

        switch(key){
            case 'home':
                controller = PageHome;
                break;
            case 'task':
                controller = PageTask;
                break;
            case 'hotissue':
                controller = PageHotIssue;
                break;
        }
        this.refreshPage(controller);
    },

    refreshPage: function(controller){
        var reactElement = React.createElement(controller);
        ReactDOM.render(reactElement, this.refs.page);
    },
    render: function() {
        return (<div ref='page' className=''/>)
    }
});

module.exports = PageView;