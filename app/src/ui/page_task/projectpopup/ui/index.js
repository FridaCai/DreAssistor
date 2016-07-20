import MessageBox from '../../../widget/messagebox.js';
//import Table from './table.js';
import ExcelImExPort from './excel_im_export.js';
import Popup from './popup.js';
import API from '../api.js';

var ProjectPopup = React.createClass({
	getInitialState: function() {
        return {
            title: this.props.title,
            onOK: this.props.onOK,
        };
    },

	getContent: function() {
        var getExcelImExPortDom = (function(p){
            if(p){
                return null;
            }
            return <ExcelImExPort/>
        })(this.props.project)

	    return (
            <div className='addProjectDiv'>
                {getExcelImExPortDom}
                <div ref='popup'/>
            </div>
	    );   

        //<Table project={this.props.project} ref='datatable'/>    
    },
    componentDidMount: function(){
        API.signal_popup_show.listen(this.onPopupShow);
    },
    componentDidUnMount: function(){
        API.signal_popup_show.unlisten(this.onPopupShow);
    },
    onPopupShow: function(e, param){
        var workbook = param.workbook;
        ReactDOM.unmountComponentAtNode(this.refs.popup);    
        ReactDOM.render(<Popup title={'导入excel'} workbook={workbook} onOK={function(){
            debugger;
        }}/>, this.refs.popup);  
    },
    onOK:function() {
        /*var project = this.refs.datatable.getData();
        this.state.onOK(project);
        return Promise.resolve();*/
    },

    render: function() {
        var content = this.getContent();
        var title = this.state.title;
        return (<MessageBox width={700} title={title} onOK={this.onOK} isShow={true} ref='msgbox' cName='projectPopupContainer' children={content}/>);
    },
});

module.exports = ProjectPopup;


