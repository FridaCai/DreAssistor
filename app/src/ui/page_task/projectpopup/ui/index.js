import MessageBox from 'MessageBox';
import {XlsIExport} from 'XlsIExport';
import {TableDOM} from 'Table';
import API from '../api.js';
import Project from '../../data/project.js'; //todo: datamodel and controller put together? //todo: import 'moment'. rather than relative path. not good for refactor.
import Property from '../data/property.js';
import Tag from '../data/tag.js';

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
                    needUpdate = {needUpdate}/>
            </div>
	    );   
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
    onDataChange: function(){
        //when ui2dm and dm2ui, data is refreshed, if not redraw table, datachange will not be listened to the correct component.
        API.ui2dm();
        API.dm2ui();
        this.refs.table.setState({uidata: API.uidata}); 
    },
    componentDidMount: function(){
        Property.signal_sorp_blur.listen(this.onDataChange);
        Tag.signal_adjusttime_blur.listen(this.onDataChange);

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
        Property.signal_sorp_blur.unlisten(this.onDataChange);
        Tag.signal_adjusttime_blur.unlisten(this.onDataChange);
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


