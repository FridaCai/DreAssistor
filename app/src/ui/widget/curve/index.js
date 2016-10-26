import './index.less';
import {XLSIExportUI} from 'XlsIExport';
import {TableDOM} from 'Table';
import Chart from './chart.js';
import API from './api.js';
import Curve from 'data/curve.js';
import CurveUI from './uidata/curve.js';
import CurveTemplate from 'CurveTemplate';
import Request from 'Request';
import GlobalUtil from 'Util';

var CurveComponent = React.createClass({
  getInitialState: function(){
    this.api = new API();
    this.api.init();

    /*(function(curve, api){
        if(curve.needTemplate)
    	   	return;

        api.setCurve(curve);
        if(curve.data){
          api.dm2ui();
        }
    })(this.props.curve, this.api);*/ //need propertyId
    return {};
  },

  render: function(){
    try{
      var sheetOptions = [{
          id: 'curve',
          label: '曲线',
          writeMode:[0]
      }];
      var id = this.props.id;

      return (
            <div className='curveComponent'>
                <XLSIExportUI ref='xlsIExport' 
                    isReadOnly={this.props.isReadOnly} 
                    sheetOptions={sheetOptions}
                    onXlsImport={this.onXlsImport}
                    xls2ui = {this.xls2ui}
                    ui2xls = {this.ui2xls}
                    scope = {this}
                />
                <TableDOM ref='table' 
                    uidata={this.api.uidata} 
                    onDrop={this.onTableDrop}
                    isReverse={true}/>
               <Chart curve={this.api.curve} ref='chart' id={id}/>
            </div>
      );  
    }catch(e){
      console.error(e.stack);
    }
       
  },
  xls2ui: function(param){
    return this.api.xls2ui(param);
  },
  ui2xls: function(){
    this.api.ui2xls();
  },

  onXlsImport: function(){
      this.api.ui2dm();
      this.api.dm2ui();
      this.api.curve.setIsDirty(true);

      this.refs.table.update({uidata: this.api.uidata});
      this.refs.chart.update();

      this.props.onImportCurve && this.props.onImportCurve.call(this.props.scope, this.api.curve);
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

  componentDidMount: function(){
      this.api.signal_curve_toggle.listen(this.onCurveToggle);
      
      var curveParam = (function(key, template){
        var index = template[key] || 0;
        return template.curves[index]
      })(this.props.templateKey, CurveTemplate);

      var propertyId = this.props.propertyId;
      if(GlobalUtil.isUUID(propertyId)){
        this.props.curve.update(curveParam);
        this.api.setCurve(this.props.curve); 
        this.api.dm2ui();
        this.forceUpdate();         
        return;
      }




      var url = Request.getBackendAPI(`curve/propertyId/${propertyId}`); //todo.
      Request.getData(url).then((function(result){
        if(result.errCode == -1){
          if(result.curve){
            curveParam = result.curve;
          }

          this.props.curve.update(curveParam);
          this.api.setCurve(this.props.curve); 
          this.api.dm2ui();
          this.forceUpdate();            
        }
      }).bind(this), function(e){
        throw e;
      }).catch(function(e){
          console.error(e.stack);
      });
  },

  componentWillUnmount: function(){
    this.api.signal_curve_toggle.unlisten(this.onCurveToggle);
  },
  onCurveToggle: function(e, param){
    this.api.ui2dm();
    this.refs.chart.forceUpdate();
    this.refs.chart.onToggle();
  },
})

module.exports = CurveComponent;


