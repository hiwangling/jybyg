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
          t: '',
          left: '276',
          top: '24',
          width: '200',
          id: 0
        },
        {
          t: '',
          left: '274',
          top: '67',
          width: '200',
          id: 1
        },
        {
          t: '',
          left: '274',
          top: '107',
          width: '200',
          id: 2
        },
        {
          t: '',
          left: '273',
          top: '150',
          width: '200',
          id: 3
        },
        {
          t: '',
          left: '131',
          top: '293',
          width: '250',
          id: 4
        },
        {
          t: '',
          left: '230',
          top: '295',
          width: '200',
          id: 5
        },
        {
          t: '',
          left: '318',
          top: '298',
          width: '200',
          id: 6
        },
        {
          t: '',
          left: '130',
          width: '200',
          top: '333',
          id: 7
        },
        {
          t: '',
          left: '230',
          width: '200',
          top: '335',
          id: 8
        },
        {
          t: '',
          left: '318',
          width: '200',
          top: '335',
          id: 9
        },
        {
          t: '',
          left: '137',
          width: '200',
          top: '378',
          id: 10
        },
        {
          t: '',
          left: '248',
          width: '200',
          top: '484',
          id: 11
        }, {
          t: '',
          left: '382',
          width: '200',
          top: '484',
          id: 12
        },
        {
          t: '',
          left: '325',
          width: '200',
          top: '484',
          id: 13
        }

      ],
      list: null,
      year: '',
      month: '',
      strDate: '',
      date: new Date()
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
      this.year = year
      this.month = month
      this.strDate = strDate
      this.currentdate = year + '年' + month + '月' + strDate + '日'
    },
    init(res) {
      var arr = []
      arr.push(res)
      this.dialogFormVisible = true
      arr.forEach((v, k) => {
        var time = v.o_dietime.split('-')
        var farewelltime = v.farewelltime.substr(0, 10)
        var firetime = farewelltime.split('-')
        this.vert.forEach((n, m) => {
          if (n.id == 10) {
            n.t = v.o_registered
          }
          if (n.id == 11) {
            n.t = this.year
          }
          if (n.id == 12) {
            n.t = this.strDate
          }
          if (n.id == 13) {
            n.t = this.month
          }
          switch (m) {
            case 0:
              n.t = v.o_name
              break
            case 1:
              n.t = v.o_sex
              break
            case 2:
              n.t = ''
              break
            case 3:
              n.t = v.serial
              break
            case 4:
              n.t = time[0]
              break
            case 5:
              n.t = time[1]
              break
            case 6:
              n.t = time[2]
              break
            case 7:
              n.t = firetime[0]
              break
            case 8:
              n.t = firetime[1]
              break
            case 9:
              n.t = firetime[2]
            default:
          }
        })
      })
    }
  }
}
</script>

