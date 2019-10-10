<template>
  <div>
    <div ref="print">
      <h3 class="print_title">出 车 业 务 通 知 单</h3>
      <table class="table_print">
        <tr>
          <td>逝者姓名</td>
          <td>{{ list.name }}</td>
          <td>接运类型</td>
          <td>{{ list.recetype | recetype_list }}</td>
        </tr>
        <tr>
          <td>联系人</td>
          <td>{{ list.linkman }}</td>
          <td>联系电话</td>
          <td>{{ list.linkphone }}</td>
        </tr>
        <tr>
          <td>司机</td>
          <td>{{ list.username }}</td>
          <td>接运价格</td>
          <td>{{ list.totalprice }}</td>
        </tr>
        <tr>
          <td>接运地址</td>
          <td colspan="3">{{ list.address }}</td>
        </tr>
        <tr>
          <td>出车时间</td>
          <td style="width:170px">{{ list.outtime }}</td>
          <td>经办人</td>
          <td>{{ list.operator }}</td>
        </tr>
        <tr>
          <th colspan="4">已 选 服 务</th>
        </tr>
        <tr>
          <td>服务项目</td>
          <td>数量</td>
          <td>单价</td>
          <td>总价</td>
        </tr>
        <tr v-for="(val,item,index) in server" :key="index">
          <td>{{ val.title }}</td>
          <td>{{ val.number }}</td>
          <td>{{ val.price }}</td>
          <td>{{ val.totalprice }}</td>
        </tr>
      </table>
      <div class="prinr_foot">
        {{ currentdate }}
      </div>
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

      },
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
      this.server = v.server
      this.list = v.list
      //   this.list = Object.assign({}, data)
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
