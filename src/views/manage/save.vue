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
      <el-table-column align="center" label="寄存编号" prop="number" />
      <el-table-column align="center" label="逝者姓名" prop="name" />
      <el-table-column align="center" label="开始时间" prop="startime" />
      <el-table-column align="center" label="结束时间" prop="endtime" />
      <el-table-column align="center" label="联系人" prop="linkman" />
      <el-table-column align="center" label="联系电话" prop="linkphone" />
      <el-table-column align="center" label="联系地址" prop="linkaddress" />
      <el-table-column align="center" label="状态" prop="status" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | or_status">{{ scope.row.status == 0 ? '未寄存' : (scope.row.status == 1 ? '寄存中':'已完结') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" width="300">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            type="success"
            size="mini"
            @click="handleRenew(scope.row)"
          >续存</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleTake(scope.row)"
          >取走</el-button>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="handleInfo(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :close-on-click-modal="false" title="续存信息" :visible.sync="dialogFormVisibleRenew">
      <el-form
        ref="dataForm"
        :inline="true"
        :model="renew"
        status-icon
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="结束时间" prop="endtime">
          <el-date-picker
            v-model="renew.endtime"
            style="width:185px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="价格" prop="totalprice">
          <el-input v-model="renew.totalprice" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRenew = false">取消</el-button>
        <el-button type="primary" @click="RenewData">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" title="信息" :visible.sync="dialogFormVisibleTake">
      <el-form
        ref="dataForm"
        :inline="true"
        :model="take"
        status-icon
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="取出时间" prop="taketime">
          <el-date-picker
            v-model="take.taketime"
            style="width:185px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="取出人" prop="takename">
          <el-input v-model="take.takename" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <span v-if="record_sign" class="sign_">家属签字：<img :src="record_sign" alt="" @click="dialogFormSign = true"> </span>
        <el-button type="primary" @click="sign_open">签字</el-button> -->
        <el-button type="primary" @click="TakeData">确定</el-button>
        <el-button @click="dialogFormVisibleTake = false">取消</el-button>
      </div>
    </el-dialog>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
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
        <el-form-item label="寄存位置" prop="number">
          <el-input v-model="dataForm.number" />
        </el-form-item>
        <el-form-item label="逝者姓名" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="逝者身份证" prop="card">
          <el-input v-model="dataForm.card" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startime">
          <el-date-picker
            v-model="dataForm.startime"
            style="width:185px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endtime">
          <el-date-picker
            v-model="dataForm.endtime"
            style="width:185px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="dataForm.linkman" />
        </el-form-item>
        <el-form-item label="联系人身份证" prop="linkcard">
          <el-input v-model="dataForm.linkcard" />
        </el-form-item>
        <el-form-item label="联系电话" prop="linkphone">
          <el-input v-model="dataForm.linkphone" />
        </el-form-item>
        <el-form-item label="与逝者关系" prop="relation">
          <el-input v-model="dataForm.relation" />
        </el-form-item>
        <el-form-item label="联系地址" prop="linkaddress">
          <el-input v-model="dataForm.linkaddress" />
        </el-form-item>
        <el-form-item label="寄存价格" prop="totalprice">
          <el-input v-model="dataForm.totalprice" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" title="查看" :visible.sync="dialogFormVisibleInfo">
      <div class="bury_car">
        <h1 class="bury_car_h1">逝者信息</h1>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content">
              <p><span> 逝者姓名 : </span>{{ information.name }}</p>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content">
              <p><span> 联系人 : </span>{{ information.linkman }}</p>
            </div>
          </el-col>

          <el-col :span="7">
            <div class="grid-content">
              <p><span> 联系电话 : </span>{{ information.linkphone }}</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <p><span> 承办人 : </span>{{ information.operator }}</p>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="bury_car" style="border:1px solid #23C6C8;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#23C6C8;color:#fff">寄存记录</h1>
        <el-row :gutter="20">
          <div v-for="(item,index) in informationServer" :key="index">
            <el-col :span="8">
              <div class="grid-content">
                <p> {{ item.state_name }}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 缴费时间 : </span>{{ item.paytime }}</p>
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
        <!-- <span v-if="record_sign" class="sign_">家属签字：<img :src="record_sign" alt="" @click="dialogFormSign = true"> </span>
        <el-button v-if="record_ifsign == 0" type="primary" @click="sign_open">签字</el-button> -->
        <!-- <el-button v-if="record_ifsign == 0" type="primary" @click="SignSend">确定</el-button> -->
        <el-button type="primary" @click="handlePrintFireCard">寄存证</el-button>
        <el-button @click="dialogFormVisibleInfo = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog :close-on-click-modal="false" title="签名" :visible.sync="dialogFormVisibleSign" @close="sign_close">
      <e560 ref="child" @cancel="cancel" @imgData="imgData" />
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="查看签名" :visible.sync="dialogFormSign">
      <img :src="record_sign" alt="">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormSign = false">取消</el-button>
      </div>
    </el-dialog> -->
    <save v-show="false" ref="save_" />
  </div>
