import { mapGetters, mapActions } from 'vuex'
import { listRole } from '@/api/role'
var that
export const vuexData = {
  filters: {
    group_list(v) {
      var obj = {}
      that.config_group_list.forEach((item, index) => { obj[index + 1] = item })
      return obj[v]
    },
    recetype_list(v) {
      var obj = {}
      that.recetypes.forEach((item, index) => { obj[index + 1] = item })
      return obj[v]
    },
    villages_list(v) {
      var obj = {}
      that.villages.forEach((item, index) => { obj[index + 1] = item })
      return obj[v]
    },
    basic_list(v) {
      var obj = {}
      that.basic.forEach((item, index) => { obj[index + 1] = item })
      return obj[v]
    },
    obituary_list(v) {
      var obj = {}
      that.obituarystate.forEach((item, index) => { obj[index + 1] = item })
      return obj[v]
    },
    service_stype(v) {
      var obj = {}
      that.servicestype.forEach((item, index) => { obj[index + 1] = item })
      return obj[v]
    },
    cremationstate_stype(v) {
      var obj = {}
      that.cremationstate.forEach((item, index) => { obj[index + 1] = item })
      return obj[v]
    },
    type_list(v) {
      var obj = Object.assign({}, that.config_type_list)
      return obj[v]
    },
    branch(v) {
      var obj = {}
      that.branch.forEach((item, index) => { obj[item.id] = item.branch_name })
      return obj[v]
    },
    carFilter(v) {
      const statusMap = { 1: 'primary', 2: 'success', 3: 'danger', 4: 'info', 5: 'warning' }
      return statusMap[v]
    },
    carState(v) {
      const statusMap = { 1: '签收', 2: '出车', 3: '出车', 4: '回馆' }
      return statusMap[v]
    }
  },
  data() {
    return {
      config_type_list: null,
      config_group_list: null,
      recetypes: null,
      cremationstate: null,
      basic: null,
      servicestype: null,
      branch: null,
      villages: null,
      obituarystate: null
    }
  },
  computed: {
    ...mapGetters([
      'info',
      'config'
    ])
  },
  beforeCreate: function() {
    that = this
  },
  created() {
    this.config_group_list = this.filter(this.config.config_group_list) // 1,2,3
    this.recetypes = this.filter(this.config.recetype)
    this.villages = this.filter(this.config.villages)
    this.basic = this.filter(this.config.basic)
    this.cremationstate = this.filter(this.config.cremationstate)
    this.obituarystate = this.filter(this.config.obituarystate)
    this.servicestype = this.filter(this.config.servicestype)

    this.config_type_list = this.filter(this.config.config_type_list) // 0,1,2
    // listRole()
    //   .then(res => {
    //     this.branch = res.data
    //     this.branch = this.branch.filter((v, k) => {
    //       return v.id != 1
    //     })
    //   })
  },
  methods: {
    ...mapActions({

    }),
    filter(str) {
      return (((str.replace(/\s*/g, '')).replace(/\d+/g, '')).substring(1)).split(':')
    }
  }
}

