<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.startime"
        style="width:180px"
        type="month"
        value-format="yyyy-MM"
        placeholder="选择月"
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
      <el-table-column align="center" label="上月库存" prop="repertory" />
      <el-table-column align="center" label="本月进油" prop="enter" />
      <el-table-column align="center" label="总油" prop="sumup" />
      <el-table-column align="center" label="平板炉应用油" prop="puse" />
      <el-table-column align="center" label="拣灰炉应用油" prop="juse" />
      <el-table-column align="center" label="平板炉实际用油" prop="psuse" />
      <el-table-column align="center" label="拣灰炉实际用油" prop="jsuse" />
      <el-table-column align="center" label="节油" prop="economy" />
      <el-table-column align="center" label="试炉用油" prop="syuse" />
      <el-table-column align="center" label="本月存油" prop="deposit" />
      <el-table-column align="center" label="制表人" prop="operator" />
      <el-table-column align="center" label="制表时间" prop="operatortime" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <el-button
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
      <el-form
        ref="dataForm"
        :rules="rules"
        :inline="true"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="120px"
      >
        <el-form-item label="上月库存" prop="repertory">
          <el-input v-model="dataForm.repertory" />
        </el-form-item>
        <el-form-item label="本月进油" prop="enter">
          <el-input v-model="dataForm.enter" />
        </el-form-item>
        <el-form-item label="总油" prop="sumup">
          <el-input v-model="dataForm.sumup" />
        </el-form-item>
        <el-form-item label="平板炉应用油" prop="puse">
          <el-input v-model="dataForm.puse" />
        </el-form-item>
        <el-form-item label="拣灰炉应用油" prop="juse">
          <el-input v-model="dataForm.juse" />
        </el-form-item>
        <el-form-item label="平板炉实际用油" prop="psuse">
          <el-input v-model="dataForm.psuse" />
        </el-form-item>
        <el-form-item label="拣灰炉实际用油" prop="jsuse">
          <el-input v-model="dataForm.jsuse" />
        </el-form-item>
        <el-form-item label="节油" prop="economy">
          <el-input v-model="dataForm.economy" />
        </el-form-item>
        <el-form-item label="试炉用油" prop="syuse">
          <el-input v-model="dataForm.syuse" />
        </el-form-item>
        <el-form-item label="本月存油" prop="deposit">
          <el-input v-model="dataForm.deposit" />
        </el-form-item>
        <el-form-item label="制表人" prop="operator">
          <el-input v-model="dataForm.operator" />
        </el-form-item>
        <el-form-item label="制表时间" prop="operatortime">
          <el-date-picker
            v-model="dataForm.operatortime"
            style="width:180px"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <oil v-show="false" ref="oil" />
  </div>
</template>
<script>
import { oilstatlist, oilstatadd, oilstatedit, oilstatdel } from '@/api/merits'
import Pagination from '@/components/Pagination'
import oil from '@/components/Print/oil'
export default {
  name: 'VueGarden',
  components: { Pagination, oil },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        startime: '',
        endtime: '',
        search_data: '',
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        repertory: '',
        enter: '',
        sumup: '',
        puse: '',
        juse: '',
        psuse: '',
        jsuse: '',
        economy: '',
        syuse: '',
        deposit: '',
        operator: '',
        operatortime: null
      },
      dialogFormVisible: false,
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
  },
  methods: {
    getList() {
      this.listLoading = true
      oilstatlist(this.listQuery)
        .then(res => {
          this.list = res.data.data
          this.total = res.data.total || 0

          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        repertory: '',
        enter: '',
        sumup: '',
        puse: '',
        juse: '',
        psuse: '',
        jsuse: '',
        economy: '',
        syuse: '',
        deposit: '',
        operator: '',
        operatortime: null
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          oilstatadd(this.dataForm)
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
    handlePrint(row) {
      this.$refs.oil.init(row)
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          oilstatedit(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
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
      oilstatdel(row)
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
    }
  }
}
</script>
