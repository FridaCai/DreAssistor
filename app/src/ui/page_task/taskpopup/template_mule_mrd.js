import RadioGroup from '../../widget/radiogroup/index.js';
import './template_mule_mrd.less';

var Chart = React.createClass({
    render(){
        return (<div>This is Chart. Hello World!</div>)
    }
})


var MuleMRDTemplate = React.createClass({
    getInitialState() {
        return {
            param: this.props.param,
            project: this.props.project,
        }
    },

    getValue(){
        return {
            
        }
    },

	render(){
        return (
            <div className='mule_mrd'>
            {
                <table>
                    <thead className="thead-inverse">
                        <tr>
                            <th>属性</th>
                            <th>目标</th>
                            <th>状态</th>
                            <th>实测</th>
                            <th>附件</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>a</td>
                            <td>b</td>
                            <td>c</td>
                            <td>d</td>
                            <td>e</td>
                        </tr>
                        <tr>
                            <td>aa</td>
                            <td>ab</td>
                            <td>ac</td>
                            <td>ad</td>
                            <td>ae</td>
                        </tr>
                    </tbody>

                </table>
            
 
            }
        </div>)
	}
});
module.exports = MuleMRDTemplate;