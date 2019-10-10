<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.search_data"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入关键字"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>

    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="火化编号" prop="c_serial" />
      <el-table-column align="center" label="逝者姓名" prop="name" />
      <el-table-column align="center" label="联系人" prop="linkman" />
      <el-table-column align="center" label="联系电话" prop="linkphone" />
      <el-table-column align="center" label="火化时间" prop="farewelltime" />
      <el-table-column align="center" label="应付总价" prop="totalprice" />
      <el-table-column align="center" label="状态" prop="finance_status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.finance_status == 1 ? 'danger' : 'success'">{{ scope.row.finance_status == 1 ? '未支付' : '已支付' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" width="130">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-search" @click="handleInfo(scope.row)">详情</el-button>
          <!-- <el-button type="primary" size="mini" icon="el-icon-truck" @click="handleCheckinfo(scope.row)">骨灰</el-button>
          <el-button type="primary" size="mini" @click="handleServer(scope.row)">服务</el-button>
          <el-button type="primary" size="mini" @click="handleDerate(scope.row)">减免</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :close-on-click-modal="false" title="查看" :visible.sync="dialogFormInfo">
      <div ref="print" class="print_tick">
        <h3 style="text-align: center;font-size:22px;font-weight: 800; margin: 0 0 15px 0">业 务 结 算 单</h3>
        <div class="bury_car">
          <h1 class="bury_car_h1">逝者信息</h1>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 逝者姓名 : </span>{{ info_temp.name }}</p>
                <p><span> 身份证 : </span>{{ info_temp.card }}</p>
                <p><span> 死亡原因 : </span>{{ info_temp.reason }}</p>
                <p><span> 联系人 : </span>{{ info_temp.linkman }}</p>
                <p><span> 火化时间 : </span>{{ info_temp.farewelltime }}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 逝者性别 : </span>{{ info_temp.sex }}</p>
                <p><span> 户口所在地 : </span>{{ info_temp.registered }}</p>
                <p><span> 联系人性别 : </span>{{ info_temp.linksex }}</p>
                <p><span> 联系电话 : </span>{{ info_temp.linkphone }}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 逝者年龄 : </span>{{ info_temp.age }}</p>
                <p><span> 民族 : </span>{{ info_temp.nation }}</p>
                <p><span> 承办人 : </span>{{ info_temp.operator }}</p>
                <p><span> 逝者关系 : </span>{{ info_temp.relation }}</p>
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-if="carsend" class="bury_car" style="border:1px solid #23C6C8;margin-top:10px;">
          <h1 class="bury_car_h1" style="background:#23C6C8;color:#fff">接运业务</h1>
          <el-divider content-position="left">出车信息</el-divider>
          <el-row :gutter="20">
            <div v-for="(item,index) in carsend" :key="index">
              <el-col :span="8">
                <div class="grid-content">
                  <p><span> 接运类型 : </span>{{ item.recetype | recetype_list }}</p>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content">
                  <p><span> 出车时间 : </span>{{ item.create_time }} </p>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content">
                  <p>
                    <span> 接运价格 : </span>
                    <span style="font-weight: 100;">{{ item.totalprice }}</span>
                  </p>
                </div>
              </el-col>
            </div>
          </el-row>
        </div>

        <div class="bury_car" style="border:1px solid #63afde;margin-top:10px;">
          <h1 class="bury_car_h1" style="background:#63afde;color:#fff">服务</h1>
          <template v-if="mourn">
            <el-divider content-position="left">灵堂服务</el-divider>
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="grid-content">
                  <p><span> 灵堂名称 : </span>{{ mourn.title }}</p>
                  <p><span> 价格 : </span>{{ mourn.totalprice }}</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <p><span> 开始时间 : </span>{{ mourn.startime }}</p>
                  <p><span> 备注 : </span>{{ mourn.remark }}</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <p><span> 结束时间 : </span>{{ mourn.endtime }}</p>
                  <p><span> 操作人 : </span>{{ mourn.operator }}</p>
                </div>
              </el-col>
            </el-row>
          </template>
          <template v-if="cold">
            <el-divider content-position="left">冷藏柜</el-divider>
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="grid-content">
                  <p><span> 冷藏柜名称 : </span>{{ cold.title }}</p>
                  <p><span> 价格 : </span>{{ cold.totalprice }}</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <p><span> 开始时间 : </span>{{ cold.startime }}</p>
                  <p><span> 备注 : </span>{{ cold.remark }}</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <p><span> 结束时间 : </span>{{ cold.endtime }}</p>
                  <p><span> 操作人 : </span>{{ cold.operator }}</p>
                </div>
              </el-col>
            </el-row>
          </template>
          <template v-if="serlist.voca ? serlist.voca.length > 0 : false">
            <el-divider content-position="left">大厅服务</el-divider>
            <!-- {{ serlist.voca }} -->
            <el-row :gutter="20">
              <div v-for="(item,index) in serlist.voca" :key="index">
                <el-col :span="12">
                  <div class="grid-content">
                    <p><span> 服务名称 : </span>{{ item.title }}</p>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content">
                    <p><span> 数量 : </span>{{ item.number }} </p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content">
                    <p><span> 合计 : </span>{{ item.totalprice }}</p>
                  </div>
                </el-col>
              </div>
            </el-row>
          </template>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <span v-if="record_sign_info" class="sign_">家属签字：<img :src="record_sign_info" alt="" @click="dialogFormSign = true"> </span> -->
        <span style="color:red;font-size:14px;margin-right:10px;">应付总价：<b>{{ totalprice }}</b> 元</span>
        <el-button v-show="finance_status == 1" type="primary" @click="handlePay">付款</el-button>
        <el-button type="primary" @click="handlePrintFireCard">火化证</el-button>
        <el-button type="primary" @click="handlePrintFire">火化通知单</el-button>
        <el-button type="primary" @click="handlePrintPay">收据打印</el-button>
        <el-button type="primary" @click="handlePrint">结算打印</el-button>
        <el-button @click="dialogFormInfo = false">取消</el-button>
      </div>
    </el-dialog>
    <fire v-show="false" ref="fire_" />
    <el-dialog :close-on-click-modal="false" title="选择服务" :visible.sync="dialogFormServer">
      <service ref="server" @service_data="service_data" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSend">确定</el-button>
        <el-button @click="dialogFormServer = false">取消</el-button>
      </div>
    </el-dialog>
    <prints v-show="false" ref="prints_" />
    <hall v-show="false" ref="hall_" />
    <server v-show="false" ref="server_" />
  </div>
</template>
<script>
import {
  financeList,
  financeInfo,
  financePay,
  createcarcommon,
  financecheck,
  checkCommon,
  servicesCommon,
  servicesAdd,
  derateCommon,
  derateAdd,
  carsendEdit,
  printinfo,
  carsendSerEdit
} from '@/api/manage'
import Pagination from '@/components/Pagination'
import sign from '@/components/Sign'
import e560 from '@/components/E560'
import fire from '@/components/Print/fire'
import hall from '@/components/Print/hall'
import server from '@/components/Print/server'
import prints from '@/components/Prints'
import service from '@/components/Service'
import { vuexData } from '@/utils/mixin'
export default {
  name: 'VueGarden',
  components: { Pagination, sign, service, e560, fire, prints, hall, server },
  mixins: [vuexData],
  data() {
    return {
      list: null,
      car: null,
      finance_status: 1,
      recetype: null,
      print_id: '',
      index: 1,
      sign_img: {
        send: '',
        voca: '',
        fire: '',
        hall: ''
      },
      index_sign: '',
      sign_img_save: '',
      sign_img_derate: '',
      record_sign: '',
      record_sign_info: '',
      signatureid: '',
      sex: ['男', '女'],
      record_ifsign: '',
      info_list: null,
      activeName: 'first',
      branchList: null,
      dataForm: {
        name: '',
        sex: '',
        age: '',
        card: '',
        registered: '',
        reason: '',
        linkman: '',
        number: '',
        relation: '',
        dietime: null,
        linksex: '',
        nation: '',
        haulier: '',
        linkphone: '',
        operator: '',
        server: null,
        c_remark: '',
        oid: '',
        id: ''
      },
      info_temp: {
        name: '',
        sex: '',
        age: '',
        card: '',
        farewelltime: null,
        registered: '',
        reason: '',
        linkman: '',
        relation: '',
        linksex: '',
        nation: '',
        linkphone: '',
        operator: ''
      },
      send: {
        name: '',
        sex: '',
        age: '',
        address: '',
        cid: '',
        recetype: '',
        outtime: null,
        linkman: '',
        totalprice: '',
        linkphone: '',
        driver: '',
        operator: '',
        remark: '',
        id: '',
        oid: ''
      },
      service: {
        id: '',
        name: '',
        operator: '',
        server: null
      },
      row: null,
      derate: {
        name: '',
        age: '',
        sex: '',
        registered: '',
        card: '',
        object: '',
        papers: '',
        serial: '',
        signtime: null,
        oneprice: '',
        twoprice: '',
        threeprice: '',
        totalprice: '',
        operator: '',
        signature: '',
        id: '',
        oid: ''
      },
      save: {
        name: '',
        serial: '',
        startime: null,
        endtime: null,
        signature: '',
        card: '',
        linkman: '',
        linkphone: '',
        linkaddress: '',
        operator: '',
        totalprice: '',
        id: '',
        oid: ''
      },
      serlist: {
        send: null,
        voca: null,
        fire: null,
        hall: null
      },
      carsend: null,
      mourn: null,
      cold: null,
      totalprice: 0,
      name: '',
      oid: '',
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        search_data: '',
        sort: 'add_time',
        order: 'desc'
      },
      dialogFormInfo: false,
      dialogFormVisible: false,
      dialogFormVisibleSign: false,
      dialogFormSign: false,
      dialogFormServer: false,
      print_data: {
        send: null,
        mourn: null,
        cold: null,
        voca: null,
        name: '',
        operator: '',
        totalprice: ''
      },
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        type_name: [
          { required: true, message: '墓园名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  created() {
    this.getList()
    createcarcommon().then(res => {
      this.recetype = res.data.recetype
      this.car = res.data.car
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      financeList(this.listQuery)
        .then(res => {
          this.list = res.data.data
          this.total = res.data.total || 0
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },

    solos(arr) {
      var editRow = []
      arr.forEach((v, k) => {
        editRow.push(v.services)
      })
      return [].concat.apply([], editRow)
    },
    handlePrint(v) {
      const data = {
        voca: this.serlist.voca,
        mourn: this.mourn,
        cold: this.cold,
        carsend: this.carsend,
        list: this.info_temp,
        totalprice: this.totalprice
      }
      this.$nextTick(() => {
        this.$refs.hall_.init(data)
      })
    },
    getCommon(v) {
      const data = { id: this.service.id }
      servicesCommon(data).then(res => {
        this.server = res.data.services
        const data = {
          type: v,
          server: this.server
        }
        this.$refs.server.showService(data)
        this.$refs.server.editService(res.data.servicesOrder)
      })
    },
    handlePrintPay() {
      this.$nextTick(() => {
        this.$refs.server_.getlist(this.print_data)
      })
    },
    handleServer(v) {
      this.service.id = v.id
      this.service.name = v.name
      this.service.operator = v.operator
      this.getCommon(1)
      this.dialogFormServer = true
    },
    service_data(data) {
      this.service.server = data
    },
    handleSend() {
      servicesAdd(this.service).then(res => {
        this.getList()
        this.dialogFormServer = false
        this.$notify.success({
          title: '成功',
          message: '付款成功'
        })
      })
    },
    CarBind(id) {
      for (const i of this.car) {
        if (i.id === id) {
          this.send.driver = i.chauffeur
          this.send.totalprice = i.price
          break
        }
      }
    },
    handleClick(tab, event) {
      this.index = parseInt(tab.index) + 1
      this.checkCommonFn()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sign_open(v) {
      this.index_sign = v
      this.record_sign = ''
      this.record_sign_info = ''
      this.dialogFormVisibleSign = true
      this.$nextTick(() => {
        this.$refs.child.initDevice()
      })
    },
    sign_close() {
      this.$refs.child.uninitDevice()
    },
    cancel() {
      this.dialogFormVisibleSign = false
    },
    imgData(v) {
      if (this.index_sign == 0) {
        this.record_sign = v
      } else {
        this.record_sign_info = v
      }
    },
    open(v) {
      this.record_sign = v
      this.dialogFormSign = true
    },
    changePrice(v) {
      const data = {
        id: v.id,
        oid: v.oid,
        name: this.info_temp.name,
        totalprice: v.totalprice
      }
      carsendEdit(data).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: '成功',
            message: '价格修改成功'
          })
          this.totalprice = res.data
        }
      })
    },
    handlePrintFire() {
      const data = { oid: this.dataForm.id }
      printinfo(data).then(res => {
        this.$refs.fire_.init(res.data)
      })
    },
    handlePrintFireCard() {
      const data = { oid: this.dataForm.id }
      printinfo(data).then(res => {
        this.$refs.prints_.init(res.data)
      })
    },
    changeBand(v) {
      const data = {
        sid: v.sid,
        oid: v.oid,
        name: this.info_temp.name,
        totalprice: v.totalprice
      }
      carsendSerEdit(data).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: '成功',
            message: '价格修改成功'
          })
          this.totalprice = res.data
        }
      })
    },
    // 减免
    derateSend() {
      this.derate.signature = this.record_sign
      derateAdd(this.derate).then(res => {
        if (res.code == 0) {
          this.dialogFormVisible = false
          this.getList()
          this.$notify.success({
            title: '成功',
            message: '操作成功'
          })
        }
      })
    },
    sumPrice() {
      var sum = 0
      sum = parseInt(this.derate.oneprice ? this.derate.oneprice : 0) +
      parseInt(this.derate.twoprice ? this.derate.twoprice : 0) +
      parseInt(this.derate.threeprice ? this.derate.threeprice : 0)
      this.derate.totalprice = sum
    },
    handleDerate(v) {
      const data = { id: v.id }

      derateCommon(data).then(res => {
        this.derate = Object.assign({}, res.data)
        this.derate.operator = this.derate.operator == undefined ? this.info.realname : this.derate.operator
        this.record_sign = res.data.signature
        this.dialogFormVisible = true
      })
    },
    async handleCheckinfo(v) {
      this.row = v
      await this.checkCommonFn()
      await this.showcheck()
    },

    checkCommonFn() {
      const data = { id: this.row.id, type: this.index }
      checkCommon(data).then(res => {
        this.rest()
        if (res.data) {
          if (this.index == 1) {
            this.save = Object.assign({}, res.data)
            this.save.operator = this.save.operator == '' ? this.info.realname : this.save.operator
          } else {
            this.send = Object.assign({}, res.data)
            this.send.operator = this.send.operator == '' ? this.info.realname : this.send.operator
          }
        } else {
          if (this.index == 1) {
            this.save.name = this.row.name
            this.save.linkman = this.row.linkman
            this.save.sex = this.row.sex
            this.save.linkphone = this.row.linkphone
          } else {
            this.send.sex = this.row.sex
            this.send.name = this.row.name
            this.send.linkman = this.row.linkman
            this.send.linkphone = this.row.linkphone
          }
        }
      })
    },
    rest() {
      this.save = {
        name: '',
        serial: '',
        startime: null,
        endtime: null,
        signature: '',
        card: '',
        linkman: '',
        linkphone: '',
        linkaddress: '',
        operator: '',
        totalprice: '',
        id: '',
        oid: ''
      }
      this.send = {
        name: '',
        sex: '',
        age: '',
        address: '',
        cid: '',
        recetype: '',
        outtime: null,
        linkman: '',
        totalprice: '',
        linkphone: '',
        driver: '',
        operator: '',
        remark: '',
        id: '',
        oid: ''
      }
      this.check = {
        name: '',
        serial: '',
        startime: null,
        endtime: null,
        signature: '',
        card: '',
        linkman: '',
        linkphone: '',
        linkaddress: '',
        operator: '',
        totalprice: ''
      }
      this.serlist = {
        send: null,
        voca: null,
        fire: null,
        hall: null
      }
      this.carsend = null
      this.cold = null
      this.mourn = null
    },

    handleInfo(row) {
      this.dataForm = Object.assign({}, row)
      this.signatureid = row.id
      this.finance_status = row.finance_status
      this.print_id = row.id
      this.record_sign_info = ''
      this.totalprice = row.totalprice
      this.print_data.totalprice = row.totalprice
      this.name = row.name
      this.print_data.name = row.name
      this.print_data.operator = row.operator
      this.oid = row.id
      this.info_(row)
    },
    info_(row, type) {
      const data = { id: row.id }
      this.rest()
      financeInfo(data)
        .then(res => {
          var server = res.data.branchList
          this.branchList = res.data.branchList
          var servers = Object.values(server)
          if (servers[0].carsend) {
            this.carsend = servers[0].carsend
          }
          if (servers[1].record) {
            this.mourn = servers[1].record.mourn
            this.cold = servers[1].record.cold
          }
          Object.keys(this.serlist).forEach((v, k) => {
            this.serlist[v] = this.solo(servers[k]) // voca 大厅服务

            this.sign_img[v] = servers[k].signature
          })
          this.sign_img_derate = res.data.derate.signature
          if (res.data.check) {
            this.sign_img_save = res.data.check.signature
          }
          this.serlist.voca = this.serlist.voca.concat(this.serlist.send)
          this.print_data.send = this.carsend
          this.print_data.mourn = this.mourn
          this.print_data.cold = this.cold
          this.print_data.voca = this.serlist.voca.concat(this.serlist.send)
          this.info_temp = res.data.obituary
          this.record_ifsign = res.data.obituary.record_ifsign
          this.record_sign = res.data.obituary.record_sign
          if (res.data.check) {
            this.check = res.data.check
          }
          this.derate = res.data.derate
          this.dialogFormInfo = true
        })
    },
    solo(arr) {
      var editRow = []
      arr.services.forEach((v, k) => {
        editRow.push(v.services)
      })
      return [].concat.apply([], editRow)
    },

    handlePay(row) {
      this.$confirm('是否付款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          name: this.name,
          oid: this.oid,
          totalprice: this.totalprice,
          operator: this.info.realname,
          record_sign: this.record_sign_info
        }
        financePay(data)
          .then(res => {
            if (res.code == 0) {
              this.getList()
              this.dialogFormInfo = false
              this.$notify.success({
                title: '成功',
                message: '付款成功'
              })
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

