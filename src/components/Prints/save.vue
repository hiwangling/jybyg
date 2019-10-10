<template>
  <div>
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogFormVisible" append-to-body>
      <div style="height:550px">
        <el-button type="primary" plain size="small" @click="print">打印</el-button>
        <section ref="print">
          <template>
            <template v-for="(item,index) in vert">
              <drag :key="index" :child="item" />
            </template>
          </template>
        </section>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Drag from '@/components/Drag'
// import { severprint } from '@/api/print'
export default {
  components: { Drag },
  data() {
    return {
      dialogFormVisible: false,
      vert: [
        {
          t: '张三山',
          left: '79',
          top: '36',
          width: '200',
          id: 0
        },
        {
          t: '寄存位置',
          left: '78',
          top: '66',
          width: '200',
          id: 1
        },
        {
          t: '地点',
          left: '77',
          top: '98',
          width: '200',
          id: 2
        },
        {
          t: '姓名',
          left: '78',
          top: '131',
          width: '200',
          id: 3
        },
        {
          t: '0716-7766866',
          left: '78',
          top: '163',
          width: '200',
          id: 4
        },
        {
          t: '日期',
          left: '77',
          top: '212',
          width: '200',
          id: 5
        },
        {
          t: '业务电话',
          left: '300',
          top: '211',
          width: '200',
          id: 6
        },
        {
          t: '2019-2-2',
          left: '11',
          width: '200',
          top: '303',
          id: 7
        },
        {
          t: '2019-3-4',
          left: '128',
          width: '200',
          top: '304',
          id: 8
        },
        {
          t: '201944334',
          left: '300',
          width: '200',
          top: '33',
          id: 9
        },
        {
          t: '关系',
          left: '298',
          width: '200',
          top: '131',
          id: 10
        }

      ],
      list: null,
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
      this.currentdate = year + '-' + month + '-' + strDate + ''
    },
    init(res) {
      var arr = []
      arr.push(res)
      this.dialogFormVisible = true
      arr.forEach((v, k) => {
        // var time = v.o_dietime.split('-')
        // var farewelltime = v.farewelltime.substr(0, 10)
        // var firetime = farewelltime.split('-')
        this.vert.forEach((n, m) => {
          if (n.id == 10) {
            n.t = ''
          }
          switch (m) {
            case 0:
              n.t = v.name
              break
            case 1:
              n.t = v.number
              break
            case 2:
              n.t = ''
              break
            case 3:
              n.t = v.linkman
              break
            case 4:
              n.t = v.linkaddress
              break
            case 5:
              n.t = this.currentdate
              break
            case 6:
              n.t = v.relation
              break
            case 7:
              n.t = v.startime
              break
            case 8:
              n.t = v.endtime
              break
            case 9:
              n.t = v.type == 1 ? 'N' + v.serial : 'W' + v.serial
            default:
          }
        })
      })
      this.dialogFormVisible = true
    }
  }
}
</script>

