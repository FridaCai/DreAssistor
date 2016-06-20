var MuleTemplate = React.createClass({
    getValue(){
        return {
            
        }
    },

    getInitialState() {
        return {
        }
    },
    onStatusChange: function(){

    },
	render(){
        //isDone, value, graph, attachments, 
        const { bom, size, bp, tl, heavy, maf, sil, doc //tl: transmission lose, maf: 流量传感器
         } = this.props;

         var project_bp_range = {max: 100, min:10};
         var project_heavy_range = {max: 100, min: 10};

		return (
            <div className='mule'>
                <div className='line2'>
                    <label>Mule Bom check</label>

                    <div className='buttonGroup'>
                        <input name='bom_status' type="radio" 
                            defaultChecked={bom.isDone} onChange={this.onStatusChange.bind(this, 'bom', true)}/>
                        <label>完成</label>
                        <input name='bom_status' type="radio" 
                            defaultChecked={!bom.isDone} onChange={this.onStatusChange.bind(this, 'bom', false)}/>
                        <label>未完成</label>
                    </div>

                    <button className='btn btn-default'>
                        附件上传
                    </button>
                </div>
                
                <div className='line2'>
                    <label>尺寸检查</label>

                    <div className='buttonGroup'>
                        <input name='size_status' type="radio" 
                            defaultChecked={size.isDone} onChange={this.onStatusChange.bind(this, 'size', true)}/>
                        <label>完成</label>
                        <input name='size_status' type="radio" 
                            defaultChecked={!size.isDone} onChange={this.onStatusChange.bind(this, 'size', false)}/>
                        <label>未完成</label>
                    </div>

                    <button className='btn btn-default'> 
                        附件上传
                    </button>
                </div>

                <div className='line2'>
                    <label>背压／压力降 目标:{project_bp_range.max}Kpa</label>

                    <div className='buttonGroup'>
                        <input name='bp_status' type="radio" 
                            defaultChecked={bp.isDone} onChange={this.onStatusChange.bind(this, 'bp', true)}/>
                        <label>完成</label>
                        <input name='bp_status' type="radio" 
                            defaultChecked={!bp.isDone} onChange={this.onStatusChange.bind(this, 'bp', false)}/>
                        <label>未完成</label>
                    </div>

                    <div style={{clear:'both'}}>
                        <label>实测</label>
                        <input name='number'/>Kpa 
                    </div>
                    

                    <button className='btn btn-default'> 
                        附件上传
                    </button>
                </div>

                <div className='line2'>
                    <label>传递损失</label>

                    <div className='buttonGroup'>
                        <input name='tl_status' type="radio" 
                            defaultChecked={tl.isDone} onChange={this.onStatusChange.bind(this, 'tl', true)}/>
                        <label>完成</label>
                        <input name='tl_status' type="radio" 
                            defaultChecked={!tl.isDone} onChange={this.onStatusChange.bind(this, 'tl', false)}/>
                        <label>未完成</label>
                    </div>

                    <label>实测(曲线图)</label>

                    <button className='btn btn-default'> 
                        附件上传
                    </button>
                </div>


                <div className='line2'>
                    <label>重量 目标:{project_heavy_range.max}Kg</label>

                    <div className='buttonGroup'>
                        <input name='heavy_status' type="radio" 
                            defaultChecked={heavy.isDone} onChange={this.onStatusChange.bind(this, 'heavy', true)}/>
                        <label>完成</label>
                        <input name='heavy_status' type="radio" 
                            defaultChecked={!heavy.isDone} onChange={this.onStatusChange.bind(this, 'heavy', false)}/>
                        <label>未完成</label>
                    </div>

                    <div style={{clear:'both'}}>
                        <label>实测</label>
                        <input name='number'/>kg
                    </div>

                    <button className='btn btn-default'> 
                        附件上传
                    </button>
                </div>





                <div className='line2'>
                    <label>MAF 5*5</label>

                    <div className='buttonGroup'>
                        <input name='maf_status' type="radio" 
                            defaultChecked={maf.isDone} onChange={this.onStatusChange.bind(this, 'maf', true)}/>
                        <label>完成</label>
                        <input name='maf_status' type="radio" 
                            defaultChecked={!maf.isDone} onChange={this.onStatusChange.bind(this, 'maf', false)}/>
                        <label>未完成</label>
                    </div>

                    <label>实测(曲线图)</label>

                    <button className='btn btn-default'> 
                        附件上传
                    </button>
                </div>
                




                <div className='line2'>
                    <label>SIL</label>

                    <div className='buttonGroup'>
                        <input name='sil_status' type="radio" 
                            defaultChecked={sil.isDone} onChange={this.onStatusChange.bind(this, 'sil', true)}/>
                        <label>完成</label>
                        <input name='sil_status' type="radio" 
                            defaultChecked={!sil.isDone} onChange={this.onStatusChange.bind(this, 'sil', false)}/>
                        <label>未完成</label>
                    </div>

                    <button className='btn btn-default'> 
                        附件上传
                    </button>
                </div>




                <div className='line2'>
                    <label>文档检查</label>

                    <div className='buttonGroup'>
                        <input name='doc_status' type="radio" 
                            defaultChecked={doc.isDone} onChange={this.onStatusChange.bind(this, 'doc', true)}/>
                        <label>完成</label>
                        <input name='doc_status' type="radio" 
                            defaultChecked={!doc.isDone} onChange={this.onStatusChange.bind(this, 'doc', false)}/>
                        <label>未完成</label>
                    </div>

                    <button className='btn btn-default'> 
                        附件上传
                    </button>
                </div>
            </div>
        )
	}
});
module.exports = MuleTemplate;