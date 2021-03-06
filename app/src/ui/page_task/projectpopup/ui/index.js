import MessageBox from 'MessageBox';
import {XLSIExportUI} from 'XlsIExport';
import {TableDOM} from 'Table';

import API from '../api.js';
import Request from 'Request';

import ProjectTemplate from 'ProjectTemplate';

import Property from '../uidata/property.js';
import Tag from '../uidata/tag.js';

import Project from 'data/project.js';

var ProjectPopup = React.createClass({
	getInitialState: function() {
        return {
            title: this.props.title,
            onOK: this.props.onOK,
            isReadOnly: this.props.isReadOnly
        };
    },

	getContent: function() {
        var xlsComponentReadOnly = this.props.project ? true: false;
        if(this.state.isReadOnly){
            xlsComponentReadOnly = true
        }
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
        var needUpdate = true;
	    return (
            <div className='addProjectDiv'>
                <XLSIExportUI ref='xlsIExport' 
                    sheetOptions={sheetOptions}
                    onXlsImport={this.onXlsImport}
                    xls2ui = {API.xls2ui}
                    ui2xls = {API.ui2xls}
                    isReadOnly =  {xlsComponentReadOnly}
                />

                <TableDOM ref='table' 
                    uidata={API.uidata} 
                    onDrop={this.onTableDrop}
                    needUpdate={needUpdate}
                    onSwitchSheet={this.onSwitchSheet}
                    isReadOnly={this.props.isReadOnly}
                />
            </div>
	    );   
    },
    onSwitchSheet(){
        API.ui2dm();
        API.dm2ui();
        this.refs.table.update({uidata: API.uidata});
    },

    onXlsImport: function(){
        API.ui2dm();
        API.dm2ui();
        this.refs.table.update({uidata: API.uidata});
    },
    onTableDrop: function(transferData){
        var files = transferData.files;
        var reader = new FileReader();

        var file = files[0];
        var fileName = file.name;
        reader.onload = (function(e){
            var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            this.refs.xlsIExport.onPopupShow(workbook);
        }).bind(this);
        reader.readAsBinaryString(file);
    },
    
    onEngineAdd: function(){
        API.ui2dm();
        API.addEngine();
        API.dm2ui();
        this.refs.table.setState({uidata: API.uidata}); 
    },
    onEngineDelete: function(e, param){
        var engine = param.engine;
        var project = API.getProject();
        project.deleteEngine(engine);

        API.dm2ui();
        this.refs.table.setState({uidata: API.uidata});   
    },
    onEngineCopy: function(e, param){
        var engine = param.engine;
        var project = API.getProject();
        project.copyEngine(engine);
        API.dm2ui();
        this.refs.table.setState({uidata: API.uidata});     
    },
    componentDidMount: function(){
        Property.signal_add_engine.listen(this.onEngineAdd);
        Property.signal_delete_engine.listen(this.onEngineDelete);
        Property.signal_copy_engine.listen(this.onEngineCopy);
        Property.signal_expand_toggle.listen(this.onExpandToggle);

        if(this.props.project){
            var id = this.props.project.id;
            Request.getData(Request.getBackendAPI(`project/${id}`)).then((function(result){
                if(result.errCode == -1){
                    var projectObj = result.project;
                    var project = Project.create(projectObj);
                    API.setProject(project);    
                    API.dm2ui();
                    
                    var uidata = API.uidata;
                    this.refs.table.update({
                        uidata: uidata
                    })
                }
            }).bind(this), function(e){
                throw e;
            }).catch(function(e){
                console.error(e);
            });
        }else{
            var project = Project.create(ProjectTemplate); 
            API.setProject(project); 
            API.dm2ui();

            var uidata = API.uidata;
            this.refs.table.update({
                uidata: uidata
            })
            
        }
    },

    componentWillUnmount: function(){
        Property.signal_add_engine.unlisten(this.onEngineAdd);
        Property.signal_delete_engine.unlisten(this.onEngineDelete);
        Property.signal_copy_engine.unlisten(this.onEngineCopy);
        Property.signal_expand_toggle.unlisten(this.onExpandToggle);
        
    },

    onExpandToggle: function(){
        this.refs.table.forceUpdate();
    },
    
    onOK:function() {
        API.ui2dm();
        API.dm2ui();
        var project = API.getProject();
        this.state.onOK(project);
        return Promise.resolve();
    },

    render: function() {
        var content = this.getContent();
        var title = this.state.title;
        return (<MessageBox isReadOnly={this.props.isReadOnly} width={700} title={title} onOK={this.onOK} isShow={true} ref='msgbox' cName='projectPopupContainer' children={content}/>);
    },
});

module.exports = ProjectPopup;


