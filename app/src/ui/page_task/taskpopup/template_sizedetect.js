var SizeDetectTemplate = React.createClass({
    getValue(){
        return {
            excelUrl:  ''
        }
    },
    fileElemChange(){
        
    },
	render(){
		return (
            <div className='sizedetect'>
                <div className='line'>
                    <button>导入excel</button>
                </div>
                <img src='/app/res/curve.png'/>

                <form className='upload'>
                  <input type="file" ref="fileElem" accept="*/xls" onChange={this.fileElemChange}/>
                </form>
            </div>
        )
	},
});
module.exports = SizeDetectTemplate;