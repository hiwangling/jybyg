<template>
  <div>
    <div class="header">
      花圈挽联及鲜花自助缴费系统
    </div>
    <el-row :gutter="12" style="padding: 0 20px">
      <el-col v-for="(item,index) in list" :key="index" :span="4" shadow="always">
        <el-card>
          <div class="card_">
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566279071968&di=ee1d8ab36650fc69a5a52f101e4024bf&imgtype=0&src=http%3A%2F%2Fstatic.qiuyewang.com%2Ffile%2Fattachments%2F20150518%2Fa1431964006127UK.jpg" alt="" width="160">
            <p>{{ item.title }} <strong style="color:red"> {{ item.price }}</strong> {{ item.unit }}</p>
            <el-input-number v-model="item.num" :min="0" label="描述文字" style="width:150px" @change="handleChange(item)" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <span>{{ sell }}</span>
  </div>
</template>
<script>
import { listwreath } from '@/api/ticket'
export default {
  data() {
    return {
      sell: [],
      list: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      listwreath()
        .then(res => {
          const items = res.data.data
          this.list = items.map(v => {
            this.$set(v, 'num', '0')
            return v
          })
        })
        .catch(() => {
          this.list = []
        })
    },
    handleChange(v) {
      const index = this.sell.indexOf(v)
      if (index > -1) {
        if (v.num == 0) {
          this.sell.splice(index, 1)
        }
      } else {
        this.sell.push(v)
      }
    }
  }
}
</script>
<style scoped>
.header {
    height: 70px;
    text-align: center;
    font-size: 30px;
    color: #fff;
    font-family: '宋体';
    line-height: 70px;
    background: #38BFB9;
    margin-bottom: 5px;
}
.card_{
   height: 250px;
  text-align: center
}
.card_ img{
  display: block;
 margin: 0 auto;
}
</style>
