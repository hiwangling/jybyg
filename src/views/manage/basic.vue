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
      <el-table-column align="center" label="编号" prop="papers" width="60" />
      <el-table-column align="center" label="逝者姓名" prop="name" />
      <el-table-column align="center" label="身份证" prop="card" />
      <el-table-column align="center" label="低保类型" prop="basic">
        <template slot-scope="scope">
          {{ scope.row.basic | basic_list }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="乡镇" prop="villages">
        <template slot-scope="scope">
          {{ scope.row.villages | villages_list }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="火化费" prop="oneprice" />
      <el-table-column align="center" label="遗体消毒费" prop="twoprice" />
      <el-table-column align="center" label="冰棺,车费" prop="threeprice" />
      <el-table-column align="center" label="总价" prop="totalprice" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="160">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
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
        label-width="100px"
      >
        <el-form-item label="证件编号" prop="papers">
          <el-input v-model="dataForm.papers" />
        </el-form-item>
        <el-form-item label="逝者姓名" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="火化费" prop="oneprice">
          <el-input v-model="dataForm.oneprice" />
        </el-form-item>
        <el-form-item label="遗体消毒费" prop="twoprice">
          <el-input v-model="dataForm.twoprice" />
        </el-form-item>
        <el-form-item label="冰棺,车费" prop="threeprice">
          <el-input v-model="dataForm.threeprice" />
        </el-form-item>
        <el-form-item label="总价" prop="totalprice">
          <el-input v-model="dataForm.totalprice" />
        </el-form-item>
        <el-form-item label="乡镇" prop="villages">
          <el-select v-model="dataForm.villages" placeholder="乡镇" clearable class="filter-item" style="width:185px">
            <el-option v-for="(item,value,index) in villages" :key="index" :label="item" :value="value + 1" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { financeDerateList, financeDerateEdit, financeDerateDel } from '@/api/manage'
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
        papers: '',
        oneprice: '',
        twoprice: '',
        threeprice: '',
        totalprice: '',
        operator: '',
        villages: '',
        remark: '',
        id: ''
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
      financeDerateList(this.listQuery)
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
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
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
          financeDerateEdit(this.dataForm)
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
      financeDerateDel(row)
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
