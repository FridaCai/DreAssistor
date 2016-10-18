import MessageBox from 'MessageBox';
import CDropDown from 'CDropDown';
import RadioGroup from 'RadioGroup';
import Util from 'Util';

import './style.less';

var ControllerGroup = React.createClass({
    getInitialState: function(){
        this.radioGroupOptions = {
            id: `datamode_radiogroup_${Util.generateUUID()}`,
            selectedId: 0,
            options: [{
                id: 0,
                label:"替换"
            },{
                id: 1,
                label: "添加"
            }],
            onChange: (function(selectedId){
                this.setState({radioSelected: selectedId})
            }).bind(this),
        }

        var ops = this.props.sheetOptions.concat([{
            id: 'no',
            label: '无',
            writeMode: [0]
        }]);
        return {
            dropdownSelected:undefined,
            radioSelected: 0,
            sheetOptions: ops,
        };
    },
    componentDidMount: function(){
        var id = 'dropDown';
        var container = this.refs.dropDown;
        var options = this.state.sheetOptions;
        var prompt = '请选择数据类型';
        var param = {
            id: id, //string.
            defaultKey: null, 
            prompt: prompt,
            options: options,
            onchange: (function(key){
                this.setState({dropdownSelected: key});
            }).bind(this),
        };

        CDropDown.create(container, param);
    },

    getValue:function(){
        return this.state;
    },

    radioGroupChange:function(optionId){
        this.setState({
            radioSelected: optionId
        })
    },

    render:function(){
        var showRadioGroup = (function(sheetOptions, selectedKey){
            if(!selectedKey)
                return false;
            var option = sheetOptions.find(function(option){
                return (option.id === selectedKey)
            })
            return (option.writeMode.length != 1)
        })(this.state.sheetOptions, this.state.dropdownSelected)

        var dom = showRadioGroup ? (
            <RadioGroup style={{float:'left', marginLeft:20}} 
                param={this.radioGroupOptions} 
                ref='radioGroup' />
        ): null;

        return (
            <div className='controllerGroup' style={{float:'left'}}>
                <span ref='dropDown' className='dropdown'/>
                {dom}
            </div>      
        )
    }
})

var Popup = React.createClass({
    getInitialState: function() {
        return {
            title: this.props.title,
            workbook: this.props.workbook,
            sheetOptions: this.props.sheetOptions,
        };
    },

    getContent: function() {
        return (
            <div className='importExcelPopup'>
                <div className='line' style={{margin: '20px 0 10px 0'}}>请选择需要导入的sheet及数据类型</div>
                {
                    this.state.workbook.SheetNames.map((function(sheetName, index){
                        var controllerGroupRef = `controllerGroup_${index}`;
                        var decodeSheetName = unescape(sheetName.replace(/&#x/g, '%u').replace(/;/g, '')); //fix Chinese unicode
                        return (
                            <div className='line' key={index}>
                                <label>{decodeSheetName}</label>
                                <ControllerGroup ref={controllerGroupRef} sheetOptions={this.state.sheetOptions}/>
                            </div>
                        )
                    }).bind(this))
                }
            </div>
        )
    },


    onOK:function() {
        var result = (function(options){
            var r = {};
            options.map(function(option){
                r[option.id] = r[option.id] || [];
            })
            return r;
        }).call(this, this.state.sheetOptions)



        var sheets = this.state.workbook.Sheets;
        var sheetNames = this.state.workbook.SheetNames;        
        for(var i=0; i<sheetNames.length; i++){
            var {dropdownSelected, radioSelected} = this.refs[`controllerGroup_${i}`].getValue();
            if(dropdownSelected && dropdownSelected!='no'){
                var sn = sheetNames[i];
                var s = sheets[sn];
                result[dropdownSelected].push({sheetName: sn, sheet: s, mode: radioSelected})
            }
        }



        var checkResult = this.props.xls2ui.call(this.props.scope, result);
        if(checkResult.errorCode === -1){
            this.props.onOK.call(this.props.scope);
            return Promise.resolve();   
        }
    },

    render: function() {
        var content = this.getContent();
        var title = this.state.title;
        return (<MessageBox notRecoverBodyScroll={true} width={700} title={title} onOK={this.onOK} isShow={true} ref='msgbox' cName='importExcelPopup' children={content}/>);
    },
})

var XLSIExportUI = React.createClass({
    onXlsUpload: function(e){
      var files = e.target.files;
      var i,f;
      for (i = 0, f = files[i]; i != files.length; ++i) {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = (function(e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            this.onPopupShow(workbook);
        }).bind(this);
        reader.readAsBinaryString(f);
      }
    },

    onPopupShow: function(workbook){
        var sheetOptions = this.props.sheetOptions;

        //todo: fail to find this.refs.t_popup after close addProjectPopup. very strange. try to unmount dom element after message box hide.
        ReactDOM.unmountComponentAtNode($('.t_popup')[0]);    
        ReactDOM.render(
            <Popup xls2ui={this.props.xls2ui} 
                title={'导入excel'} 
                workbook={workbook} 
                sheetOptions={sheetOptions} 
                onOK={this.props.onXlsImport}
                scope = {this.props.scope}/>, 
            $('.t_popup')[0]);  
    },

    import: function(){
        this.refs.xlsFileUploadInput.click();
    },

	export: function(){
        this.props.ui2xls.call(this.props.scope);
	},

	_acceptedformat: ['.csv', 
		'application/vnd.ms-excel', 
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	].join(','),

    onFileInputClk: function(){
        this.refs.xlsFileUploadInput.value = null;  
    },
    
	render: function(){
        var isDisabled = this.props.disabled;
		return (
            <div className='xlsIExport'>
                <button disabled={isDisabled} className="btn btn-primary importBtn" onClick={this.import}>导入excel</button> 
                <button className="btn btn-primary exportBtn" onClick={this.export}>导出excel</button>
                <input type="file" ref='xlsFileUploadInput'  accept={this._acceptedformat} style={{display: 'none'}} 
                	onChange={this.onXlsUpload} onClick={this.onFileInputClk}/>
                <div className='t_popup' ref='t_popup'/> 
            </div>
        )
	}
})
module.exports = XLSIExportUI;
