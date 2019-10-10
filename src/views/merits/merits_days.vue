<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.startime"
        style="width: 200px"
        class="filter-item"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="开始时间"
      />
      <!-- <el-date-picker
        v-model="listQuery.endtime"
        style="width: 200px"
        class="filter-item"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="结束时间"
      /> -->
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
      <el-button
        class="filter-item"
        type="primary"

        @click="print"
      >打印</el-button>
    </div>

    <!-- 查询结果 -->
    <div ref="print">
      <div style="margin:10px 0;color:#666;display:flex;justify-content:space-between"><span>操作人: {{ operator }}</span><span> 操作日期：{{ operatortime }}</span></div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="正在查询中。。。"
        border
        fit
        highlight-current-row
      >
        <el-table-column
          type="index"
          width="100"
          :index="indexMethod"
        />
        <el-table-column align="center" label="1号" prop="start" />
        <el-table-column align="center" label="2号" prop="end" />
        <el-table-column align="center" label="3号" prop="number" />
        <el-table-column align="center" label="4号" prop="thrift" />
      <!-- <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="160">
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
      </el-table-column> -->
      </el-table>
      <div style="margin:0 0 10px 0;color:#666;border:1px solid #dfe6ec;border-right:none;height:50px;line-height:50px">
        <span style="display:inline-block;width:100px;border-right:1px solid #dfe6ec;padding-left:10px">合计</span>
        <span style="display:inline-block;width:300px; padding-left:30px"> {{ count_1 }}</span>

      </div>
    </div>
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
        <el-form-item label="请选择人员" prop="setServer">
          <el-select v-model="dataForm.uid" placeholder="请选择" style="width:180px">
            <el-option
              v-for="(value, item) in pepole"
              :key="item"
              :label="value.realname"
              :value="value.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="请选择炉型" prop="setServer">
          <el-select v-model="dataForm.fid" placeholder="请选择" style="width:180px">
            <el-option
              v-for="(value, item) in getservice"
              :key="item"
              :label="value.id"
              :value="value.title"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="起始油量" prop="start">
          <el-input v-model="dataForm.start" />
        </el-form-item>
        <el-form-item label="截止油量" prop="end">
          <el-input v-model="dataForm.end" />
        </el-form-item>
        <el-form-item label="具" prop="number">
          <el-input v-model="dataForm.number" />
        </el-form-item>
        <el-form-item label="实际油量" prop="reality">
          <el-input v-model="dataForm.reality" @focus="oil" />
        </el-form-item>
        <el-form-item label="操作人" prop="operator">
          <el-input v-model="dataForm.operator" />
        </el-form-item>
        <el-form-item label="操作时间" prop="operatortime">
          <el-date-picker
            v-model="dataForm.operatortime"
            style="width: 180px"
            class="filter-item"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始时间"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { oillist, oiladd, oiledit, oildel } from '@/api/merits'
import Pagination from '@/components/Pagination'
import { managerlist } from '@/api/vocational'
import { listfurnace } from '@/api/setting'
export default {
  name: 'VueGarden',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      count_1: '',
      count_2: '',
      pepole: [],
      getservice: [],
      operator: '',
      operatortime: '',
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        search_data: '',
        startime: null,
        endtime: null,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        uid: '',
        fid: '',
        start: '',
        end: '',
        number: '',
        reality: '',
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
    listfurnace().then(res => {
      this.getservice = res.data.data
    })
    const data = {
      branch: 3
    }
    managerlist(data).then(res => {
      this.pepole = res.data
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      oillist(this.listQuery)
        .then(res => {
          console.log(res.data[0])
          var arr = [
            {
              start: res.data[0].start,
              end: res.data[1].start,
              number: res.data[2].start,
              thrift: res.data[3].start
            }, {
              start: res.data[0].end,
              end: res.data[1].end,
              number: res.data[2].end,
              thrift: res.data[3].end
            }, {
              start: res.data[0].number,
              end: res.data[1].number,
              number: res.data[2].number,
              thrift: res.data[3].number
            }, {
              start: res.data[0].thrift,
              end: res.data[1].thrift,
              number: res.data[2].thrift,
              thrift: res.data[3].thrift
            }
          ]
          res.data.forEach(v => {
            if (v.operator != undefined) {
              this.operator = v.operator
            }
            if (v.operatortime != undefined) {
              this.operatortime = v.operatortime
            }
          })
          this.list = arr
          const end = arr[3].end == undefined ? 0 : arr[3].end
          const start = arr[3].start == undefined ? 0 : arr[3].start
          const number = arr[3].number == undefined ? 0 : arr[3].number
          const thrift = arr[3].thrift == undefined ? 0 : arr[3].thrift
          this.count_1 = start + end + number + thrift
          this.count_2 = arr[3].number + arr[3].thrift
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
    indexMethod(index) {
      switch (index) {
        case 0:
          return '起码'
          break
        case 1:
          return '止码'
          break
        case 2:
          return '具数'
          break
        case 3:
          return '油耗'
          break
        default:
      }
    },
    oil() {
      this.dataForm.reality = this.dataForm.start - this.dataForm.end
    },
    resetForm() {
      this.dataForm = {
        uid: '',
        fid: '',
        start: '',
        end: '',
        number: '',
        reality: '',
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
    print() {
      this.$nextTick(() => {
        this.$print(this.$refs.print)
      })
    },

    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          oiladd(this.dataForm)
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
      this.dataForm = Object.assign({}, row)
      console.log(this.dataForm)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          oiledit(this.dataForm)
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
      oildel(row)
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
