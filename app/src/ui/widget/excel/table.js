/*<Table labels={this.state.labels} series={this.state.series} caption={this.state.caption} onToggleCurve={this.onToggleCurve}/>*/
  /*onToggleCurve(index, isShow){*/

var Table = React.createClass({
    getInitialState: function() {
        return {
        	/*labels: this.props.labels,
        	series: this.props.series,
        	caption: this.props.caption,
        	onToggleCurve: this.props.onToggleCurve,*/
        }
    },

    onChange: function(index, isShow){
    	this.props.onToggleCurve(index, isShow);
    },

    render: function(){
    	var i=-1;

	    return (
			<div className='excelTable' >
				<table>
					<caption>{this.props.caption}</caption>
					<tbody>
						<tr>
							<th scope="col" role="columnheader"></th>
							<th scope="col" role="columnheader">rpm</th>
							{
								this.props.labels.map((function(label){
									return (
										<th scope="col" role="columnheader" key={label}>{label}</th>
									)
								}).bind(this))
							}
						</tr>



						{
							this.props.series.map((function(serie){
								var isChecked = serie.isShow;
								var label = serie.label;
								
								i++;
								var className=`markcolor color${i}`;
								
								return (
									<tr key={i}>
										<th scope="row" role="rowheader">
											<input type="checkbox" defaultChecked={isChecked} onChange={this.onChange.bind(this, i, !isChecked)}></input>  
											<span className={className}></span>
										</th>
										<th scope="row" role="rowheader">{label}</th>
										{
											serie.data.map(function(value, index){
												return (<td key={index}>{value}</td>)
											})
										}
										
									</tr>
								)		
							}).bind(this))
						}
						
					</tbody>
				</table>
			</div>
	    )
    }
});

module.exports = Table;


