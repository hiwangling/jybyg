<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.search_data"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入逝者姓名"
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
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
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
      <el-table-column align="center" label="姓名" prop="realname" />
      <el-table-column align="center" label="接运" prop="title" />
      <el-table-column align="center" label="高档火灰炉" prop="title153">
        <template slot-scope="scope">
          {{ scope.row.price153 == 0 ? '' : scope.row.title153 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="普通平板炉" prop="title152">
        <template slot-scope="scope">
          {{ scope.row.price152 == 0 ? '' : scope.row.title152 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="洗澡更衣" prop="title143">
        <template slot-scope="scope">
          {{ scope.row.price143 == 0 ? '' : scope.row.title143 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="化妆" prop="title142">
        <template slot-scope="scope">
          {{ scope.row.price142 == 0 ? '' : scope.row.title142 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="特殊整理" prop="title131">
        <template slot-scope="scope">
          {{ scope.row.price131 == 0 ? '' : scope.row.title131 }}
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
  </div>
</template>
<script>
import { statisticsuid } from '@/api/stats'
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
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        startime: null,
        endtime: null,
        servicestype: '',
        search_data: '',
        title: '',
        sort: 'add_time',
        order: 'desc'
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
      statisticsuid(this.listQuery)
        .then(res => {
          this.list = res.data
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
      statisticsuid(this.listQuery)
        .then(res => {
          this.export_list = res.data.map(v => {
            if (parseInt(v.price131) == 0) {
              v.title131 = ''
            }
            if (parseInt(v.price142) == 0) {
              v.title142 = ''
            }
            if (parseInt(v.price143) == 0) {
              v.title143 = ''
            }
            if (parseInt(v.price152) == 0) {
              v.title152 = ''
            }
            if (parseInt(v.price153) == 0) {
              v.title153 = ''
            }
            return v
          })
          import('@/vendor/Export2Excel').then(excel => {
            const filterVal = ['realname', 'title', 'title153', 'title152', 'title143', 'title142', 'title141']
            const tHeader = ['姓名', '接运', '高档火灰炉', '普通平板炉', '洗澡更衣', '化妆', '特殊整理']
            const data = this.formatJson(filterVal, this.export_list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '车间绩效统计'
            })
            this.downloadLoading = false
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
