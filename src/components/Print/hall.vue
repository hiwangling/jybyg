<template>
  <div>
    <div ref="print" style="padding:20px">
      <h3 class="print_title">嘉鱼县殡葬管理所殡仪服务申请单</h3>
      <div class="prinr_foot">
        {{ currentdate }}
      </div>
      <table id="hall_print" class="table_print">
        <tr>
          <td>逝者姓名</td>
          <td style="width:100px">{{ list.name }}</td>
          <td style="width:50px">性别</td>
          <td>{{ list.sex }}</td>
          <td>年龄</td>
          <td>{{ list.age }}</td>
          <td>死亡原因</td>
          <td style="width:100px">{{ list.reason }}</td>
        </tr>
        <tr>
          <td>身份证号码</td>
          <td colspan="3">{{ list.card }}</td>
          <td>地址</td>
          <td colspan="3">{{ list.registered }}</td>
        </tr>
        <tr>
          <td>联系人</td>
          <td>{{ list.linkman }}</td>
          <td>性别</td>
          <td>{{ list.linksex }}</td>
          <td>年龄</td>
          <td>{{ list.linkphone }}</td>
          <td>与逝者关系</td>
          <td>{{ list.relation }}</td>
        </tr>
        <tr v-if="send">
          <th colspan="8">接 运 服 务</th>
        </tr>
        <tr v-for="(val,item,index) in send" :key="index">
          <td>接运类型</td>
          <td colspan="2">{{ val.recetype | recetype_list }}</td>
          <td>出车时间</td>
          <td colspan="2">{{ val.create_time }}</td>
          <td>接运价格</td>
          <td>{{ val.totalprice }}</td>
        </tr>
        <tr v-if="mourn">
          <th colspan="8">灵 堂 服 务</th>
        </tr>
        <tr v-if="mourn">
          <td>悼念厅</td>
          <td>{{ mourn.title }}</td>
          <td>开始时间</td>
          <td colspan="2">{{ mourn.create_time }}</td>
          <td>结束时间</td>
          <td colspan="2">{{ mourn.endtime }}</td>
        </tr>
        <tr>
          <th colspan="8">已 选 服 务 项 目</th>
        </tr>
        <tr class="servers">
          <td colspan="2">服务名称</td>
          <td colspan="2">数量</td>
          <td colspan="2">单价</td>
          <td colspan="2">合计</td>
        </tr>
        <tr v-for="(val,item,index) in server" :key="index" class="servers">

          <td colspan="2">{{ val.title }} </td>
          <td colspan="2">{{ val.number }}</td>
          <td colspan="2">{{ val.price }}</td>
          <td colspan="2">{{ val.totalprice }}</td>
        </tr>
        <tr>
          <td colspan="2">总计</td>
          <td colspan="4" />
          <td colspan="2">{{ totalprice }} 元</td>
        </tr>
      </table>
      <div>
        <!-- <p>备注：悼念厅收费，不足半天按半天计算，不足一天按一天计算。</p> -->
        <!-- <p>以上服务项目和收费标准已经知晓，同意按此项目服务并收费。</p> -->
        <p>经办人: {{ list.operator }}</p>
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
      mourn: null,
      send: null,
      currentdate: '',
      totalprice: ''
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
      this.server = v.voca
      this.list = v.list
      this.mourn = v.mourn
      this.totalprice = v.totalprice
      this.send = v.carsend
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
<style scoped>
  #hall_print tr td{
   font-size: 14px;
  }
</style>
