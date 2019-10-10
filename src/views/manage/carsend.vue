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
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
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
      <el-table-column align="center" label="状态" prop="state" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | carFilter"> {{ scope.row.state | obituary_list }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" width="220">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.state == 1 || scope.row.state == 2 || scope.row.state == 3"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handlePrint(scope.row)"
          >打印</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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
            <!-- <el-form-item label="逝者性别" prop="sex">
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
            </el-form-item> -->
            <el-form-item label="接运地址" prop="address">
              <el-input v-model="dataForm.address" />
            </el-form-item>
            <el-form-item label="出车时间" prop="outtime">
              <el-date-picker
                v-model="dataForm.outtime"
                type="datetime"
                style="width:185px"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              />
            </el-form-item>
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="dataForm.linkman" />
            </el-form-item>
            <el-form-item label="联系电话" prop="linkphone">
              <el-input v-model="dataForm.linkphone" />
            </el-form-item>
            <el-form-item label="接运类型" prop="recetype">
              <el-select v-model="dataForm.recetype" placeholder="" clearable class="filter-item" style="width:185px">
                <el-option v-for="(item,value,index) in recetype" :key="index" :label="item" :value="Number(value)" />
              </el-select>
            </el-form-item>
            <el-form-item label="选择司机" prop="driver">
              <el-select v-model="dataForm.driver" placeholder="" clearable class="filter-item" style="width:185px" @change="CarBind">
                <el-option v-for="(item,value,index) in getservice" :key="index" :label="item.realname" :value="item.id" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="司机" prop="driver">
              <el-input v-model="dataForm.driver" />
            </el-form-item> -->
            <el-form-item label="接运价格" prop="totalprice">
              <el-input v-model="dataForm.totalprice" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="dataForm.remark" type="textarea" :rows="2" />
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
    <carsend v-show="false" ref="carsend" />
  </div>
</template>
<script>
import {
  listcarsend,
  createcarsend,
  deletecarsend,
  createcarcommon,
  editinfoService,
  editsend
} from '@/api/manage'
import { managerlist } from '@/api/vocational'
import Pagination from '@/components/Pagination'
import carsend from '@/components/Print/carsend'
import service from '@/components/Service'
import { vuexData } from '@/utils/mixin'
export default {
  name: 'VueGarden',
  components: { Pagination, service, carsend },
  mixins: [vuexData],
  data() {
    return {
      list: null,
      car: null,
      server: null,
      getservice: null,
      serverPrint: null,
      recetype: null,
      activeName: 'info',
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        search_data: '',
        sort: 'add_time',
        order: 'desc'
      },
      sex: ['男', '女'],
      dataForm: {
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
        oid: null,
        operator: '',
        remark: '',
        server: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        recetype: [
          { required: true, message: '请选择车辆', trigger: 'change' }
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
      listcarsend(this.listQuery)
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
      createcarcommon().then(res => {
        this.car = res.data.car
        this.recetype = res.data.recetype
        this.server = res.data.services
        const data = {
          server: this.server,
          type: v
        }
        this.$refs.server.showService(data)
      })
    },
    handleShow(val) {
      const data = {
        clear: val,
        server: this.server
      }
      this.$refs.server.showService(data)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    service_data(data) {
      this.dataForm.server = data
    },
    handlePrint(row) {
      const data = { oid: row.oid, id: row.id, type: 2 }
      editinfoService(data).then(res => {
        var server = []
        server = [].concat.apply([], res.data.services)
        this.serverPrint = this.solo(server)
        const data = {
          list: res.data.list,
          server: this.serverPrint
        }
        this.$refs.carsend.init(data)
      })
    },
    resetForm() {
      this.dataForm = {
        name: '',
        sex: '',
        age: '',
        address: '',
        outtime: null,
        linkman: '',
        cid: '',
        oid: null,
        recetype: '',
        totalprice: '',
        linkphone: '',
        driver: '',
        operator: '',
        remark: '',
        server: null
      }
    },
    CarBind(id) {
      for (const i of this.car) {
        if (i.id === id) {
          this.dataForm.driver = i.chauffeur
          this.dataForm.totalprice = i.price
          break
        }
      }
    },
    handleCreate() {
      this.resetForm()
      this.getCommon(0)
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
      this.dataForm.operator = this.info.realname
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createcarsend(this.dataForm)
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
    handleUpdate(row) {
      this.activeName = 'info'
      this.dataForm = Object.assign({}, row)
      this.dataForm.driver = Number(this.dataForm.driver)
      console.log(this.dataForm)
      this.getCommon(1)
      const data = { oid: row.oid, id: row.id, type: 1 }
      editinfoService(data).then(res => {
        this.$refs.server.editService(res.data.services)
        this.dataForm.server = res.data.services
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // handleUpdates(row) {
    //   this.activeName = 'info'
    //   this.dataForm = Object.assign({}, row)
    //   this.dataForm.outtime = null
    //   this.dataForm.recetype = ''
    //   this.dataForm.totalprice = ''
    //   this.getCommon(1)
    //   const data = { oid: row.oid, id: row.id, type: 1 }
    //   editinfoService(data).then(res => {
    //     this.$refs.server.editService(res.data.services)
    //     this.dataForm.server = res.data.services
    //   })
    //   this.dialogStatus = 'updates'
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    updateData() {
      // var editRow = []
      // this.dataForm.server.forEach((v, k) => {
      //   editRow.push(v.services)
      // })
      // this.dataForm.server = [].concat.apply([], editRow)
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          editsend(this.dataForm)
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
    },
    handleDelete(row) {
      deletecarsend(row)
        .then(res => {
          this.$confirm('您确认删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        })
        .catch(res => {
          this.$notify.error({
            title: '失败',
            message: res.msg
          })
        })
    },
    solo(arr) {
      var editRow = []
      arr.forEach((v, k) => {
        editRow.push(v.services)
      })
      return [].concat.apply([], editRow)
    }
    // handleLook(row) {
    //   const data = { oid: row.oid, id: row.id, type: 2 }
    //   editinfoService(data).then(res => {
    //     var server = []
    //     if (res.data.services.length > 0) {
    //       server = [].concat.apply([], res.data.services)
    //     }
    //     this.serverPrint = this.solo(server)
    //   })
    // }
    // handleLook(row) {
    //   this.dataForm = Object.assign({}, row)
    //   const data = { oid: row.oid, id: row.id, type: 2 }
    //   editinfoService(data).then(res => {
    //     var server = []
    //     if (res.data.services.length > 0) {
    //       server = [].concat.apply([], res.data.services)
    //     }
    //     this.server = this.solo(server)
    //     this.dialogStatus = 'update'
    //     this.dialogFormVisible = true
    //   })
    // }
  }
}
</script>
