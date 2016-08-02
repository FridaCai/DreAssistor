import API from '../api.js';
import PageHome from './page_home/page.js';
import PageTask from './page_task/page.js';
import './page.less';

var PageView = React.createClass({
    pageMap:{
        PageHome: PageHome,
        PageTask: PageTask,
    },

	getInitialState: function() {
        return {
        }
    },

    componentDidMount: function() {
        this.refreshPage('PageHome');
        API.signal_page_refresh.listen(this.onPageRefresh);
    },

    componentWillUnmount: function() {
        API.signal_page_refresh.unlisten(this.onPageRefresh);
    },

    onPageRefresh: function(e, param){
        this.refreshPage(param.controller);
    },

    refreshPage: function(controller){
        var reactElement = React.createElement(this.pageMap[controller]);
        ReactDOM.render(reactElement, this.refs.page);
    },
    render: function() {
        return (<div ref='page' className=''/>)
    }
});

module.exports = PageView;