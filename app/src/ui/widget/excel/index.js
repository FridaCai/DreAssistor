import './index.less';
import Table from './table.js';

var UploadExcelComponent = React.createClass({
    getInitialState: function() {
        return {
          excelFilePath: this.props.excelFilePath,
          labels: [],
          series: [],
          caption: '',
        }
    },

    getExcelFilePath: function(){
      return this.state.excelFilePath;
    },

    _chart:undefined,
    updateChart: function(){
      var labels = this.state.labels;
      var _series = this.state.series;
      var caption = this.state.caption;

      var series = [];
      for(var i=0; i<_series.length; i++){
        var serie = _series[i];
        series.push(serie.data);
      }

      if(this._chart){
        this._chart.detach();
        this._chart.svg.remove();
      }

      this._chart = new Chartist.Line('.ct-chart', {
        labels: labels,
        series: series,
      }, {
        fullWidth: true,
        lineSmooth: false,
        chartPadding: {
          right: 20,
          left: 10
        },
        axisX: {
          labelInterpolationFnc: function(value) {
            if(value % 500 === 0){
              return value;  
            }
          }
        }
      });
    },
    
    onDrop: function(e){
        var processWorkbook = (function(workbook, xlsFileName){
            var SHEET_NAME = 'SNORKEL';
            var COLORS = ['#46aac4','#f69240', '#4a7ebb', '#a7c36f', '#be4b48', '#7d60a0', '#ff0000', '#00ff00', '#0000ff', '#04fced'];
            var worksheet = workbook.Sheets[SHEET_NAME];

            var range =  (function(raw){
              var reg = /^([A-Z]*)(\d*)\:([A-Z]*)(\d*)$/;
              var result = raw.match(reg);

              return {
                lineMin: parseInt(result[2]),
                lineMax: parseInt(result[4]),
                columnMin: result[1],
                columnMax: result[3],
              }
            })(worksheet['!ref']);

            var getColumn = function(min, max, columnName){
              var returnLabel = [];
              for(var i=min; i<=max; i++){
                var key = `${columnName}${i}`;

                var value = worksheet[key];

                if(value && value.t == 'n'){
                  var tmp = Math.round(value.v * 100) / 100;
                  returnLabel.push(tmp);
                }
              }
              return returnLabel;
            }
            

            var labels = getColumn(range.lineMin, range.lineMax, 'A'); // a9-a259
            var series = [{
              label: worksheet['B3'].v,
              isShow: true,
              data: getColumn(range.lineMin, range.lineMax, 'B')
            }, {
              label: worksheet['C3'].v,
              isShow: true,
              data: getColumn(range.lineMin, range.lineMax, 'C')
            }, {
              label: worksheet['D3'].v,
              isShow: true,
              data: getColumn(range.lineMin, range.lineMax, 'D')
            }, {
              label: worksheet['E3'].v,
              isShow: true,
              data: getColumn(range.lineMin, range.lineMax, 'E')
            }];

            this.setState({
              labels: labels,
              series: series,
              caption: xlsFileName,
              excelFilePath: url,
            }, this.updateChart);
        }).bind(this);


        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files;



        //todo: upload to server. load file from server and extract chart and table value;
        var filename = files[0].name;
        var url = `/app/res/${filename}`;
        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
        oReq.responseType = "arraybuffer";
        oReq.onload = (function(e) {
          var arraybuffer = oReq.response;
          var data = new Uint8Array(arraybuffer);
          var arr = new Array();
          for(var i = 0; i != data.length; ++i) 
            arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          
          this.setState({
            excelFilePath: url,
          });
          var workbook = XLSX.read(bstr, {type:"binary"});
          processWorkbook(workbook, filename);
        }).bind(this);
        oReq.send();
    },

  onDragOver(e){
    e.preventDefault();
  },

  onToggleCurve(index, isShow){
    this.state.series[index].isShow = isShow;
    $($('.ct-series')[index]).toggle();  
  },
  
  render: function() {
      var getTableChartDom = (function(){

        if(this.state.excelFilePath){
          return (
            <div className='chartTable'>
              <div className="ct-chart ct-perfect-fourth" ></div>
              <Table labels={this.state.labels} series={this.state.series} caption={this.state.caption} onToggleCurve={this.onToggleCurve}/>
            </div>
            
          )
        }else return null;
      }).call(this);

      return (
        <div className='uploadExcel'>
          <div className='fileArea' onDragOver={this.onDragOver} onDrop={this.onDrop}>请将文件拖至此处上传</div>
          {getTableChartDom}
        </div>
      );
  }
});

module.exports = UploadExcelComponent;
