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
      <el-table-column align="center" label="业务编号" prop="serial" width="150" />
      <el-table-column align="center" label="逝者姓名" prop="name" />
      <el-table-column align="center" label="联系人" prop="linkman" />
      <el-table-column align="center" label="联系电话" prop="linkphone" />
      <el-table-column align="center" label="火化时间" prop="farewelltime" />
      <el-table-column align="center" label="操作人" prop="operator" />
      <el-table-column align="center" label="状态" prop="state" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | carFilter"> {{ scope.row.state | obituary_list }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" width="360">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdates(scope.row)"
          >出车</el-button>
          <el-button type="primary" size="mini" @click="handleInfo(scope.row)">详情</el-button>
          <el-button type="primary" size="mini" @click="handleEnd(scope.row)">完结</el-button>
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
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="基本信息" name="info">
            <div style="margin-bottom:10px">
              <el-button size="mini" type="primary" @click="getCard(0)">逝者信息</el-button>
              <el-button size="mini" type="primary" @click="getCard(1)">联系人信息</el-button>
              <el-button size="mini" type="primary" @click="resetForm">清空信息</el-button>
            </div>
            <el-form-item label="逝者姓名" prop="name">
              <el-input v-model="dataForm.name" />
            </el-form-item>
            <el-form-item label="逝者性别" prop="sex">
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
            </el-form-item>
            <el-form-item label="身份证" prop="card">
              <el-input v-model="dataForm.card" />
            </el-form-item>
            <el-form-item label="户口所在地" prop="registered">
              <el-input v-model="dataForm.registered" />
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                v-model="dataForm.birthday"
                style="width:185px"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="民族" prop="nation">
              <el-input v-model="dataForm.nation" />
            </el-form-item>
            <el-form-item label="是否低保户" prop="basic">
              <el-select
                v-model="dataForm.basic"
                placeholder="请选择"
                clearable
                class="filter-item"
                style="width:185px"
              >
                <el-option v-for="(item,value,index) in basic" :key="index" :label="item" :value="value + 1" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否寄存" prop="ifcheck">
              <el-select
                v-model="dataForm.ifcheck"
                placeholder="请选择"
                clearable
                class="filter-item"
                style="width:185px"
              >
                <el-option label="是" :value="1" />
                <el-option label="否" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="死亡原因" prop="reason">
              <el-input v-model="dataForm.reason" />
            </el-form-item>
            <el-form-item label="死亡时间" prop="dietime">
              <el-date-picker
                v-model="dataForm.dietime"
                style="width:185px"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="是否无名尸" prop="unknown">
              <el-select
                v-model="dataForm.unknown"
                placeholder="请选择"
                clearable
                class="filter-item"
                style="width:185px"
              >
                <el-option v-for="(item,index) in unknown" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="dataForm.linkman" />
            </el-form-item>
            <el-form-item label="联系人性别" prop="linksex">
              <el-select
                v-model="dataForm.linksex"
                placeholder="选择性别"
                clearable
                class="filter-item"
                style="width:185px"
              >
                <el-option v-for="(item,index) in sex" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="联系人电话" prop="linkphone">
              <el-input v-model="dataForm.linkphone" />
            </el-form-item>
            <el-form-item label="逝者关系" prop="relation">
              <el-input v-model="dataForm.relation" />
            </el-form-item>
            <el-form-item label="火化时间" prop="farewelltime">
              <el-date-picker
                v-model="dataForm.farewelltime"
                type="datetime"
                style="width:185px"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择火化时间"
              />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="dataForm.remark" type="textarea" :rows="2" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="灵堂服务" name="second">
            <el-form-item label="开始时间" prop="mourn_data_startime">
              <el-date-picker
                v-model="mourn_data.startime"
                type="datetime"
                style="width:200px"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="mourn_data_endtime">
              <el-date-picker
                v-model="mourn_data.endtime"
                type="datetime"
                style="width:200px"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              />
            </el-form-item>
            <el-form-item label="选择灵堂" prop="mourn_data_title">
              <el-input v-model="mourn_data.list.title" placeholder="请选择灵堂" clearable style="width:200px" @focus="Show(1)" />
            </el-form-item>
            <el-form-item label="合计">
              <el-input v-model="mourn_data.totalprice" placeholder="合计" style="width:200px" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="mourn_data.remark" style="width:200px" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="冷柜服务" name="third">
            <el-form-item label="开始时间" prop="cold_data_startime">
              <el-date-picker
                v-model="cold_data.startime"
                type="datetime"
                style="width:200px"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="outtime">
              <el-date-picker
                v-model="cold_data.endtime"
                type="datetime"
                style="width:200px"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              />
            </el-form-item>
            <el-form-item label="选择冷柜" prop="cold_data_title">
              <el-input v-model="cold_data.list.title" clearable placeholder="请选择冷柜" style="width:200px" @focus="Show(2)" />
            </el-form-item>
            <el-form-item label="合计">
              <el-input v-model="cold_data.totalprice" placeholder="合计" style="width:200px" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="cold_data.remark" style="width:200px" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="选择服务" name="thr">
            <service ref="server" @service_data="service_data" />
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisiblecar">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="基本信息" name="info">

          <el-form
            ref="recar"
            :rules="rules"
            :inline="true"
            :model="recar"
            status-icon
            label-position="left"
            label-width="100px"
          >
            <el-form-item label="逝者姓名" prop="name">
              <el-input v-model="recar.name" />
            </el-form-item>
            <el-form-item label="接运地址" prop="address">
              <el-input v-model="recar.address" />
            </el-form-item>
            <el-form-item label="出车时间" prop="outtime">
              <el-date-picker
                v-model="recar.outtime"
                type="datetime"
                style="width:185px"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              />
            </el-form-item>
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="recar.linkman" />
            </el-form-item>
            <el-form-item label="联系电话" prop="linkphone">
              <el-input v-model="recar.linkphone" />
            </el-form-item>
            <el-form-item label="接运类型" prop="recetype">
              <el-select v-model="recar.recetype" placeholder="" clearable class="filter-item" style="width:185px">
                <el-option v-for="(item,value,index) in recetype" :key="index" :label="item" :value="Number(value)" />
              </el-select>
            </el-form-item>
            <el-form-item label="选择司机" prop="driver">
              <el-select v-model="recar.driver" placeholder="" clearable class="filter-item" style="width:185px">
                <el-option v-for="(item,value,index) in getservice" :key="index" :label="item.realname" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="接运价格" prop="totalprice">
              <el-input v-model="recar.totalprice" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="recar.remark" type="textarea" :rows="2" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="选择服务" name="second">
          <service ref="server" @service_data="service_data" />
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblecar = false">取消</el-button>
        <el-button type="primary" @click="updateDatas">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="查看" :visible.sync="dialogFormVisibleInfo">
      <div class="bury_car">
        <h1 class="bury_car_h1">逝者信息</h1>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者姓名 : </span>{{ infodataForm.name }}</p>
              <p><span> 身份证 : </span>{{ infodataForm.card }}</p>
              <p><span> 死亡原因 : </span>{{ infodataForm.reason }}</p>
              <p><span> 联系人 : </span>{{ infodataForm.linkman }}</p>
              <p><span> 火化时间 : </span>{{ infodataForm.farewelltime }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者性别 : </span>{{ infodataForm.sex }}</p>
              <p><span> 户口所在地 : </span>{{ infodataForm.registered }}</p>
              <p><span> 联系人性别 : </span>{{ infodataForm.linksex }}</p>
              <p><span> 联系电话 : </span>{{ infodataForm.linkphone }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者年龄 : </span>{{ infodataForm.age }}</p>
              <p><span> 民族 : </span>{{ infodataForm.nation }}</p>
              <p><span> 承办人 : </span>{{ infodataForm.operator }}</p>
              <p><span> 逝者关系 : </span>{{ infodataForm.relation }}</p>

            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="InfoServer ? InfoServer.length > 0 : false" class="bury_car" style="border:1px solid #23C6C8;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#23C6C8;color:#fff">所选服务</h1>
        <el-row :gutter="20">
          <div v-for="(item,index) in InfoServer" :key="index">
            <el-col :span="12">
              <div class="grid-content">
                <p><span> 服务名称 : </span>{{ item.title }}<span v-show="item.state > 1">(已签收)</span></p>
              </div>
            </el-col>
            <el-col :span="4">
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
      <div v-if="infodataForm.cold" class="bury_car" style="border:1px solid #63afde;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#63afde;color:#fff">冷藏柜</h1>
        <el-row :gutter="20">
          <el-col :span="5">
            <div class="grid-content">
              <p><span>冷藏柜名称 : </span>{{ infodataForm.cold.title }}</p>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content">
              <p><span>开始时间 : </span>{{ infodataForm.cold.startime }}</p>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content">
              <p><span>结束时间 : </span>{{ infodataForm.cold.endtime }}</p>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content">
              <p><span>价格合计 : </span>{{ infodataForm.cold.totalprice }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="infodataForm.mourn" class="bury_car" style="border:1px solid #74bcffba;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#74bcffba;color:#fff">悼念厅</h1>
        <el-row :gutter="20">
          <el-col :span="5">
            <div class="grid-content">
              <p><span>悼念厅名称 : </span>{{ infodataForm.mourn.title }}</p>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content">
              <p><span>开始时间 : </span>{{ infodataForm.mourn.startime }}</p>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content">
              <p><span>结束时间 : </span>{{ infodataForm.mourn.endtime }}</p>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content">
              <p><span>价格合计 : </span>{{ infodataForm.mourn.totalprice }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <span v-if="record_sign" class="sign_">家属签字：<img :src="record_sign" alt="" @click="dialogFormSign = true"> </span>
        <el-button v-if="record_ifsign == 0" type="primary" @click="sign_open">签字</el-button>
        <el-button v-if="record_ifsign == 0" type="primary" @click="SignSend">确定</el-button> -->
        <!-- <el-button type="primary" @click="SignSend">打印</el-button>  -->
        <el-button @click="dialogFormVisibleInfo = false">取消</el-button>
      </div>
    </el-dialog>
    <box ref="box" @box_data="box_data" />
    <!-- <el-dialog :close-on-click-modal="false" title="签名" :visible.sync="dialogFormVisibleSign" @close="sign_close">
      <e560 ref="child" @cancel="cancel" @imgData="imgData" />
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="查看签名" :visible.sync="dialogFormSign">
      <img :src="record_sign" alt="">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormSign = false">取消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
import {
  getobituary,
  listobituary,
  addobituary,
  infoobituary,
  editobituary,
  delobituary,
  signobituary,
  obituaryend,
  carsendagain
} from '@/api/manage'
import axios from 'axios'
import { managerlist } from '@/api/vocational'
import Pagination from '@/components/Pagination'
import box from '@/components/Box'
import service from '@/components/Service'
import sign from '@/components/Sign'
import e560 from '@/components/E560'
import { vuexData } from '@/utils/mixin'
export default {
  name: 'VueGarden',
  components: { Pagination, box, service, sign, e560 },
  mixins: [vuexData],
  data() {
    var validateDate = (rule, value, callback) => {
      if (this.mourn_data.list.title != undefined && this.mourn_data.startime == null) {
        if (this.mourn_data.startime == null) {
          callback(new Error('请选择灵堂开始时间'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateDate1 = (rule, value, callback) => {
      if (this.cold_data.list.title != undefined && this.cold_data.startime == null) {
        if (this.cold_data.startime == null) {
          callback(new Error('请选择冷柜开始时间'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      list: null,
      flag: true,
      EditServer: null,
      InfoServer: null,
      recetype: null,
      signatureid: '',
      record_sign: '',
      getservice: null,
      record_ifsign: '',
      // birthday: '',
      mourn: null,
      cold: null,
      server: null,
      infodataForm: {
        name: '',
        sex: '',
        age: '',
        card: '',
        farewelltime: null,
        registered: '',
        reason: '',
        linkman: '',
        relation: '',
        linksex: '',
        nation: '',
        linkphone: '',
        operator: ''
      },
      mourn_data: {
        startime: null,
        endtime: null,
        remark: '',
        totalprice: '',
        list: {
          title: ''
        }
      },
      cold_data: {
        startime: null,
        endtime: null,
        totalprice: '',
        remark: '',
        list: {
          title: ''
        }
      },
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
      unknown: [{ id: 0, name: '否' }, { id: 1, name: '是' }],
      dataForm: {
        name: '',
        sex: '',
        age: '',
        card: '',
        unknown: '',
        basic: '',
        dietime: null,
        farewelltime: null,
        registered: '',
        birthday: null,
        remark: '',
        reason: '',
        linkman: '',
        relation: '',
        linksex: '',
        ifcheck: 2,
        nation: '汉',
        linkphone: '',
        operator: '',
        mourn: {
        },
        cold: {
        },
        server: null,
        type: 0
      },
      recar: {
        id: '',
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
      dialogFormVisibleInfo: false,
      dialogFormVisiblecar: false,
      dialogFormVisibleSign: false,
      dialogFormSign: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        updates: '再次出车'
      },
      rules: {
        mourn_data_startime: [
          { type: 'date', validator: validateDate, trigger: 'change' }
        ],
        cold_data_startime: [
          { type: 'date', validator: validateDate1, trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  watch: {
    'mourn_data.list.title': {
      deep: true,
      handler: function(newV, oldV) {
        if (newV == '') {
          this.mourn_data.list = ''
          this.mourn_data.totalprice = ''
        }
      }
    },
    'cold_data.list.title': {
      deep: true,
      handler: function(newV, oldV) {
        if (newV == '') {
          this.cold_data.list = ''
          this.cold_data.totalprice = ''
        }
      }
    }
  },
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
      listobituary(this.listQuery)
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
    getCard(val) {
      var url = 'http://127.0.0.1:38088/card=idcard'
      var params = ''
      axios
        .post(url, params)
        .then(res => {
          if (res.data.code == 0) {
            var info = res.data.IDCardInfo
            this.$notify.success({
              title: '成功',
              message: '身份信息获取成功'
            })
            if (val == 0) {
              var myDate = new Date()
              var tYear = myDate.getFullYear()
              this.dataForm.name = info.name
              this.dataForm.sex = info.sex
              this.dataForm.card = info.cardID
              this.dataForm.birthday = info.birthday
              this.dataForm.registered = info.address
              this.dataForm.age = parseInt(tYear) - (info.birthday.substr(0, 4))
            } else {
              this.dataForm.linkman = info.name
              this.dataForm.linksex = info.sex
            }
          } else {
            this.$notify.error({
              title: '获取身份信息失败',
              message: res.msg
            })
          }
        })
        .catch(res => {
          this.$notify.error({
            title: '未检测到系统设备',
            message: '网络错误'
          })
        })
    },
    sign_open() {
      this.record_sign = ''
      this.dialogFormVisibleSign = true
      this.$nextTick(() => {
        this.$refs.child.initDevice()
      })
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
    getCommon(v) {
      getobituary().then(res => {
        this.mourn = res.data.mourn
        this.cold = res.data.cold
        this.recetype = res.data.recetype
        this.server = res.data.services
        const data = {
          type: v,
          server: this.server
        }
        this.$refs.server.showService(data)
      })
    },
    box_data(val) {
      this.dataForm.type = val.type
      if (val.type == 1) {
        this.mourn_data.list = Object.assign({}, val.data)
        this.mourn_data.totalprice = val.data.price
      } else {
        this.cold_data.list = Object.assign({}, val.data)
        this.cold_data.totalprice = val.data.price
      }
    },
    SignSend() {
      const data = { signature: this.record_sign, id: this.signatureid }
      signobituary(data).then(res => {
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
    Show(val) {
      const data = {
        list: val == 1 ? this.mourn : this.cold,
        type: val
      }
      this.$refs.box.show(data)
    },
    service_data(data) {
      this.dataForm.server = data
      this.recar.server = data
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        name: '',
        sex: '',
        age: '',
        card: '',
        basic: '',
        ifcheck: 2,
        remark: '',
        registered: '',
        dietime: null,
        unknown: 0,
        reason: '',
        linkman: '',
        relation: '',
        linkphone: '',
        birthday: null,
        nation: '汉',
        linksex: '',
        operator: '',
        farewelltime: null
      }
    },
    reset() {
      this.mourn_data = {
        startime: null,
        endtime: null,
        remark: '',
        totalprice: '',
        list: {
          title: ''
        }
      }
      this.cold_data = {
        startime: null,
        endtime: null,
        totalprice: '',
        remark: '',
        list: {
          title: ''
        }
      }
    },
    handleCreate() {
      this.resetForm()
      this.reset()
      this.getCommon(0)
      this.activeName = 'info'
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
    handleInfo(row) {
      const data = { id: row.id, type: 2 }
      infoobituary(data).then(res => {
        var editRow = []
        res.data.services.forEach((v, k) => {
          editRow.push(v.services)
        })
        this.InfoServer = [].concat.apply([], editRow)
        this.infodataForm = res.data
        this.signatureid = row.id
        this.record_sign = row.signature
        this.record_ifsign = row.ifsignature
        this.dialogFormVisibleInfo = true
      })
    },
    createData() {
      this.dataForm.operator = this.info.realname
      this.dataForm.mourn = this.mourn_data
      this.dataForm.cold = this.cold_data
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addobituary(this.dataForm)
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
    updateDatas() {
      this.$refs['recar'].validate(valid => {
        if (valid) {
          carsendagain(this.recar)
            .then(() => {
              this.getList()
              this.dialogFormVisiblecar = false
              this.$notify.success({
                title: '成功',
                message: '出车成功'
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
    handleUpdates(row) {
      this.activeName = 'info'
      this.recar.oid = row.id
      this.recar.name = row.name
      this.recar.linkman = row.linkman
      this.recar.linkphone = row.linkphone
      this.getCommon(1)
      this.dialogStatus = 'updates'
      this.dialogFormVisiblecar = true
      this.$nextTick(() => {
        this.$refs['recar'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.activeName = 'info'
      this.dataForm = Object.assign({}, row)
      this.getCommon(1)
      const data = { id: row.id, type: 1 }
      infoobituary(data).then(res => {
        this.reset()
        if (res.data.mourn) {
          this.mourn_data = res.data.mourn
        }
        if (res.data.cold) {
          this.cold_data = res.data.cold
        }
        this.$refs.server.editService(res.data.services)
        // const server = {
        //   service: res.data.services,
        //   services_totalprice: res.data.services_totalprice
        // }
        // var editRow = []
        // server.service.forEach((v, k) => {
        //   editRow.push(v.services)
        // })
        // server.service = [].concat.apply([], editRow)
        // this.dataForm.server = server
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.dataForm.operator = this.info.realname
      this.dataForm.mourn = this.mourn_data
      this.dataForm.cold = this.cold_data
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          editobituary(this.dataForm)
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
    handleEnd(row) {
      this.$confirm('您确认此操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          id: row.id,
          state: 15
        }
        obituaryend(data)
          .then(res => {
            this.getList()
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    handleDelete(row) {
      this.$confirm('您确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delobituary(row)
          .then(res => {
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style>
.sign{
  font-size: 16px;
    display: inline-block;
    width: 100%;
    text-align: center;
}
</style>

