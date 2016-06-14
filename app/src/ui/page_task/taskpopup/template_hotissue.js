var HotIssueTemplate = React.createClass({
    getValue(){
        return {
            rootCause: this.refs.rootCauseTA.value,
            solution: this.refs.solutionTA.value,
            execute: this.refs.executeTA.value,
            feedback: this.refs.feedbackTA.value,
        }
    },

    getInitialState() {
        return {
        }
    },
    
	render(){
        var rootCause = this.props.rootCause;
        var solution = this.props.solution;
        var execute = this.props.execute;
        var feedback = this.props.feedback;

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