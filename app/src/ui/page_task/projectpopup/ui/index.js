import MessageBox from 'MessageBox';
import {XlsIExport} from 'XlsIExport';
import {TableDOM} from 'Table';
import API from '../api.js';
import Project from '../../data/project.js'; //todo: datamodel and controller put together? //todo: import 'moment'. rather than relative path. not good for refactor.
import Property from '../data/property.js';
import Tag from '../data/tag.js';

import MultipleParamUIData from '../../taskpopup/uidata/multipleparam.js';

var ProjectPopup = React.createClass({
	getInitialState: function() {
        (function(p){
            if(!p)
                return;
            API.setProject(p);
            API.dm2ui();      
        })(this.props.project);

        return {
            title: this.props.title,
            onOK: this.props.onOK,
        };
    },

	getContent: function() {
        var disableXlsIExport = this.props.project ? true: false;
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
                <XlsIExport ref='xlsIExport' 
                    disabled={disableXlsIExport} 
                    sheetOptions={sheetOptions}
                    onXlsImport={this.onXlsImport}
                    xls2ui = {API.xls2ui}
                    ui2xls = {API.ui2xls}
                />

                

                <TableDOM ref='table' 
                    uidata={API.uidata} 
                    onDrop={this.onTableDrop}
                    needUpdate = {needUpdate}
                    onSwitchSheet = {this.onSwitchSheet}/>
            </div>
	    );   
    },
    onSwitchSheet(){
        API.ui2dm();
        API.dm2ui();
    },

    onXlsImport: function(){
        API.ui2dm();
        API.dm2ui();
        this.refs.table.update({uidata: API.uidata});
    },
    onTableDrop: function(files){
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
    
    onInputChange: function(){
        //when ui2dm and dm2ui, data is refreshed, if not redraw table, datachange will not be listened to the correct component.
        API.ui2dm();
        API.dm2ui();
        this.refs.table.setState({uidata: API.uidata}); 
    },
    onEngineAdd: function(){
        var project = API.getProject();
        project.addEngine();
        
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
        MultipleParamUIData.signal_data_change.listen(this.onInputChange);
        Property.signal_add_engine.listen(this.onEngineAdd);
        Property.signal_delete_engine.listen(this.onEngineDelete);
        Property.signal_copy_engine.listen(this.onEngineCopy);




        Tag.signal_adjusttime_blur.listen(this.onInputChange);


        MultipleParamUIData.signal_expand_toggle.listen(this.onExpandToggle);

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
        }).bind(this)).catch((function(e){
            console.error(e.stack);
        }).bind(this));
    },

    componentWillUnmount: function(){
       



        MultipleParamUIData.signal_data_change.unlisten(this.onInputChange);
        Property.signal_add_engine.unlisten(this.onEngineAdd);
        Property.signal_delete_engine.unlisten(this.onEngineDelete);
        Property.signal_copy_engine.unlisten(this.onEngineCopy);
        Tag.signal_adjusttime_blur.unlisten(this.onInputChange);
        MultipleParamUIData.signal_expand_toggle.unlisten(this.onExpandToggle);

    },
    onExpandToggle: function(){
        this.refs.table.forceUpdate();
    },
    onOK:function() {
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


