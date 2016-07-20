import MessageBox from '../../../widget/messagebox.js';
import Table from './table.js';
import XlsImExPort from './xls_im_export.js';
import Popup from './popup.js';
import API from '../api.js';

var ProjectPopup = React.createClass({
	getInitialState: function() {
        //if no this.props.project, retun undefined. 
        //else return 
        //draw table by uidata.
        var uidata = API.getUIDataByProject(this.props.project);  

        return {
            title: this.props.title,
            onOK: this.props.onOK,
            uidata: uidata,
        };
    },

	getContent: function() {
        var getXlsImExPortDom = (function(p){
            if(p){
                return null;
            }
            return <XlsImExPort/>
        })(this.props.project)

	    return (
            <div className='addProjectDiv'>
                {getXlsImExPortDom}
                <div ref='popup'/>
                <Table ref='table' uidata={this.state.uidata}/>     
            </div>
	    );   
    },

    componentDidMount: function(){
        API.signal_popup_show.listen(this.onPopupShow);

        if(this.props.project)
            return;

        API.getUIDataByTemplate().then((function(uidata){
            this.refs.table.updateT({
                uidata: uidata
            })
        }).bind(this));
    },

    componentDidUnMount: function(){
        API.signal_popup_show.unlisten(this.onPopupShow);
    },

    onPopupShow: function(e, param){
        var workbook = param.workbook;
        ReactDOM.unmountComponentAtNode(this.refs.popup);    
        ReactDOM.render(<Popup title={'导入excel'} workbook={workbook} onOK={(function(property){
            //todo:
            API.property.ui2dm(API.project);
            API.property.dm2ui(API.project);

            this.refs.table.forceUpdate();

        }).bind(this)}/>, this.refs.popup);  
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


