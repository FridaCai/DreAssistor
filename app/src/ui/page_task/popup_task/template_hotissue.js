var HotIssueTemplate = React.createClass({
	render(){
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
	}
});
module.exports = HotIssueTemplate;