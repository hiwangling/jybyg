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
      <el-table-column align="center" label="火化编号" prop="c_serial" />
      <el-table-column align="center" label="火化时间" prop="farewelltime" />
      <el-table-column align="center" label="逝者姓名" prop="name" />
      <el-table-column align="center" label="年龄" prop="age" />
      <el-table-column align="center" label="死因" prop="reason" />
      <el-table-column align="center" label="死亡日期" prop="dietime" />
      <el-table-column align="center" label="身份证" prop="card" />
      <el-table-column align="center" label="地址" prop="registered" />
      <el-table-column align="center" label="总价" prop="r_totalprice" />
      <el-table-column align="center" label="支付时间" prop="r_create_time" />
      <el-table-column align="center" label="操作" class-name="small-padding" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-search" @click="handleInfo(scope.row)">详情</el-button>
          <el-button v-permission="['post /api/v1/obituary/state']" type="primary" size="mini" icon="el-icon-edit" @click="handleEnd(scope.row)">撤销</el-button>
          <!-- <el-button type="primary" size="mini" @click="handleServer(scope.row)">服务</el-button> -->
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

    <el-dialog :close-on-click-modal="false" title="骨灰操作" :visible.sync="dialogFormCheck">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="骨灰寄存" name="first">
          <el-form
            ref="save"
            :inline="true"
            :model="save"
            status-icon
            label-position="left"
            label-width="100px"
          >
            <el-form-item label="寄存编号" prop="serial">
              <el-input v-model="save.serial" />
            </el-form-item>
            <el-form-item label="逝者姓名" prop="name">
              <el-input v-model="save.name" />
            </el-form-item>
            <el-form-item label="身份证" prop="card">
              <el-input v-model="save.card" />
            </el-form-item>
            <el-form-item label="开始时间" prop="startime">
              <el-date-picker
                v-model="save.startime"
                style="width:185px"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="endtime">
              <el-date-picker
                v-model="save.endtime"
                style="width:185px"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="save.linkman" />
            </el-form-item>
            <el-form-item label="联系人身份证" prop="linkcard">
              <el-input v-model="save.linkcard" />
            </el-form-item>
            <el-form-item label="联系电话" prop="linkphone">
              <el-input v-model="save.linkphone" />
            </el-form-item>
            <el-form-item label="联系地址" prop="linkaddress">
              <el-input v-model="save.linkaddress" />
            </el-form-item>
            <el-form-item label="寄存价格" prop="totalprice">
              <el-input v-model="save.totalprice" />
            </el-form-item>
            <el-form-item label="操作员" prop="operator">
              <el-input v-model="save.operator" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="送骨灰" name="second">
          <el-form
            ref="send"
            :inline="true"
            :model="send"
            status-icon
            label-position="left"
            label-width="100px"
          >
            <el-form-item label="逝者姓名" prop="name">
              <el-input v-model="send.name" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select
                v-model="send.sex"
                placeholder="选择性别"
                clearable
                class="filter-item"
                style="width:185px"
              >
                <el-option v-for="(item,index) in sex" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
              <el-input v-model="send.age" />
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="send.address" />
            </el-form-item>
            <el-form-item label="出车时间" prop="outtime">
              <el-date-picker
                v-model="send.outtime"
                style="width:185px"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="send.linkman" />
            </el-form-item>
            <el-form-item label="联系电话" prop="linkphone">
              <el-input v-model="send.linkphone" />
            </el-form-item>
            <el-form-item label="接运类型" prop="recetype">
              <el-select v-model="send.recetype" placeholder="" clearable class="filter-item" style="width:185px">
                <el-option v-for="(item,value,index) in recetype" :key="index" :label="item" :value="Number(value)" />
              </el-select>
            </el-form-item>
            <el-form-item label="选择车辆" prop="cid">
              <el-select v-model="send.cid" placeholder="" clearable class="filter-item" style="width:185px" @change="CarBind">
                <el-option v-for="(item,value,index) in car" :key="index" :label="item.number" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="司机" prop="driver">
              <el-input v-model="send.driver" />
            </el-form-item>
            <el-form-item label="接运价格" prop="totalprice">
              <el-input v-model="send.totalprice" />
            </el-form-item>
            <el-form-item label="操作员" prop="operator">
              <el-input v-model="save.operator" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="send.remark" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createGoData">确定</el-button>
        <el-button @click="dialogFormCheck = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="查看" :visible.sync="dialogFormInfo">
      <div class="bury_car">
        <h1 class="bury_car_h1">逝者信息</h1>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者姓名 : </span>{{ info_temp.name }}</p>
              <p><span> 身份证 : </span>{{ info_temp.card }}</p>
              <p><span> 死亡原因 : </span>{{ info_temp.reason }}</p>
              <p><span> 联系人 : </span>{{ info_temp.linkman }}</p>
              <p><span> 火化时间 : </span>{{ info_temp.farewelltime }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者性别 : </span>{{ info_temp.sex }}</p>
              <p><span> 户口所在地 : </span>{{ info_temp.registered }}</p>
              <p><span> 联系人性别 : </span>{{ info_temp.linksex }}</p>
              <p><span> 联系电话 : </span>{{ info_temp.linkphone }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者年龄 : </span>{{ info_temp.age }}</p>
              <p><span> 民族 : </span>{{ info_temp.nation }}</p>
              <p><span> 承办人 : </span>{{ info_temp.operator }}</p>
              <p><span> 逝者关系 : </span>{{ info_temp.relation }}</p>

            </div>
          </el-col>
        </el-row>
      </div>
      <div class="bury_car" style="border:1px solid #23C6C8;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#23C6C8;color:#fff">接运业务</h1>
        <el-divider content-position="left">出车信息</el-divider>
        <el-row :gutter="20">
          <div v-for="(item,index) in carsend" :key="index">
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 接运类型 : </span>{{ item.recetype | recetype_list }}</p>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content">
                <p><span> 出车时间 : </span>{{ item.create_time }} </p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <p>
                  <span> 接运价格 : </span>
                  <span style="font-weight: 100;">{{ item.totalprice }}</span>
                </p>
              </div>
            </el-col>
          </div>
        </el-row>
        <template v-if="serlist.send ? serlist.send.length > 0 : false">
          <el-divider content-position="left">接运服务</el-divider>
          <el-row :gutter="20">
            <div v-for="(item,index) in serlist.send" :key="index">
              <el-col :span="8">
                <div class="grid-content">
                  <p><span> 服务名称 : </span>{{ item.title }}</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <p><span> 数量 : </span>{{ item.number }} </p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <p>
                    <span> 合计 : </span>
                    <span style="font-weight: 100;">{{ item.totalprice }}</span>

                  </p>
                </div>
              </el-col>
            </div>
          </el-row>
        </template>
        <!-- <template>
          <el-divider content-position="left">家属签字</el-divider>
          <img :src="sign_img.send" alt="" width="130" @click="open(sign_img.send)">
        </template> -->
      </div>

      <div class="bury_car" style="border:1px solid #63afde;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#63afde;color:#fff">服务</h1>
        <template v-if="mourn">
          <el-divider content-position="left">灵堂服务</el-divider>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 灵堂名称 : </span>{{ mourn.title }}</p>
                <p><span> 价格 : </span>{{ mourn.totalprice }}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 开始时间 : </span>{{ mourn.startime }}</p>
                <p><span> 备注 : </span>{{ mourn.remark }}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 结束时间 : </span>{{ mourn.endtime }}</p>
                <p><span> 操作人 : </span>{{ mourn.operator }}</p>
              </div>
            </el-col>
          </el-row>
        </template>
        <template v-if="cold">
          <el-divider content-position="left">冷藏柜</el-divider>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 冷藏柜名称 : </span>{{ cold.title }}</p>
                <p><span> 价格 : </span>{{ cold.totalprice }}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 开始时间 : </span>{{ cold.startime }}</p>
                <p><span> 备注 : </span>{{ cold.remark }}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 结束时间 : </span>{{ cold.endtime }}</p>
                <p><span> 操作人 : </span>{{ cold.operator }}</p>
              </div>
            </el-col>
          </el-row>
        </template>
        <template v-if="serlist.voca ? serlist.voca.length > 0 : false">
          <el-divider content-position="left">服务</el-divider>
          <el-row :gutter="20">
            <div v-for="(item,index) in serlist.voca" :key="index">
              <el-col :span="8">
                <div class="grid-content">
                  <p><span> 服务名称 : </span>{{ item.title }}</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <p><span> 数量 : </span>{{ item.number }} </p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <p><span> 合计 : </span>{{ item.totalprice }}</p>
                </div>
              </el-col>
            </div>
          </el-row>
        </template>
        <!-- <template>
          <el-divider content-position="left">家属签字</el-divider>
          <img :src="sign_img.voca" alt="" width="130" @click="open(sign_img.voca)">
        </template> -->
      </div>

      <div v-if="serlist.fire ? serlist.fire.length > 0 : false" class="bury_car" style="border:1px solid #63afde;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#63afde;color:#fff">火化业务</h1>
        <el-row :gutter="20">
          <div v-for="(item,index) in serlist.fire" :key="index">
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
        <!-- <template>
          <el-divider content-position="left">家属签字</el-divider>
          <img :src="sign_img.fire" alt="" width="130" @click="open(sign_img.fire)">
        </template> -->
      </div>
      <div v-if="serlist.hall ? serlist.hall.length > 0 : false" class="bury_car" style="border:1px solid #63afde;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#63afde;color:#fff">大厅业务</h1>
        <el-row :gutter="20">
          <div v-for="(item,index) in serlist.hall" :key="index">
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

      <div v-if="check.serial != ''" class="bury_car" style="border:1px solid #63afde;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#63afde;color:#fff">寄存业务</h1>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 寄存编号 : </span>{{ check.serial }}</p>
              <p><span> 开始时间 : </span>{{ check.startime }}</p>
              <p><span> 联系人身份证 : </span>{{ check.linkcard }}</p>

            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 结束时间 : </span>{{ check.endtime }}</p>
              <p><span> 联系人电话 : </span>{{ check.linkphone }}</p>
              <p><span> 寄存价格 : </span>{{ check.totalprice }}</p>

            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 联系人 : </span>{{ check.linkman }}</p>
              <p><span> 联系人地址 : </span>{{ check.linkaddress }}</p>
              <p><span> 操作人 : </span>{{ check.operator }}</p>
            </div>
          </el-col>
        </el-row>
        <!-- <template>
          <el-divider content-position="left">家属签字</el-divider>
          <img :src="sign_img_save" alt="" width="130" @click="open(sign_img_save)">
        </template> -->
      </div>
      <!-- <div v-if="derate.id" class="bury_car" style="border:1px solid #63afde;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#63afde;color:#fff">低保减免</h1>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 普通火化，遗体消毒费 : </span>{{ derate.threeprice }}</p>
              <p><span> 证件编号 : </span>{{ derate.papers ? derate.papers : '无' }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 三日内普通冷藏费 : </span>{{ derate.twoprice }} </p>
              <p><span> 总价 : </span>{{ derate.totalprice }}</p>

            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 遗体接运费 : </span>{{ derate.threeprice }}</p>
              <p><span> 操作人 : </span>{{ derate.operator }}</p>
            </div>
          </el-col>
        </el-row>
      </div> -->
      <div slot="footer" class="dialog-footer">
        <!-- <span v-if="record_sign_info" class="sign_">家属签字：<img :src="record_sign_info" alt="" @click="dialogFormSign = true"> </span> -->
        <span style="color:red;font-size:14px;margin-right:10px;">应付总价：<b>{{ totalprice }}</b> 元</span>
        <!-- <el-button v-if="record_ifsign == 0" type="primary" @click="sign_open(1)">签字</el-button> -->
        <!-- v-if="record_ifsign == 0" type="primary" :disabled="record_sign_info == '' ? true : false"  -->

        <el-button @click="dialogFormInfo = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- <sign @cancel="cancel" @imgData="imgData" /> -->
    <!-- <el-dialog :close-on-click-modal="false" title="签名" :visible.sync="dialogFormVisibleSign" @close="sign_close">
      <e560 ref="child" @cancel="cancel" @imgData="imgData" />
    </el-dialog>

    <el-dialog :close-on-click-modal="false" title="查看签名" :visible.sync="dialogFormSign">
      <img :src="record_sign == '' ? record_sign_info : record_sign" alt="">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormSign = false">取消</el-button>
      </div>
    </el-dialog> -->

    <el-dialog :close-on-click-modal="false" title="选择服务" :visible.sync="dialogFormServer">
      <service ref="server" @service_data="service_data" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSend">确定</el-button>
        <el-button @click="dialogFormServer = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  financeInfo,
  createcarcommon,
  financecheck,
  checkCommon,
  servicesCommon,
  obituaryend,
  servicesAdd,
  derateAdd
} from '@/api/manage'
import Pagination from '@/components/Pagination'
import sign from '@/components/Sign'
import e560 from '@/components/E560'
import { statsobituary, excelobituary } from '@/api/stats'
import service from '@/components/Service'
import { vuexData } from '@/utils/mixin'
export default {
  name: 'VueGarden',
  components: { Pagination, sign, service, e560 },
  mixins: [vuexData],
  data() {
    return {
      list: null,
      car: null,
      recetype: null,
      downloadLoading: false,
      index: 1,
      sign_img: {
        send: '',
        voca: '',
        fire: '',
        hall: ''
      },
      index_sign: '',
      sign_img_save: '',
      sign_img_derate: '',
      record_sign: '',
      record_sign_info: '',
      signatureid: '',
      sex: ['男', '女'],
      record_ifsign: '',
      info_list: null,
      activeName: 'first',
      info_temp: {
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
      send: {
        name: '',
        sex: '',
        age: '',
        address: '',
        cid: '',
        recetype: '',
        outtime: null,
        linkman: '',
        totalprice: '',
        linkphone: '',
        driver: '',
        operator: '',
        remark: '',
        id: '',
        oid: ''
      },
      service: {
        id: '',
        name: '',
        operator: '',
        server: null
      },
      row: null,
      derate: {
        name: '',
        age: '',
        sex: '',
        registered: '',
        card: '',
        object: '',
        papers: '',
        serial: '',
        signtime: null,
        oneprice: '',
        twoprice: '',
        threeprice: '',
        totalprice: '',
        operator: '',
        signature: '',
        id: '',
        oid: ''
      },
      save: {
        name: '',
        serial: '',
        startime: null,
        endtime: null,
        signature: '',
        card: '',
        linkman: '',
        linkphone: '',
        linkaddress: '',
        operator: '',
        totalprice: '',
        id: '',
        oid: ''
      },
      serlist: {
        send: null,
        voca: null,
        fire: null,
        hall: null
      },
      check: {
        name: '',
        serial: '',
        startime: null,
        endtime: null,
        signature: '',
        card: '',
        linkman: '',
        linkphone: '',
        linkaddress: '',
        operator: '',
        totalprice: ''
      },
      carsend: null,
      mourn: null,
      cold: null,
      totalprice: 0,
      name: '',
      oid: '',
      total: 0,

      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        startime: null,
        endtime: null,
        search_data: '',
        sort: 'add_time',
        order: 'desc'
      },
      dialogFormCheck: false,
      dialogFormInfo: false,
      dialogFormVisible: false,
      dialogFormVisibleSign: false,
      dialogFormSign: false,
      dialogFormServer: false,
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
    createcarcommon().then(res => {
      this.recetype = res.data.recetype
      this.car = res.data.car
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      statsobituary(this.listQuery)
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
    checkCommon() {

    },
    getCommon(v) {
      const data = { id: this.service.id }
      servicesCommon(data).then(res => {
        this.server = res.data.services
        const data = {
          type: v,
          server: this.server
        }
        this.$refs.server.showService(data)
        this.$refs.server.editService(res.data.servicesOrder)
      })
    },

    handleServer(v) {
      this.service.id = v.id
      this.service.name = v.name
      this.service.operator = v.operator
      this.getCommon(1)
      this.dialogFormServer = true
    },
    service_data(data) {
      this.service.server = data
    },
    handleSend() {
      const data = {
        obituary: this.service,
        pay: 1
      }
      servicesAdd(data).then(res => {
        this.getList()
        this.dialogFormServer = false
        this.$notify.success({
          title: '成功',
          message: '付款成功'
        })
      })
    },
    CarBind(id) {
      for (const i of this.car) {
        if (i.id === id) {
          this.send.driver = i.chauffeur
          this.send.totalprice = i.price
          break
        }
      }
    },
    handleClick(tab, event) {
      this.index = parseInt(tab.index) + 1
      this.checkCommonFn()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sign_open(v) {
      this.index_sign = v
      this.record_sign = ''
      this.record_sign_info = ''
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
      if (this.index_sign == 0) {
        this.record_sign = v
      } else {
        this.record_sign_info = v
      }
    },
    open(v) {
      this.record_sign = v
      this.dialogFormSign = true
    },

    // 减免
    derateSend() {
      this.derate.signature = this.record_sign
      derateAdd(this.derate).then(res => {
        if (res.code == 0) {
          this.dialogFormVisible = false
          this.getList()
          this.$notify.success({
            title: '成功',
            message: '操作成功'
          })
        }
      })
    },

    async handleCheckinfo(v) {
      this.row = v
      await this.checkCommonFn()
      await this.showcheck()
    },
    showcheck() {
      this.dialogFormCheck = true
    },
    checkCommonFn() {
      const data = { id: this.row.id, type: this.index }
      checkCommon(data).then(res => {
        this.rest()
        if (res.data) {
          if (this.index == 1) {
            this.save = Object.assign({}, res.data)
            this.save.operator = this.save.operator == '' ? this.info.realname : this.save.operator
          } else {
            this.send = Object.assign({}, res.data)
            this.send.operator = this.send.operator == '' ? this.info.realname : this.send.operator
          }
        } else {
          if (this.index == 1) {
            this.save.name = this.row.name
            this.save.linkman = this.row.linkman
            this.save.sex = this.row.sex
            this.save.linkphone = this.row.linkphone
          } else {
            this.send.sex = this.row.sex
            this.send.name = this.row.name
            this.send.linkman = this.row.linkman
            this.send.linkphone = this.row.linkphone
          }
        }
      })
    },
    rest() {
      this.save = {
        name: '',
        serial: '',
        startime: null,
        endtime: null,
        signature: '',
        card: '',
        linkman: '',
        linkphone: '',
        linkaddress: '',
        operator: '',
        totalprice: '',
        id: '',
        oid: ''
      }
      this.send = {
        name: '',
        sex: '',
        age: '',
        address: '',
        cid: '',
        recetype: '',
        outtime: null,
        linkman: '',
        totalprice: '',
        linkphone: '',
        driver: '',
        operator: '',
        remark: '',
        id: '',
        oid: ''
      }
    },
    handleEnd(row) {
      this.$confirm('您确认此操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          id: row.id,
          state: 6
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
    createGoData() {
      this.save.oid = this.row.id
      this.send.oid = this.row.id
      if (this.index == 1) {
        const data = {
          step: this.index,
          save: this.save,
          pay: 1
        }
        financecheck(data).then(res => {
          if (res.code == 0) {
            this.getList()

            this.dialogFormCheck = false
            this.$notify.success({
              title: '成功',
              message: '付款成功'
            })
          }
        })
      } else {
        const data = {
          step: this.index,
          send: this.send
        }
        financecheck(data).then(res => {
          if (res.code == 0) {
            this.getList()
            this.dialogFormCheck = false
            this.$notify.success({
              title: '成功',
              message: '付款成功'
            })
          }
        })
      }
    },
    handleInfo(row) {
      this.signatureid = row.id
      this.record_sign_info = ''
      this.totalprice = row.r_totalprice
      this.name = row.name
      this.oid = row.id
      this.info_(row)
    },
    info_(row, type) {
      const data = { id: row.id }
      financeInfo(data)
        .then(res => {
          var server = res.data.branchList
          var servers = Object.values(server)
          if (servers[0].carsend) {
            this.carsend = servers[0].carsend
          }
          if (servers[1].record) {
            this.mourn = servers[1].record.mourn
            this.cold = servers[1].record.cold
          }

          Object.keys(this.serlist).forEach((v, k) => {
            this.serlist[v] = this.solo(servers[k])
            this.sign_img[v] = servers[k].signature
          })
          this.sign_img_derate = res.data.derate.signature
          if (res.data.check) {
            this.sign_img_save = res.data.check.signature
          }
          this.info_temp = res.data.obituary
          this.record_ifsign = res.data.obituary.record_ifsign
          this.record_sign = res.data.obituary.record_sign
          if (res.data.check) {
            this.check = res.data.check
          }
          this.derate = res.data.derate
          this.dialogFormInfo = true
        })
    },
    solo(arr) {
      var editRow = []
      arr.services.forEach((v, k) => {
        editRow.push(v.services)
      })
      return [].concat.apply([], editRow)
    },
    handleDownload() {
      this.downloadLoading = true
      excelobituary(this.listQuery)
        .then(res => {
          this.export_list = res.data
      import('@/vendor/Export2Excel').then(excel => {
        const filterVal = ['farewelltime', 'card', 'name', 'sex', 'nation', 'registered', 'dietime', 'reason', 'linkman', 'linkphone']
        const tHeader = ['火化时间', '身份证号码', '姓名', '性别', '民族', '住址', '死亡原因', '死亡时间', '联系人', '联系电话']
        const data = this.formatJson(filterVal, this.export_list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '火化单'
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

