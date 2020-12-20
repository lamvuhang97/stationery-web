
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: ['chartData', 'options'],

  mounted () {
    console.log("111", this.chartData);
      this.renderChart(this.chartData, this.options)
  }
}