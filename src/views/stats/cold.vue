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
      <!-- <el-input
        v-model="listQuery.title"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入服务名称"
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
      <el-select
        v-model="listQuery.servicestype"
        placeholder="选择类型"
        clearable
        class="filter-item"
        style="width:120px"
      >
        <el-option
          v-for="(item,value,index) in servicestype"
          :key="index"
          :label="item"
          :value="value + 1"
        />
      </el-select> -->
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
      highlight-current-row
    >
      <el-table-column align="center" label="逝者姓名" prop="name" />
      <el-table-column align="center" label="年龄" prop="age" width="60" />
      <el-table-column align="center" label="性别" prop="sex" width="60" />
      <el-table-column align="center" label="冷柜编号" prop="title" />
      <el-table-column align="center" label="开始就" prop="startime" />
      <el-table-column align="center" label="备注" prop="remark" />
      <el-table-column align="center" label="操作人" prop="operator" />
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          {{ scope.row.status == 1 ? '使用中' : '已完结' }}
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
import { coldobituary } from '@/api/stats'
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
      coldobituary(this.listQuery)
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
    }

  }
}
</script>
