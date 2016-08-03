import RadioGroup from '../../widget/radiogroup/index.js';
import AttachmentList from './attachment_list.js';
import UploadExcelComponent from '../../widget/excel/index.js';

var MuleTemplate = React.createClass({
    getInitialState() {
        return {
        }
    },

    getValue(){
        return {
            bom: {
                isDone: (this.refs.bomRadioGroup.getValue() == 0 ? true: false),
                attachments: this.refs.bomAttachmentList.getValue()
            },
            size: {
                isDone: (this.refs.sizeRadioGroup.getValue() == 0 ? true: false),
                attachments: this.refs.sizeAttachmentList.getValue()
            },
            bp: {
                isDone: (this.refs.bpRadioGroup.getValue() == 0 ? true: false),
                attachments: this.refs.bpAttachmentList.getValue(),
                value: this.refs.bpInput.value,
            },
            tl: {
                isDone: (this.refs.tlRadioGroup.getValue() == 0 ? true: false),
                attachments: this.refs.tlAttachmentList.getValue(),
            },
            heavy: {
                isDone: (this.refs.heavyRadioGroup.getValue() == 0 ? true: false),
                attachments: this.refs.heavyAttachmentList.getValue(),  
                value: this.refs.heavyInput.value,
            },
            maf: {
                isDone: (this.refs.mafRadioGroup.getValue() == 0 ? true: false),
                attachments: this.refs.mafAttachmentList.getValue(),  
            },
            sil: {
                isDone: (this.refs.silRadioGroup.getValue() == 0 ? true: false),
                attachments: this.refs.silAttachmentList.getValue(),  
            },
            doc: {
                isDone: (this.refs.docRadioGroup.getValue() == 0 ? true: false),
                attachments: this.refs.docAttachmentList.getValue(),  
            },
            snorkelNoiseXls: this.refs.snorkelNoiseExcelComponent.getFileNames(),
        }
    },

	render(){
        //isDone, value, graph, attachments, 
        const { bom, size, bp, tl, heavy, maf, sil, doc, snorkelNoiseXls//tl: transmission lose, maf: 流量传感器
         } = this.props;

        var project_bp_range = {max: 100, min:10};
        var project_heavy_range = {max: 100, min: 10};


        var getRadioParam = function(targetStr, target){

            return {
                id: targetStr,
                selectedId: target ? (target.isDone ? 0:1) : 1,
                options: [{
                    id: 0,
                    label:"完成"
                },{
                    id: 1,
                    label: "未完成"
                }],
                onChange:function(selectedId){ //todo: problem in create template case.
                    //eval(target).isDone = (selectedId === 0 ? true: false);
                }
            }
        }

        var bomRadioGroup = getRadioParam('bom', bom);
        var bomAttachments = bom ? bom.attachments : [];
        var sizeRadioGroup = getRadioParam('size', size);
        var sizeAttachments = size ? size.attachments : [];
        var bpRadioGroup = getRadioParam('bp', bp);
        var bpAttachments = bp ? bp.attachments : [];
        var bpValue = bp ? bp.value : '';
        var tlRadioGroup = getRadioParam('tl', tl);
        var tlAttachments = tl ? tl.attachments : [];
        var tlGraphicSrc = tl ? tl.graphicSrc : '';
        var heavyRadioGroup = getRadioParam('heavy', heavy);
        var heavyAttachments = heavy ? heavy.attachments: [];
        var heavyValue = heavy ? heavy.value: '';
        var mafRadioGroup = getRadioParam('maf', maf)
        var mafAttachments = maf ? maf.attachments : [];
        var mafGraphicSrc = maf ? maf.graphicSrc : '';
        var silRadioGroup = getRadioParam('sil', sil);
        var silAttachments = sil ? sil.attachments : [];
        var docRadioGroup = getRadioParam('doc', doc);
        var docAttachments = doc ? doc.attachments : [];


		return (
            <div className='mule'>
                <div className='line2'>
                    <label>Snorkel Noise</label>
                    <UploadExcelComponent ref='snorkelNoiseExcelComponent' fileNames={snorkelNoiseXls}/>
                </div>


                <div className='line2'>
                    <label>Mule Bom check</label>
                    <RadioGroup param={bomRadioGroup} ref='bomRadioGroup'/>
                    <AttachmentList attachments={bomAttachments} ref='bomAttachmentList'/>
                </div>
                
                <div className='line2'>
                    <label>尺寸检查</label>
                    <RadioGroup param={sizeRadioGroup} ref='sizeRadioGroup' />
                    <AttachmentList attachments={sizeAttachments} ref='sizeAttachmentList'/>
                </div>


                <div className='line2'>
                    <label>背压 目标:{project_bp_range.max}Kpa</label>
                    <RadioGroup param={bpRadioGroup} ref='bpRadioGroup'/>
                    <div style={{clear:'both'}}>
                        <label>实测</label>
                        <input defaultValue={bpValue} ref='bpInput'/>Kpa 
                    </div>
                    <AttachmentList attachments={bpAttachments} ref='bpAttachmentList'/>
                </div>

                <div className='line2'>
                    <label>传递损失</label>
                    <RadioGroup param={tlRadioGroup} ref='tlRadioGroup'/>
                    <label>实测(曲线图)</label>
                    <AttachmentList attachments={tlAttachments} ref='tlAttachmentList'/>
                </div>


                <div className='line2'>
                    <label>重量 目标:{project_heavy_range.max}Kg</label>
                    <RadioGroup param={heavyRadioGroup} ref='heavyRadioGroup'/>
                    <div style={{clear:'both'}}>
                        <label>实测</label>
                        <input defaultValue={heavyValue} ref='heavyInput'/>kg
                    </div>
                    <AttachmentList attachments={heavyAttachments} ref='heavyAttachmentList'/>
                </div>


                <div className='line2'>
                    <label>MAF 5*5</label>
                    <RadioGroup param={mafRadioGroup} ref='mafRadioGroup'/>
                    <label>实测(曲线图)</label>
                    <AttachmentList attachments={mafAttachments} ref='mafAttachmentList'/>
                </div>


                <div className='line2'>
                    <label>SIL</label>
                    <RadioGroup param={silRadioGroup} ref='silRadioGroup'/>
                    <AttachmentList attachments={silAttachments} ref='silAttachmentList'/>
                </div>


                <div className='line2'>
                    <label>文档检查</label>
                    <RadioGroup param={docRadioGroup} ref='docRadioGroup'/>
                    <AttachmentList attachments={docAttachments} ref='docAttachmentList'/>
                </div>

                <div className='line2'>
                    <label>文档检查</label>
                    <RadioGroup param={docRadioGroup} ref='docRadioGroup'/>
                    <AttachmentList attachments={docAttachments} ref='docAttachmentList'/>
                </div>


            </div>
        )
	}
});
module.exports = MuleTemplate;