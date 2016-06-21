var EWOTemplate = React.createClass({
    getValue(){
        return {
            excelUrl:  ''
        }
    },
    fileElemChange(){
        
    },
	render(){
        return (
            <div>EWO</div>
        )



		return (
            <div className='ewo'>
                <div className='line'>
                    EWO template
                </div>
                <img src='/app/res/curve.png'/>

                <form className='upload'>
                  <input type="file" ref="fileElem" accept="*/xls" onChange={this.fileElemChange}/>
                </form>
            </div>
        )
	}
});
module.exports = EWOTemplate;