import MessageBox from '../../../widget/messagebox.js';
import Table from './table.js';
import XlsImExPort from './xls_im_export.js';
import Popup from './popup.js';
import API from '../api.js';

var ProjectPopup = React.createClass({
	getInitialState: function() {
        var uidata = (function(p){
            if(!p)
                return undefined;
            API.dm2ui(p);      
            return API.uidata;
        }).call(this.props.project);

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
                <div className='t_popup' ref='t_popup'/>
                <Table ref='table' uidata={this.state.uidata}/>     
            </div>
	    );   
    },

    componentDidMount: function(){
        API.signal_popup_show.listen(this.onPopupShow);

        if(this.props.project)
            return;

        API.loadTemplate().then((function(){
            var uidata = API.uidata;
            this.refs.table.update({
                uidata: uidata
            })
        }).bind(this));
    },

    componentDidUnMount: function(){
        API.signal_popup_show.unlisten(this.onPopupShow);
    },

    onPopupShow: function(e, param){
        var workbook = param.workbook;


        //todo: fail to find this.refs.t_popup after close addProjectPopup. very strange. try to unmount dom element after message box hide.
        ReactDOM.unmountComponentAtNode($('.t_popup')[0]);    
        ReactDOM.render(<Popup title={'导入excel'} workbook={workbook} onOK={(function(){
            //todo:
            API.ui2dm();
            API.dm2ui();
            this.refs.table.update({uidata: API.uidata});

        }).bind(this)}/>, $('.t_popup')[0]);  
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


