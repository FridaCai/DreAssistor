import MessageBox from '../../../widget/messagebox.js';
import XlsImExPort from '../../../widget/excel/xls_im_export.js';
import Popup from '../../../widget/excel/popup.js';

import Table from './table.js';
import API from '../api.js';
import Project from '../../data/project.js'; //todo: datamodel and controller put together? //todo: import 'moment'. rather than relative path. not good for refactor.

var ProjectPopup = React.createClass({
	getInitialState: function() {
        var uidata = (function(p){
            if(!p)
                return undefined;
            API.setProject(p);
            API.dm2ui();      
            return API.uidata;
        })(this.props.project);

        return {
            title: this.props.title,
            onOK: this.props.onOK,
            uidata: uidata,
        };
    },

    onXlsImport: function(param){
        API.signal_popup_show.dispatch(param);
    },
	getContent: function() {
        var disableXlsImExPort = this.props.project ? true: false;
	    return (
            <div className='addProjectDiv'>
                <XlsImExPort disabled={disableXlsImExPort} next={this.onXlsImport}/>
                <div className='t_popup' ref='t_popup'/>
                <Table ref='table' uidata={this.state.uidata}/>     
            </div>
	    );   
    },

    componentDidMount: function(){
        API.signal_popup_show.listen(this.onPopupShow);

        if(this.props.project)
            return;

        API.loadTemplate().then((function(result){
            var project = new Project(); 
            project.init(result);
            
            API.setProject(project); 
            API.dm2ui();

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
        var sheetOptions = [{
            id: 'property',
            label: '属性',
            writeMode: [0]
        },{
            id: 'tag',
            label: 'Master Timing',
            writeMode: [0]
        },{
            id: 'task',
            label: '豆豆',
            writeMode: [0,1]
        }];


        //todo: fail to find this.refs.t_popup after close addProjectPopup. very strange. try to unmount dom element after message box hide.
        ReactDOM.unmountComponentAtNode($('.t_popup')[0]);    
        ReactDOM.render(
            <Popup tryXls2ui={API.tryXls2ui.bind(API)} 
                title={'导入excel'} 
                workbook={workbook} 
                sheetOptions={sheetOptions} 
                onOK={(function(){
                    API.ui2dm();
                    API.dm2ui();
                    this.refs.table.update({uidata: API.uidata});
                }).bind(this)}/>, 
            $('.t_popup')[0]);  
    },
    onOK:function() {
        console.log('onOK');
        var project = API.getProject();
        this.state.onOK(project);
        return Promise.resolve();
    },

    render: function() {
        var content = this.getContent();
        var title = this.state.title;
        return (<MessageBox width={700} title={title} onOK={this.onOK} isShow={true} ref='msgbox' cName='projectPopupContainer' children={content}/>);
    },
});

module.exports = ProjectPopup;


