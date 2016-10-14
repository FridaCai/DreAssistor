module.exports = class CurveData{
	static convertDM2CurveData(dm){
		var labels = dm.sheets[0].x.map(function(cell){
			return cell.label;
		})

		var series = dm.sheets[0].y1.map(function(cell){
			return cell.label;
		})

		return {
			labels: labels,
			series: series,
		}
	}

	static convertCurveDM2CurveData(dms){
		//get the union labels in all dms. and sort.
		var labelUnion = [];
		dms.map(function(dm){
			var series = dm.series;
			var index = series[0].data;
			
			dm.data[index].map(function(label){
				if(labelUnion.indexOf(label) === -1){
					labelUnion.push(label);
				}
			})
		})
		labelUnion.sort(function(a,b){
			return a-b;
		});






		
		//go though each dm, find missing label
		//go through compensation arr and filling the series data with 0;
		
		var drawLabels = labelUnion;
		var drawSeries = [];

		dms.map(function(dm, i){
			var index = dm.series[0].data;
			var labels = dm.data[index];

			var xCurveMap = {};
			labelUnion.map(function(lu,j){
				var series = [];

				var labelPos = labels.indexOf(lu);
				if(labelPos === -1){
					for(var k=1; k<dm.series.length; k++){
						series.push(undefined);
						//var serieIndex = dm.series[k].data;
						//dm.series[serieIndex].push(0);
					}
				}else{
					for(var k=1; k<dm.series.length; k++){
						var serieIndex = dm.series[k].data;
						series.push(dm.data[serieIndex][labelPos]);
					}
				}
				xCurveMap[lu] = series;
			})



			var seriesNum = xCurveMap[labelUnion[0]].length;

			for(var i=0; i<seriesNum; i++){
				var oneSerie = labelUnion.map(function(label){
					return xCurveMap[label][i]
				})
				drawSeries.push(oneSerie);
			}
		})







		



		//combine all series.


		return {
			labels:drawLabels,
			series: drawSeries
		}
	}
}