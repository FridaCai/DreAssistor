import MessageBox from '../../widget/messagebox.js';

var ProjectPopup = React.createClass({
	getInitialState: function() {
        return {
            project: this.props.project,
        };
    },
    
    show: function(state) {
    	var newState = state || this.state;
        this.setState(newState, this.updateJqueryComponent);
        this.refs.msgbox.show();
    },

	getContent: function() {
        if(!this.state.project)
            return null;

        const {
          label, creatorId, sorp, ec, bprange
        } = this.state.project;

	    return (
	        <div className="panel-body projectPopup">
                <UploadExcelComponent/>
	        </div>



            /*
            readonly table.
            <div className='line name'>
                    <label>名称</label>
                    <input type="text" defaultValue={label} ref='labelInput'/>
                </div>
      
                <div className='line ec'>
                    <label>发动机排量</label>
                    <input type='text' defaultValue={ec}/>
                </div>

                <div className='line bprange'>
                    <label>背压target最小值</label><input type='text' defaultValue={bprange[0]}/>
                    <label>背压target最大值</label><input type='text' defaultValue={bprange[1]}/>
                </div>
            */
	    );   
    },

    updateJqueryComponent: function() {
    	return;
    },

    onOkClk:function() {
        return Promise.resolve();
    },
    render: function() {
        var content = this.getContent();
        var title = this.state.title;
        return (<MessageBox width={700} title={title} okHandler={this.onOkClk} ref='msgbox' children={content}/>);
    },
});

module.exports = ProjectPopup;