</template>
<script>
import { checklist, checkadd, checkedit, checkrenew, checktake, checkinfo, checkSign } from '@/api/manage'
import Pagination from '@/components/Pagination'
import { vuexData } from '@/utils/mixin'
import e560 from '@/components/E560'
import save from '@/components/Prints/save'
export default {
  name: 'VueGarden',
  components: { Pagination, e560, save },
  mixins: [vuexData],
  data() {
    return {
      list: null,
      total: 0,
      record_sign: '',
      record_ifsign: '',
      signatureid: '',
      informationServer: null,
      information: {
        name: '',
        linkman: '',
        linkphone: '',
        linkaddress: '',
        operator: '',
        sex: '',
        age: ''
      },
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
        number: '',
        startime: null,
        endtime: null,
        signature: '',
        linkman: '',
        linkcard: '',
        card: '',
        relation: '',
        linkphone: '',
        linkaddress: '',
        operator: '',
        totalprice: ''
      },
      renew: {
        endtime: null,
        totalprice: '',
        oid: '',
        name: '',
        id: '',
        operator: ''
      },
      take: {
        id: '',
        taketime: null,
        takename: '',
        operator: ''
      },
      dialogFormVisibleInfo: false,
      dialogFormVisibleRenew: false,
      dialogFormVisibleTake: false,
      dialogFormVisible: false,
      dialogFormVisibleSign: false,
      dialogFormSign: false,
      dialogStatus: '',
      save_print: null,
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
      checklist(this.listQuery)
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
    sign_open() {
      this.record_sign = ''
      this.dialogFormVisibleSign = true
      this.$nextTick(() => {
        this.$refs.child.initDevice()
      })
    },
    handlePrintFireCard() {
      this.$refs.save_.init(this.save_print)
    },
    sign_close() {
      this.$refs.child.uninitDevice()
    },
    cancel() {
      this.dialogFormVisibleSign = false
    },
    imgData(v) {
      this.record_sign = v
    },
    SignSend() {
      const data = { signature: this.record_sign, id: this.signatureid }
      checkSign(data).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: '成功',
            message: '操作成功'
          })
          this.getList()
          this.dialogFormVisibleInfo = false
        } else {
          this.$notify.error({
            title: '失败',
            message: res.msg
          })
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        number: '',
        name: '',
        startime: null,
        endtime: null,
        signature: '',
        linkman: '',
        relation: '',
        card: '',
        linkcard: '',
        linkphone: '',
        linkaddress: '',
        operator: '',
        totalprice: ''
      }
    },
    handleInfo(row) {
      this.save_print = row

      const data = { id: row.id }
      this.signatureid = row.id
      this.record_sign = row.signature
      this.record_ifsign = row.ifsignature
      checkinfo(data)
        .then(res => {
          this.save_print.serial = res.data.serial
          this.save_print.type = res.data.type
          this.dialogFormVisibleInfo = true
          this.$nextTick(() => {
            this.information = res.data
            this.informationServer = this.information.finance_list.data
          })
        })
        .catch((res) => {
          this.$notify.error({
            title: '获取失败',
            message: res.msg
          })
        })
    },
    handleRenew(row) {
      this.renew = Object.assign({}, row)
      this.renew.endtime = null
      this.renew.totalprice = ''
      this.dialogFormVisibleRenew = true
    },
    handleTake(row) {
      this.take = Object.assign({}, row)
      this.record_sign = ''
      this.dialogFormVisibleTake = true
    },
    TakeData() {
      const data = {
        taketime: this.take.taketime,
        takename: this.take.takename,
        id: this.take.id,
        take_signature: this.record_sign,
        operator: this.info.realname
      }
      checktake(data)
        .then(res => {
          this.getList()
          this.dialogFormVisibleTake = false
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
    },
    RenewData() {
      const data = {
        endtime: this.renew.endtime,
        totalprice: this.renew.totalprice,
        name: this.renew.name,
        oid: this.renew.oid,
        id: this.renew.id,
        operator: this.info.realname
      }
      checkrenew(data)
        .then(res => {
          this.getList()
          this.dialogFormVisibleRenew = false
          this.$notify.success({
            title: '成功',
            message: '续费成功'
          })
        })
        .catch(res => {
          this.$notify.error({
            title: '失败',
            message: res.msg
          })
        })
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
      this.dataForm.operator = this.info.realname
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          checkadd(this.dataForm)
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.dataForm.status = this.dataForm.status == 0 ? 1 : this.dataForm.status
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          checkedit(this.dataForm)
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
    }
  }
}
</script>
