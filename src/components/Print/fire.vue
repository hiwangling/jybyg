<template>
  <div>
    <div ref="print">
      <h3 style="text-align:center;display:inline-block;height:20px;font-weight: 800;width:100%;margin-top:20px;">2019年火化登记表</h3>
      <div style="text-align:right;padding-right:50px">编号: {{ list.serial }}</div>
      <table class="tb" border="0" cellspacing="0" cellpadding="0" style="border:0">
        <tr>
          <td style="border: none;">逝者姓名: {{ list.o_name }}</td>
          <td style="border: none;">性别: {{ list.o_sex }}</td>
          <td style="border: none;">年龄: {{ list.o_age }}</td>
        </tr>
        <tr>
          <td colspan="3" style="border: none;">身份证号: {{ list.o_card }}</td>
        </tr>
        <tr>
          <td colspan="3" style="border: none;">家庭住址: {{ list.o_registered }}</td>
        </tr>
        <tr>
          <td style="border: none;">死亡日期: <u>{{ list.o_dietime }}</u></td>
          <td style="border: none;">火化日期: <u>{{ list.farewelltime }}</u></td>
          <td style="border: none;" />
        </tr>
        <tr>
          <td style="border: none;">承办人(家属)签字:</td>
          <td style="border: none;" />
          <td style="border: none;">与逝者关系:</td>
        </tr>
        <tr>
          <td colspan="3" style="border: none;">经办人身份证号: </td>
        </tr>
        <tr>
          <td colspan="3" style="border: none;">经办人联系方式: </td>
        </tr>
        <tr>
          <td style="border: none;" />
          <td style="border: none;" />
          <td style="border: none;">{{ currentdate }}</td>
        </tr>
      </table>
      <hr>
      <h3 style="text-align:center;display:inline-block;height:20px;font-weight: 800;width:100%;margin-top:20px;">火化通知单</h3>
      <div style="text-align:right;padding-right:50px">编号: {{ list.serial }}</div>
      <div style="text-align:right;padding-right:50px;height:50px;line-height:50px">所选炉型: {{ list.l_title }}</div>
      <table class="tb" border="0" cellspacing="0" cellpadding="0" style="border:0">
        <tr>
          <td style="border: none;">逝者姓名: {{ list.o_name }}</td>
          <td style="border: none;">性别: {{ list.o_sex }}</td>
          <td style="border: none;">年龄: {{ list.o_age }}</td>
        </tr>
        <tr>
          <td colspan="3" style="border: none;">身份证号: {{ list.o_card }}</td>
        </tr>
        <tr>
          <td colspan="3" style="border: none;">家庭住址: {{ list.o_registered }}</td>
        </tr>
        <tr>
          <td style="border: none;">死亡日期:  <u>{{ list.o_dietime }}</u></td>
          <td style="border: none;">火化日期: <u>{{ list.farewelltime }}</u></td>
          <td style="border: none;" />
        </tr>
        <tr>
          <td colspan="3" style="border: none;height:40px;" />
        </tr>
        <tr>
          <td style="border: none;">承办人(家属)签字:</td>
          <td style="border: none;" />
          <td style="border: none;">与逝者关系:</td>
        </tr>
        <tr>
          <td colspan="3" style="border: none;">经办人联系方式: </td>
        </tr>
        <tr>
          <td style="border: none;" />
          <td style="border: none;" />
          <td style="border: none;">{{ currentdate }}</td>
          </td></tr>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentdate: '',
      list: {

      }
    }
  },
  created() {
    this.getNowFormatDate()
  },
  methods: {
    print() {
      this.$print(this.$refs.print)
    },
    init(data, type) {
      this.list = Object.assign({}, data)
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
<style>

.tb {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: left;
  padding-left: 20px;
  font-size: 16px;
  color: #000;
  /* border-collapse: collapse; */
}
@media print {
    td {
         border: none;
    }
}
</style>
