import HotIssue from '../data/template/hotissue.js';

var HotIssueTemplate = React.createClass({
    getValue(){
        var hotissue = new HotIssue();
        hotissue.init({
            rootCause: this.refs.rootCauseTA.value,
            solution: this.refs.solutionTA.value,
            execute: this.refs.executeTA.value,
            feedback: this.refs.feedbackTA.value,
        });
        return hotissue;
    },

    getInitialState() {
        return {
        }
    },
    
	render(){
        var {rootCause, solution, execute, feedback} = this.props.param;
        
		return (
            <div className='hotissue'>
                <div className='line name'>
                    <label>Root Cause</label>
                    <textarea defaultValue={rootCause} ref='rootCauseTA'></textarea>
                </div>
                
                <div className='line name'>
                    <label>Solution</label>
                    <textarea defaultValue={solution} ref='solutionTA'></textarea>
                </div>

                <div className='line name'>
                    <label>执行</label>
                    <textarea defaultValue={execute} ref='executeTA'></textarea>
                </div>

                <div className='line name'>
                    <label>反馈</label>
                    <textarea defaultValue={feedback} ref='feedbackTA'></textarea>
                </div>
                <div className='line name'>
                    <button>导出ppt</button>
                </div>
                
            </div>
        )
	}
});
module.exports = HotIssueTemplate;