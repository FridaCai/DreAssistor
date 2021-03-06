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
    return {};
  },

  render: function(){
    try{
      var sheetOptions = [{
          id: 'curve',
          label: '曲线',
          writeMode:[0]
      }];
      var {id, isReadOnly} = this.props;
      return (
            <div className='curveComponent'>
                <XLSIExportUI ref='xlsIExport' 
                    isReadOnly={isReadOnly} 
                    sheetOptions={sheetOptions}
                    onXlsImport={this.onXlsImport}
                    xls2ui = {this.xls2ui}
                    ui2xls = {this.ui2xls}
                    scope = {this}
                />
                <TableDOM ref='table' 
                    uidata={this.api.uidata} 
                    onDrop={this.onTableDrop}
                    isReverse={true}
                    isReadOnly={isReadOnly}/>
               <Chart curve={this.api.curve} isReadOnly={isReadOnly} ref='chart' id={id}/>
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

      var {curve, propertyId, templateKey} = this.props;


      var getCurve = (function(){
        if(curve && curve.getIsDirty()){
          return Promise.resolve(curve);
        }

        var curveTemplate = (function(key, template){
          var index = template[key] || 0;
          return template.curves[index]
        })(templateKey, CurveTemplate);

        if(GlobalUtil.isUUID(propertyId)){
          return Promise.resolve(curveTemplate);
        }


        var url = Request.getBackendAPI(`curve/propertyId/${propertyId}`); 
        return new Promise(function(resolve, reject){
          Request.getData(url).then((function(result){
            if(result.errCode == -1 ){
              if(result.curve){
                return resolve(result.curve);
              }else{
                return resolve(curveTemplate);
              }
            }else{
              throw e;
            }
          }).bind(this), function(e){
            throw e;
          }).catch(function(e){
              reject(e);
          });
        });
      }).bind(this);



      getCurve().then((function(result){
          this.api.setCurve(Curve.create(result)); 
          this.api.dm2ui();
          this.forceUpdate();         
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


