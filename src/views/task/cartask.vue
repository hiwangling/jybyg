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
      <el-table-column align="center" label="逝者姓名" prop="name" width="120" />
      <el-table-column align="center" label="联系人" prop="linkman" width="120" />
      <el-table-column align="center" label="联系电话" prop="linkphone" width="120" />
      <el-table-column align="center" label="出车时间" prop="outtime" width="160" />
      <el-table-column align="center" label="预约地址" prop="address" />
      <el-table-column align="center" label="接运类型" prop="recetype" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.recetype | carFilter"> {{ scope.row.recetype | recetype_list }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="state" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | carFilter"> {{ scope.row.state | obituary_list }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleCarStatus(scope.row)"
          >  {{ scope.row.state | carState }}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="handleLook(scope.row)">详情</el-button>
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

    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <div class="bury_car">
        <h1 class="bury_car_h1">逝者信息</h1>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者姓名 : </span>{{ dataForm.name }}</p>
              <p><span> 出车时间 : </span>{{ dataForm.outtime }}</p>
              <p><span> 接运地址 : </span>{{ dataForm.address }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 联系人 : </span>{{ dataForm.linkman }}</p>
              <p><span> 接运类型 : </span>{{ dataForm.recetype | recetype_list }}</p>
              <p><span> 司机 : </span>{{ dataForm.username }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 联系电话 : </span>{{ dataForm.linkphone }}</p>
              <p><span> 接运价格 : </span>{{ dataForm.totalprice }}</p>
              <p><span> 操作人 : </span>{{ dataForm.operator }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="bury_car" style="border:1px solid #23C6C8;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#23C6C8;color:#fff">接运服务</h1>
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
        <el-button @click="dialogFormVisible = false">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="编辑信息" :visible.sync="dialogFormVisibleWX">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="基本信息" name="info">

          <el-form
            ref="wx"
            :rules="rules"
            :inline="true"
            :model="wx"
            status-icon
            label-position="left"
            label-width="100px"
          >
            <el-form-item label="逝者姓名" prop="name">
              <el-input v-model="wx.name" :disabled="true" />
            </el-form-item>
            <el-form-item label="接运地址" prop="address">
              <el-input v-model="wx.address" />
            </el-form-item>
            <el-form-item label="出车时间" prop="outtime">
              <el-date-picker
                v-model="wx.outtime"
                type="datetime"
                style="width:180px"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="wx.linkman" :disabled="true" />
            </el-form-item>
            <el-form-item label="联系电话" prop="linkphone">
              <el-input v-model="wx.linkphone" :disabled="true" />
            </el-form-item>
            <el-form-item label="接运类型" prop="recetype">
              <el-select v-model="wx.recetype" placeholder="" clearable class="filter-item" style="width:185px" :disabled="true">
                <el-option v-for="(item,value,index) in recetype" :key="index" :label="item" :value="Number(value)" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="选择车辆" prop="cid">
              <el-select v-model="dataForm.cid" placeholder="" clearable class="filter-item" style="width:185px" @change="CarBind">
                <el-option v-for="(item,value,index) in car" :key="index" :label="item.number" :value="item.id" />
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="司机" prop="driver">
              <el-input v-model="wx.driver" />
            </el-form-item> -->
            <el-form-item label="选择司机" prop="driver">
              <el-select v-model="wx.driver" placeholder="" clearable class="filter-item" style="width:185px" @change="CarBind">
                <el-option v-for="(item,value,index) in getservice" :key="index" :label="item.realname" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="接运价格" prop="totalprice">
              <el-input v-model="wx.totalprice" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="wx.remark" :disabled="true" type="textarea" :rows="2" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleWX = false">取消</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>

    </el-dialog>
    <!-- <el-dialog :close-on-click-modal="false" title="信息" :visible.sync="dialogFormVisibleWX">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="基本信息" name="info">
          <el-form
            ref="wx"
            :rules="rules"
            :inline="true"
            :model="wx"
            status-icon
            label-position="left"
            label-width="100px"
          >
            <el-form-item label="警察意见" prop="copidea">
              <el-input v-model="wx.copidea" />
            </el-form-item>
            <el-form-item label="警察签字" prop="copname">
              <el-input v-model="wx.copname" />
            </el-form-item>
            <el-form-item label="警察电话" prop="copphone">
              <el-input v-model="wx.copphone" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="wx.remark" />
            </el-form-item>
            <el-form-item label="签字" prop="signature">
              <el-input v-model="wx.signature" />
            </el-form-item>
            <el-form-item label="操作人" prop="operator">
              <el-input v-model="wx.operator" />
            </el-form-item>
            <el-form-item label="无名尸" prop="unknown" style="width:100%">
              <el-radio-group v-model="wx.unknown">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="服务类型" prop="servertype">
              <el-radio-group v-model="wx.servertype">
                <el-radio :label="1">冰冻</el-radio>
                <el-radio :label="2">守灵</el-radio>
                <el-radio :label="3">火化</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="选择服务" name="second">
          <service ref="server" @service_data="service_data" />
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <span v-if="record_sign" class="sign_" style="bottom:20px">警察签字：<img :src="record_sign" alt="" @click="dialogFormSign = true"> </span>
        <el-button type="primary" @click="sign_open()">签字</el-button>
        <el-button @click="dialogFormVisibleWX = false">取消</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="签名" :visible.sync="dialogFormVisibleSign">
      <sign @cancel="cancel" @imgData="imgData" />
    </el-dialog> -->
  </div>
</template>
<script>
import {
  createcarcommon,
  editinfoService,
  editsends
} from '@/api/manage'
import { listCartask, editCarstatus } from '@/api/task'
import sign from '@/components/Sign'
import { managerlist } from '@/api/vocational'
import Pagination from '@/components/Pagination'
import service from '@/components/Service'
import { vuexData } from '@/utils/mixin'
export default {
  name: 'VueGarden',
  components: { Pagination, service, sign },
  mixins: [vuexData],
  data() {
    return {
      car: null,
      recetype: null,
      record_sign: '',
      server: null,
      activeName: 'info',
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        search_data: '',
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: '',
        type: '',
        state: ''
      },

      dialogFormVisible: false,
      dialogFormVisibleWX: false,
      dialogFormVisibleSign: false,
      wx: {
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
        operator: '',
        remark: '',
        server: null
      },
      dialogStatus: '',
      textMap: {
        update: '查看',
        create: '创建'
      },
      rules: {
        servertype: [
          { required: true, message: '服务类型不能为空', trigger: 'change' }
        ]

      }
    }
  },
  computed: {},
  created() {
    this.getList()
    const data = {
      branch: 2
    }
    managerlist(data).then(res => {
      this.getservice = res.data
      this.$forceUpdate()
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      listCartask(this.listQuery)
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    imgData(v) {
      this.record_sign = v
    },
    sign_open() {
      this.record_sign = ''
      this.dialogFormVisibleSign = true
    },
    getCommon(v) {
      createcarcommon().then(res => {
        this.car = res.data.car
        this.recetype = res.data.recetype
        // console.log(this.recetype)
        this.wx.server = res.data.services
        // const data = {
        //   server: this.server,
        //   type: v
        // }
        // this.$refs.server.showService(data)
      })
    },
    handleEdit(v) {
      console.log(v)
      this.wx = Object.assign({}, v)
      this.wx.driver = Number(this.wx.driver)
      this.getCommon(1)
      this.dialogFormVisibleWX = true
      // console.log(v)
      // this.activeName = 'info'
      // this.resetForm()
      // this.wx.operator = this.info.realname
      // this.wx.remark = v.remark
      // this.wx.id = v.id
      // this.wx.oid = v.oid
      // this.wx.name = v.name
      // this.wx.servertype = v.servertype
      // this.wx.unknown = v.unknown
      // this.wx.copname = v.copname
      // this.wx.copphone = v.copphone
      // this.wx.copidea = v.copidea
      // this.dialogFormVisibleWX = true
      // this.getCommon(1)
      // const data = { oid: v.oid, id: v.id, type: 1 }
      // editinfoService(data).then(res => {
      //   this.$refs.server.editService(res.data.services)
      //   this.wx.server = res.data.services
      // })
    },
    updateData() {
      this.$refs['wx'].validate(valid => {
        if (valid) {
          editsends(this.wx)
            .then(res => {
              this.getList()
              this.dialogFormVisibleWX = false
              this.$notify.success({
                title: '成功',
                message: '操作成功'
              })
            })
            .catch(res => {
              this.$notify.error({
                title: '失败',
                message: res.msg
              })
            })
        } else {
          return false
        }
      })
    },
    // resetForm() {
    //   this.wx = {
    //     servertype: '',
    //     unknown: 1,
    //     copidea: '',
    //     copname: '',
    //     copphone: '',
    //     name: '',
    //     remark: '',
    //     operator: '',
    //     id: '',
    //     oid: '',
    //     signature: '',
    //     server: null
    //   }
    // },
    service_data(data) {
      this.wx.server = data
    },
    carState(v) {
      const statusMap = { 1: '签收', 2: '出车', 3: '出车', 4: '回馆' }
      return statusMap[v]
    },
    cancel() {
      this.dialogFormVisibleSign = false
    },
    handleCarStatus(row) {
      var state = this.carState(row.state)
      this.$confirm(
        `是否确认${state}?`,
        '操作',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'confirmTop'
        }
      )
        .then(() => {
          const data = {
            id: row.id,
            oid: row.oid,
            cid: row.cid,
            state: row.state
          }
          editCarstatus(data)
            .then(res => {
              this.getList()
              this.$message({
                type: 'success',
                message: '操作成功'
              })
            })
            .catch(res => {
              this.$message({
                type: 'warning',
                message: res.msg
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    solo(arr) {
      var editRow = []
      arr.forEach((v, k) => {
        editRow.push(v.services)
      })
      return [].concat.apply([], editRow)
    },
    handleLook(row) {
      this.dataForm = Object.assign({}, row)
      const data = { oid: row.oid, id: row.id, type: 2 }
      editinfoService(data).then(res => {
        var server = []
        if (res.data.services.length > 0) {
          server = [].concat.apply([], res.data.services)
        }
        this.server = this.solo(server)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      })
    }
  }
}
</script>

