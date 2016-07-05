import './index.less';
import Table from './table.js';

var UploadExcelComponent = React.createClass({
    getInitialState: function() {
        return {
          labels: [],
          series: [],
          caption: '',
        }
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
/*
,
        plugins: [
          Chartist.plugins.ctAccessibility({
            caption: caption,
            seriesHeader: 'rpm',
            summary: '',
            valueTransform: function(value) {
              return value;
            },
            // ONLY USE THIS IF YOU WANT TO MAKE YOUR ACCESSIBILITY TABLE ALSO VISIBLE!
            visuallyHiddenStyles: 'position: absolute; top: 100%; width: 100%; font-size: 11px; overflow-x: auto; background-color: rgba(0, 0, 0, 0.1); padding: 10px'
          })
        ]
*/
    
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
            }, this.updateChart);
        }).bind(this);


        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files;
        var i,f;
        for (i = 0, f = files[i]; i != files.length; ++i) {
            var reader = new FileReader();
            var name = f.name;
            reader.onload = function(e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, {type: 'binary'});
                processWorkbook(workbook, name);
            };
            reader.readAsBinaryString(f);
        }
    },

  onDragOver(e){
    e.preventDefault();
  },

  onToggleCurve(index, isShow){
    debugger;
    this.state.series[index].isShow = isShow;
    /*this.forceUpdate(this.updateChart);*/

    $($('.ct-series')[index]).toggle();  
    
  },
  
  render: function() {
      return (
        <div className='uploadExcel'>
          <div className='fileArea' onDragOver={this.onDragOver} onDrop={this.onDrop}>请将文件拖至此处上传</div>
          <div className="ct-chart ct-perfect-fourth" ></div>
          <Table labels={this.state.labels} series={this.state.series} caption={this.state.caption} onToggleCurve={this.onToggleCurve}/>
        </div>
      );
  }
});

module.exports = UploadExcelComponent;
