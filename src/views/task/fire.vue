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
      <!-- <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button> -->
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
      <!-- <el-table-column align="center" label="牌号" prop="number" width="50" /> -->
      <el-table-column align="center" label="逝者姓名" prop="o_name" width="100" />
      <el-table-column align="center" label="联系人" prop="o_linkman" width="100" />
      <el-table-column align="center" label="联系电话" prop="o_linkphone" width="150" />
      <el-table-column align="center" label="服务" prop="services" />
      <el-table-column align="center" label="火化时间" prop="o_farewelltime" width="160" />
      <!-- <el-table-column align="center" label="状态" prop="state">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | carFilter"> {{ scope.row.state = scope.row.state==null ? 1 : scope.row.state | cremationstate_stype }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="操作" class-name="small-padding" width="220">

        <template slot-scope="scope">
          <template v-if="scope.row.sign == 1">
            <el-button
              type="primary"
              size="mini"
              @click="handleSi(scope.row)"
            >签收</el-button>
          </template>
          <template v-else>
            <el-button
              v-if="scope.row.state == 1"
              type="danger"
              size="mini"
              @click="handleFire(scope.row)"
            >开始火化</el-button>
            <el-button
              v-else
              type="info"
              size="mini"
              @click="handleQu(scope.row)"
            >取灰</el-button>
          </template>
          <el-button
            icon="el-icon-search"
            type="primary"
            size="mini"
            @click="handleSign(scope.row)"
          >详情</el-button>
          <!-- <template v-if="scope.row.c_ifsignature == 0 || scope.row.c_ifsignature ==null">
            <el-button
              v-permission="['POST /api/v1/cemetery_classify/g_edit']"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >办理</el-button>
            <el-button
              v-permission="['POST /api/v1/cemetery_classify/g_edit']"
              icon="el-icon-search"
              type="primary"
              size="mini"
              @click="handleSign(scope.row)"
            >详情</el-button>
          </template>
          <template v-else>
            <el-button
              v-if="scope.row.c_state == 2"
              v-permission="['POST /api/v1/cemetery_classify/g_edit']"
              type="warning"
              size="mini"
              @click="handleOver(scope.row)"
            >结束火化</el-button>
            <el-button
              v-if="scope.row.c_state == 1"
              v-permission="['POST /api/v1/cemetery_classify/g_edit']"
              type="danger"
              size="mini"
              @click="handleFire(scope.row)"
            >开始火化</el-button>
            <template v-if="scope.row.c_state == 3">
              <el-button
                v-permission="['POST /api/v1/cemetery_classify/g_edit']"
                type="info"
                size="mini"
                @click="handleQu(scope.row)"
              >取灰</el-button>
              <el-button
                v-permission="['POST /api/v1/cemetery_classify/g_edit']"
                type="primary"
                size="mini"
                @click="handleSave(scope.row)"
              >寄存</el-button>
            </template>
            <el-button
              v-if="scope.row.c_state == 4 || scope.row.c_state == 5"
              v-permission="['POST /api/v1/cemetery_classify/g_edit']"
              type="danger"
              plain
              size="mini"
            >已完结</el-button>
          </template> -->
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

    <!-- 添加或修改对话框 -->
    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="基本信息" name="info">
          <div style="margin-bottom:10px">
            <el-button size="mini" type="primary" @click="getCard(0)">逝者信息</el-button>
            <el-button size="mini" type="primary" @click="getCard(1)">联系人信息</el-button>
            <el-button size="mini" type="primary" @click="resetForm">清空信息</el-button>
          </div>
          <el-form
            ref="dataForm"
            :rules="rules"
            :inline="true"
            :model="dataForm"
            status-icon
            label-position="left"
            label-width="100px"
          >
            <el-form-item label="逝者姓名" prop="name">
              <el-input v-model="dataForm.name" />
            </el-form-item>
            <el-form-item label="逝者性别" prop="sex">
              <el-select
                v-model="dataForm.sex"
                placeholder="选择性别"
                clearable
                class="filter-item"
                style="width:185px"
              >
                <el-option v-for="(item,index) in sex" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="逝者年龄" prop="age">
              <el-input v-model="dataForm.age" />
            </el-form-item>
            <el-form-item label="民族" prop="nation">
              <el-input v-model="dataForm.nation" />
            </el-form-item>
            <el-form-item label="身份证" prop="card">
              <el-input v-model="dataForm.card" />
            </el-form-item>
            <el-form-item label="户口所在地" prop="registered">
              <el-input v-model="dataForm.registered" />
            </el-form-item>
            <el-form-item label="死亡时间" prop="dietime">
              <el-date-picker
                v-model="dataForm.dietime"
                style="width:185px"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="死亡原因" prop="reason">
              <el-input v-model="dataForm.reason" />
            </el-form-item>

            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="dataForm.linkman" />
            </el-form-item>
            <el-form-item label="联系人性别" prop="linksex">
              <el-select
                v-model="dataForm.linksex"
                placeholder="选择性别"
                clearable
                class="filter-item"
                style="width:185px"
              >
                <el-option v-for="(item,index) in sex" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>

            <el-form-item label="联系人电话" prop="linkphone">
              <el-input v-model="dataForm.linkphone" />
            </el-form-item>
            <el-form-item label="逝者关系" prop="relation">
              <el-input v-model="dataForm.relation" />
            </el-form-item>
            <el-form-item label="承运人" prop="haulier">
              <el-input v-model="dataForm.haulier" />
            </el-form-item>
            <el-form-item label="操作员" prop="operator">
              <el-input v-model="dataForm.operator" />
            </el-form-item>
            <el-form-item label="备注" prop="c_remark">
              <el-input v-model="dataForm.c_remark" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="选择服务" name="second">
          <service ref="server" @service_data="service_data" />
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" title="查看" :visible.sync="dialogFormVisibleInfo">
      <!-- <h3 style="text-align: center;font-size:22px;font-weight: 100; margin: 0 0 15px 0">嘉鱼殡仪馆火化及申请书</h3> -->
      <div class="bury_car">
        <h1 class="bury_car_h1">逝者信息</h1>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者姓名 : </span>{{ dataForm.o_name }}</p>
              <p><span> 逝者民族 : </span>{{ dataForm.o_nation }}</p>
              <p><span> 户口所在地 : </span>{{ dataForm.o_registered }}</p>
              <p><span> 联系人性别 : </span>{{ dataForm.o_linksex }}</p>
              <p><span> 承运人 : </span>{{ dataForm.haulier }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者性别 : </span>{{ dataForm.o_sex }}</p>
              <p><span> 死亡原因 : </span>{{ dataForm.o_reason }}</p>
              <p><span> 死亡时间 : </span>{{ dataForm.o_dietime }}</p>
              <p><span> 联系人电话 : </span>{{ dataForm.o_linkphone }}</p>
              <p><span> 备注 : </span>{{ dataForm.remark }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者年龄 : </span>{{ dataForm.o_age }}</p>
              <p><span> 身份证 : </span>{{ dataForm.o_card }}</p>
              <p><span> 联系人 : </span>{{ dataForm.o_linkman }}</p>
              <p><span> 与逝者关系 : </span>{{ dataForm.o_relation }}</p>
              <p><span> 操作员 : </span>{{ dataForm.operator }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="server ? server.length > 0 : false" class="bury_car" style="border:1px solid #23C6C8;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#23C6C8;color:#fff">所选服务</h1>
        <el-row :gutter="20">
          <div v-for="(item,index) in server" :key="index">
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 服务名称 : </span>{{ item.title }}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 数量 : </span>{{ item.number }}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 合计 : </span>{{ item.totalprice }}</p>
              </div>
            </el-col>
          </div>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <span class="sign_">家属签字：<img v-if="record_sign" :src="record_sign" alt="" @click="dialogFormSign = true"> </span>
        <el-button v-if="record_ifsign == 0" type="primary" @click="sign_open">签字</el-button> -->
        <!-- <el-button v-if="record_ifsign == 0" type="primary" @click="SignSend">确定</el-button> -->
        <!-- <el-button type="primary" @click="handlePrint">打印</el-button> -->
        <el-button @click="dialogFormVisibleInfo = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog :close-on-click-modal="false" title="打印" :visible.sync="dialogFormVisibleFire"> -->
    <fire v-show="false" ref="fire_" />

    <el-dialog :close-on-click-modal="false" title="火化炉列表" :visible.sync="dialogFormVisibleper" append-to-body>
      <el-form
        ref="furnaces"
        :rules="furnaces"
        :inline="true"
        :model="furnace"
        status-icon
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="请选择炉型" prop="setServer">
          <el-radio-group v-model="furnace.setServer">
            <el-radio
              v-for="(value, item) in getservice"
              :key="item"
              border
              :label="value.id"
            >{{ value.title }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleper = false">取消</el-button>
        <el-button type="primary" @click="updateDataPer()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  commonCremation,
  infoCremation,
  addfire,
  listfire,
  editfire,
  signfire,
  statefire,
  checkfire,
  sendfire,
  cremationserial,
  servicessign,
  createcarcommon
} from '@/api/manage'
import axios from 'axios'
import Pagination from '@/components/Pagination'
import service from '@/components/Service'
// import { managerlist } from '@/api/vocational'
import { listfurnace } from '@/api/setting'
import fire from '@/components/Print/fire'
import { vuexData } from '@/utils/mixin'
import e560 from '@/components/E560'
export default {
  name: 'VueGarden',
  components: { Pagination, service, e560, fire },
  mixins: [vuexData],
  data() {
    return {
      list: null,
      total: 0,
      recetype: null,
      setServer: [],
      getservice: [],
      activeName: 'info',
      dialogFormVisibleGo: false,
      dialogFormVisibleInfo: false,
      dialogFormVisibleper: false,
      // dialogFormVisibleFire: false,
      dialogFormSign: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        search_data: '',
        sort: 'add_time',
        order: 'desc'
      },
      sex: ['男', '女'],
      send: {
        name: '',
        sex: '',
        age: '',
        address: '',
        recetype: '',
        outtime: null,
        linkman: '',
        totalprice: '',
        linkphone: '',
        driver: '',
        cid: '',
        c_id: '',
        operator: '',
        remark: '',
        oid: ''
      },
      furnace: {
        setServer: '',
        state: '',
        id: '',
        oid: ''
      },
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
      server: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '办理火化',
        create: '创建'
      },
      rules: {

      },
      furnaces: {
        setServer: [
          { required: true, message: '请至少选择一个火化炉', trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  watch: {

  },
  created() {
    this.getList()
    createcarcommon().then(res => {
      this.recetype = res.data.recetype
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      listfire(this.listQuery)
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
    getCommon(v) {
      commonCremation().then(res => {
        this.server = res.data.services
        const data = {
          type: v,
          server: this.server
        }
        this.$refs.server.showService(data)
      })
    },

    handlePrint() {
      console.log(this.dataForm)
      this.$refs.fire_.init(this.dataForm)
    },
    getCard(val) {
      var url = 'http://127.0.0.1:38088/card=idcard'
      var params = ''
      axios
        .post(url, params)
        .then(res => {
          if (res.data.code == 0) {
            var info = res.data.IDCardInfo
            this.$notify.success({
              title: '成功',
              message: '身份信息获取成功'
            })
            if (val == 0) {
              this.dataForm.name = info.name
              this.dataForm.sex = info.sex
              this.dataForm.card = info.cardID
              this.dataForm.registered = info.address
            } else {
              this.dataForm.linkman = info.name
              this.dataForm.linksex = info.sex
            }
          } else {
            this.$notify.error({
              title: '获取身份信息失败',
              message: res.msg
            })
          }
        })
        .catch(res => {
          this.$notify.error({
            title: '未检测到系统设备',
            message: '网络错误'
          })
        })
    },
    handleSign(row) {
      this.dataForm = Object.assign({}, row)
      const data = { id: row.id, oid: row.oid, type: 2 }
      infoCremation(data).then(res => {
        var server = []
        if (res.data.services.length > 0) {
          res.data.services.forEach(v => {
            server.push(v.services)
          })
        }
        this.server = [].concat.apply([], server)
        this.dialogFormVisibleInfo = true
        // this.signatureid = row.id
        // this.record_sign = row.signature
        // this.record_ifsign = row.ifsignature
      })
    },
    solo(arr) {
      var editRow = []
      arr.services.forEach((v, k) => {
        editRow.push(v.services)
      })
      return [].concat.apply([], editRow)
    },
    service_data(data) {
      this.dataForm.server = data
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        name: '',
        sex: '',
        age: '',
        card: '',
        registered: '',
        reason: '',
        linkman: '',
        relation: '',
        linkphone: '',
        dietime: null,
        nation: '',
        number: '',
        linksex: '',
        operator: '',
        c_remark: '',
        haulier: '',
        server: null
      }
    },
    createGoData() {
      sendfire(this.send).then(res => {
        if (res.code == 0) {
          this.getList()
          this.dialogFormVisibleGo = false
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }
      })
    },
    handleSi(v) {
      const data = {
        oid: v.oid,
        branch: this.info.branch
      }
      this.$confirm('是否签收?', '提示', {
        confirmButtonText: '签收',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        servicessign(data).then(res => {
          this.getList()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },

    updateDataPer() {
      this.$refs['furnaces'].validate((valid) => {
        if (valid) {
          const data = {
            crepelope: this.info.id,
            fid: this.furnace.setServer,
            state: this.furnace.state,
            id: this.furnace.id,
            oid: this.furnace.oid
          }
          statefire(data).then(res => {
            if (res.code == 0) {
              this.getList()
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
            }
            this.dialogFormVisibleper = false
          })
        }
      })
    },
    handleQu(v) {
      this.$confirm('是否取灰?', '提示', {
        confirmButtonText: '取灰',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          id: v.id,
          oid: v.oid,
          fid: v.fid,
          state: 3
        }
        statefire(data).then(res => {
          if (res.code == 0) {
            this.getList()
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    // handleOver(row) {
    //   this.$confirm('火化是否完成?', '提示', {
    //     confirmButtonText: '完成',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     const data = {
    //       id: row.id,
    //       c_id: row.c_id,
    //       state: row.c_state
    //     }
    //     statefire(data).then(res => {
    //       if (res.code == 0) {
    //         this.getList()
    //         this.$message({
    //           type: 'success',
    //           message: '操作成功!'
    //         })
    //       }
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '操作取消'
    //     })
    //   })
    // },
    handleFire(row) {
      this.furnace.setServer = ''
      this.furnace.state = row.state
      this.furnace.id = row.id
      this.furnace.oid = row.oid
      this.dialogFormVisibleper = true
      listfurnace().then(res => {
        this.getservice = res.data.data
        this.$forceUpdate()
      })
      // this.$prompt('请输入火化牌号', '信息', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   inputPattern: /^[0-9]*$/,
      //   inputErrorMessage: '请输入数字'
      // }).then(({ value }) => {
      //   const data = {
      //     id: row.id,
      //     c_id: row.c_id,
      //     state: row.c_state,
      //     number: value
      //   }
      //   statefire(data).then(res => {
      //     if (res.code == 0) {
      //       this.getList()
      //       this.$message({
      //         type: 'success',
      //         message: '操作成功!'
      //       })
      //     }
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '操作取消'
      //   })
      // })
    },
    handleCreate() {
      this.resetForm()
      this.getCommon(0)
      this.activeName = 'info'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        const data = {
          server: this.server
        }
        this.$refs.server.showService(data)
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addfire(this.dataForm)
            .then(res => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '添加成功'
              })
            })
            .catch(res => {
              this.$notify.error({
                title: '失败',
                message: res.msg
              })
            })
        }
      })
    },
    handleClick() {

    },
    SignSend() {
      const data = { signature: this.record_sign, id: this.signatureid }
      signfire(data).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: '成功',
            message: '操作成功'
          })
          this.getList()
          this.dialogFormVisibleInfo = false
        } else {
          this.$notify.error({
            title: '失败',
            message: res.msg
          })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dataForm = {
        name: row.o_name || '',
        sex: row.o_sex || '',
        age: row.o_age || '',
        card: row.o_card || '',
        registered: row.o_registered || '',
        reason: row.o_reason || '',
        dietime: row.o_dietime || '',
        linkman: row.o_linkman || '',
        relation: row.o_relation || '',
        linkphone: row.o_linkphone || '',
        nation: row.o_nation || '',
        number: row.number || '',
        linksex: row.o_linksex || '',
        operator: row.operator || '',
        c_remark: row.remark || '',
        haulier: row.haulier || '',
        id: row.id || '',
        oid: row.oid || '',
        server: null
      }
      this.getCommon(1)
      const data = { id: row.id, oid: row.oid, type: 1 }
      infoCremation(data).then(res => {
        this.$refs.server.editService(res.data.services)
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.dataForm.operator = this.info.realname
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          editfire(this.dataForm)
            .then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新成功'
              })
            })
            .catch(res => {
              this.$notify.error({
                title: '失败',
                message: res.msg
              })
            })
        }
      })
    }
    // handleDelete(row) {
    //   delobituary(row)
    //     .then(res => {
    //       this.$confirm('您确认删除吗?', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //       }).then(() => {
    //         const index = this.list.indexOf(row)
    //         this.list.splice(index, 1)
    //         this.$message({
    //           type: 'success',
    //           message: '删除成功!'
    //         })
    //       }).catch(() => {
    //         this.$message({
    //           type: 'info',
    //           message: '已取消删除'
    //         })
    //       })
    //     })
    //     .catch(res => {
    //       this.$notify.error({
    //         title: '失败',
    //         message: res.msg
    //       })
    //     })
    // }
  }
}
</script>

