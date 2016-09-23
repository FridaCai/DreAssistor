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
}