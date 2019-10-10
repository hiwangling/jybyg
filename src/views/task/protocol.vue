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
        v-permission="['POST /api/v1/cemetery_classify/g_add']"
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
      <el-table-column align="center" label="逝者姓名" prop="name" />
      <el-table-column align="center" label="联系人" prop="linkman" />
      <el-table-column align="center" label="联系电话" prop="linkphone" />
      <el-table-column align="center" label="火化编号" prop="c_serial" />
      <el-table-column align="center" label="状态" prop="state" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | carFilter"> {{ scope.row.state | obituary_list }}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="操作员" prop="operator" /> -->
      <!-- <el-table-column align="center" label="状态" prop="state" /> -->
      <el-table-column align="center" label="操作" class-name="small-padding" width="220">
        <template slot-scope="scope">
          <!-- <el-button
            v-permission="['POST /api/v1/cemetery_classify/g_edit']"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >办理</el-button> -->
          <el-button
            v-if="scope.row.sign == 1"
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="handleSi(scope.row)"
          >签收</el-button>
          <el-button
            icon="el-icon-search"
            type="primary"
            size="mini"
            @click="handleSign(scope.row)"
          >详情</el-button>
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

    <el-dialog :close-on-click-modal="false" title="查看" :visible.sync="dialogFormVisibleInfo">
      <!-- <h3 style="text-align: center;font-size:22px;font-weight: 100; margin: 0 0 15px 0">当阳市殡仪馆火化及申请书</h3> -->
      <div class="bury_car">
        <h1 class="bury_car_h1">逝者信息</h1>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者姓名 : </span>{{ dataForm.name }}</p>
              <p><span> 逝者民族 : </span>{{ dataForm.ation }}</p>
              <p><span> 户口所在地 : </span>{{ dataForm.registered }}</p>
              <p><span> 联系人性别 : </span>{{ dataForm.linksex }}</p>
              <p><span> 备注 : </span>{{ dataForm.remark }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者性别 : </span>{{ dataForm.sex }}</p>
              <p><span> 死亡原因 : </span>{{ dataForm.reason }}</p>
              <p><span> 死亡时间 : </span>{{ dataForm.dietime }}</p>
              <p><span> 联系人电话 : </span>{{ dataForm.linkphone }}</p>
              <p><span> 操作员 : </span>{{ dataForm.operator }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者年龄 : </span>{{ dataForm.age }}</p>
              <p><span> 身份证 : </span>{{ dataForm.card }}</p>
              <p><span> 联系人 : </span>{{ dataForm.linkman }}</p>
              <p><span> 与逝者关系 : </span>{{ dataForm.relation }}</p>

            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="server ? server.length > 0 : false" class="bury_car" style="border:1px solid #23C6C8;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#23C6C8;color:#fff">礼宾服务</h1>
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
        <el-button @click="dialogFormVisibleInfo = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  servicessign
} from '@/api/manage'
import { protocollist, protocolinfo } from '@/api/task'
import Pagination from '@/components/Pagination'
import { vuexData } from '@/utils/mixin'
export default {
  name: 'VueGarden',
  components: { Pagination },
  mixins: [vuexData],
  data() {
    return {
      list: null,
      total: 0,
      server: null,
      activeName: 'info',
      totalprice: 0,
      dialogFormVisibleInfo: false,
      dialogFormVisibleper: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        search_data: '',
        sort: 'add_time',
        order: 'desc'
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
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {

      }
    }
  },
  computed: {},
  watch: {

  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      protocollist(this.listQuery)
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
    handleSi(v) {
      const data = {
        oid: v.id,
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },

    handleSign(row) {
      this.dataForm = Object.assign({}, row)
      const data = { id: row.id, type: 1 }
      protocolinfo(data).then(res => {
        var server = []
        if (res.data.services.length > 0) {
          res.data.services.forEach(v => {
            server.push(v.services)
          })
        }
        this.server = [].concat.apply([], server)
        this.dialogFormVisibleInfo = true
      })
    }
  }
}
</script>

