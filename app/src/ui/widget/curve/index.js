import './index.less';
import {XlsIExport} from 'XlsIExport';
import {TableDOM} from 'Table';
import Chart from './chart.js';
import API from './api.js';
import Curve from 'data/curve.js';
import CurveUI from './uidata/curve.js';
import CurveTemplate from 'CurveTemplate';

var CurveComponent = React.createClass({
  getInitialState: function(){
    this.api = new API();
    this.api.init();

    (function(curve, api){
        if(curve.needTemplate)
    	   	return;

        api.setCurve(curve);
        if(curve.data){
          api.dm2ui();
        }
    })(this.props.curve, this.api);
    return {};
  },

  render: function(){
    try{
      var disableXlsIExport = false;
      var sheetOptions = [{
          id: 'curve',
          label: '曲线',
          writeMode:[0]
      }];
      var id = this.props.id;

      return (
            <div className='curveComponent'>
                <XlsIExport ref='xlsIExport' 
                    disabled={disableXlsIExport} 
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
      this.api.setCurveNeedTemplate(false);

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

      if(this.props.curve.needTemplate){
        var curve = new Curve();
        curve.init((function(key, template){
          var index = template[key] || 0;
          return template.curves[index]
        })(this.props.templateKey, CurveTemplate));

        this.api.setCurve(curve); 
        this.api.dm2ui();
        this.forceUpdate();
        return;
      }

      if(!this.props.curve.data){

        //todo here.
          API.loadCurve(this.props.curve.id).then((function(result){
            if(result.errCode == -1){
              this.api.getCurve().update(result.curve);
              this.api.dm2ui();
              this.forceUpdate();
            }
          }).bind(this), function(e){
            throw e;
          }).catch(function(e){
              console.error(e.stack);
          });
      }
  },

  componentWillUnmount: function(){
    this.api.signal_curve_toggle.unlisten(this.onCurveToggle);
  },
  onCurveToggle: function(e, param){
    this.refs.chart.onToggle();
  },
})

module.exports = CurveComponent;


