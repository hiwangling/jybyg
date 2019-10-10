<template>
  <div>
    <div ref="print">
      <h3 class="print_title">火化服务部{{ this.year }}年{{ this.month }}月份业务用油月报表</h3>
      <table class="table_print">
        <tr>
          <td>上月库存</td>
          <td />
          <td style="width:200px">{{ list.repertory }}</td>
        </tr>
        <tr>
          <td>本月进油</td>
          <td />
          <td>{{ list.enter }}</td>
        </tr>
        <tr>
          <td>总油</td>
          <td />
          <td>{{ list.sumup }}</td>
        </tr>
        <tr>
          <td rowspan="3">业务应用油</td>
        </tr>
        <tr>
          <td>平板炉应用油</td>
          <td>{{ list.puse }}</td>
        </tr>
        <tr>
          <td>拣灰炉应用油</td>
          <td>{{ list.juse }}</td>
        </tr>
        <tr>
          <td rowspan="3">实际用油</td>
        </tr>
        <tr>
          <td>平板炉实际用油</td>
          <td>{{ list.psuse }}</td>
        </tr>
        <tr>
          <td>拣灰炉实际用油</td>
          <td>{{ list.jsuse }}</td>
        </tr>
        <tr>
          <td>节油</td>
          <td />
          <td>{{ list.economy }}</td>
        </tr>
        <tr>
          <td>试炉用油</td>
          <td />
          <td>{{ list.syuse }}</td>
        </tr>
        <tr>
          <td>本月存油</td>
          <td />
          <td>{{ list.deposit }}</td>
        </tr>
        <!-- <div class="prinr_foot">
          {{ list.operatortime }}
        </div> -->
      </table>
      <div style="margin:8px 0px;text-align:right">单位：升</div>
      <div style="margin:8px 0px;text-align:right">制表人：{{ list.operator }}</div>
    </div>
  </div>
</template>

<script>
import { vuexData } from '@/utils/mixin'
export default {
  mixins: [vuexData],
  data() {
    return {
      list: {
        repertory: '',
        enter: '',
        sumup: '',
        puse: '',
        juse: '',
        psuse: '',
        jsuse: '',
        economy: '',
        syuse: '',
        deposit: '',
        operator: '',
        operatortime: null
      },
      year: '',
      month: '',
      server: null,
      currentdate: ''
    }
  },
  created() {
    this.getNowFormatDate()
  },
  methods: {
    print() {
      this.$print(this.$refs.print)
    },
    init(v) {
    //   console.log(v)
      this.list = Object.assign({}, v)
      this.year = this.list.operatortime.substr(0, 4)
      this.month = this.list.operatortime.substr(5, 8)
      console.log(this.month)
      //   console.log(this.list)
      this.$nextTick(() => {
        this.print()
      })
    },
    getNowFormatDate() {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      this.currentdate = year + '年' + month + '月' + strDate + '日'
    }
  }
}
</script>
<style lang="stylus">

</style>
