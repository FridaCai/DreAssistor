import API from '../../api.js';
import StaticalPage from '../page_task/statical_assistor_popup/page';

var PageHotIssue = React.createClass({
  getInitialState: function() {
      return {
      }
  },
  render: function() {
  	var taskType = 2;
    return (
		<StaticalPage taskType={taskType}/>
    );
  }
});

module.exports = PageHotIssue;