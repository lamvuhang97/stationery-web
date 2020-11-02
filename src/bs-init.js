import $ from 'jquery';
import { Chart } from 'chart.js';
const loadCanvas = () => {
	$('canvas').each(function(index, elem){
		this.Chart = new Chart($(elem), JSON.parse(elem.innerHTML));
	})
};
export default loadCanvas;
