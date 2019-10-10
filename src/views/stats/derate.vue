<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.search_data"
        clearable
        class="filter-item"
        style="width: 130px;"
        placeholder="请输入关键字"
      />
      <el-date-picker
        v-model="listQuery.startime"
        style="width: 200px"
        class="filter-item"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="开始时间"
      />
      <el-date-picker
        v-model="listQuery.endtime"
        style="width: 200px"
        class="filter-item"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="结束时间"
      />
      <el-select v-model="listQuery.basic" placeholder="低保类型" clearable class="filter-item" style="width:120px">
        <el-option v-for="(item,value,index) in basic" :key="index" :label="item" :value="value + 1" />
      </el-select>
      <el-select v-model="listQuery.villages" placeholder="选择乡镇" clearable class="filter-item" style="width:120px">
        <el-option v-for="(item,value,index) in villages" :key="index" :label="item" :value="value + 1" />
      </el-select>

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload_">
        详情导出
      </el-button>
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
      <el-table-column align="center" label="死者姓名" prop="name" />
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
      <el-table-column align="center" label="火化时间" prop="farewelltime" />
      <el-table-column align="center" label="火化费" prop="oneprice" />
      <el-table-column align="center" label="遗体消毒费" prop="twoprice" />
      <el-table-column align="center" label="冰棺,车费" prop="threeprice" />
      <el-table-column align="center" label="总价" prop="totalprice" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

  </div>
</template>
<script>
import { statderate, excelderateAll, excelderate } from '@/api/stats'
import { vuexData } from '@/utils/mixin'
import Pagination from '@/components/Pagination'
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
        startime: null,
        basic: '',
        villages: '',
        endtime: null,
        sort: 'add_time',
        order: 'desc'
      },
      dialogFormVisible: false,
      downloadLoading: false
    }
  },
  computed: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      statderate(this.listQuery)
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
    handleDownload() {
      this.downloadLoading = true
      excelderateAll(this.listQuery)
        .then(res => {
          this.export_list = res.data
      import('@/vendor/Export2Excel').then(excel => {
        const filterVal = ['villages_name', 'count_id', 'oneprice', 'twoprice', 'threeprice', 'totalprice']
        const tHeader = ['乡镇', '数量', '火化费', '遗体消毒费', '冰棺,车费', '总价']
        const data = this.formatJson(filterVal, this.export_list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '乡镇低保单'
        })
        this.downloadLoading = false
      })
        })
    },
    handleDownload_() {
      excelderate(this.listQuery)
        .then(res => {
          this.export_list = res.data.list
          this.title = res.data.title
      import('@/vendor/Export2Excel').then(excel => {
        const filterVal = ['name', 'sex', 'age', 'registered', 'create_time', 'basic_name', 'card', 'totalprice']
        const tHeader = ['姓名', '性别', '年龄', '地址', '日期', '求助类别', '身份证号', '总金额']
        const data = this.formatJson(filterVal, this.export_list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.title
        })
      })
        })
    },
    formatJson(filterVal, jsonData) {
      console.log(jsonData)
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }

  }
}
</script>
