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
      <el-date-picker
        v-model="listQuery.endtime"
        style="width: 200px"
        class="filter-item"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="结束时间"
      />
      <el-select v-model="listQuery.uid" class="filter-item" placeholder="请选择" style="width:180px">
        <el-option
          v-for="(value, item) in pepole"
          :key="item"
          :label="value.realname"
          :value="value.id"
        />
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
      <!-- <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button> -->
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      :summary-method="getSummaries"
      show-summary
      highlight-current-row
    >
      <el-table-column align="center" label="炉型" prop="fid" width="200" />
      <el-table-column align="center" label="具数" prop="number" />
      <el-table-column align="center" label="实际用油" prop="reality" />
      <el-table-column align="center" label="应用用油" prop="should" />
      <el-table-column align="center" label="节约用油" prop="thrift" />

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
import { oilliststat } from '@/api/merits'
import Pagination from '@/components/Pagination'
import { managerlist } from '@/api/vocational'
import { vuexData } from '@/utils/mixin'
export default {
  name: 'VueGarden',
  components: { Pagination },
  mixins: [vuexData],
  data() {
    return {
      list: null,
      total: 0,
      pepole: [],
      listLoading: true,
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        startime: null,
        uid: 13,
        endtime: null,
        search_data: '',
        sort: 'add_time',
        order: 'desc'
      }
    }
  },
  computed: {},
  created() {
    this.getList()
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
      oilliststat(this.listQuery)
        .then(res => {
          var arr = []
          res.data.forEach(v => {
            if (v != '') {
              arr.push(v)
            }
          })
          this.list = arr
          // console.log(res.data)
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
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }

        const values = data.map(item => Number(item[column.property]))
        console.log(columns)
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' '
        } else {
          sums[index] = 'N/A'
        }
      })

      return sums
    }
  }
}
</script>
