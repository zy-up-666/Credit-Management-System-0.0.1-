<template>
  <div>
    <el-row>
      <el-col :span="22">
        <el-input type="text" placeholder="请输入名称" v-model="query">
        </el-input>
        <div class="grid-content bg-purple"></div>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="queryName">搜索</el-button>
     </el-col>
    </el-row>
  <!--tableData是表格数据-->   
  <el-table :data="tableData"  stripe style="width:100%" :border="true">
    <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
    <el-table-column 
      v-for="(item,index) in columns"
      :key="index"
      :label="item.label"
      :prop="item.prop"
      :width="item.width"
      align="center"
    >
      <!-- 默认插槽  column是所有列信息，row是当前行信息-->
      <template v-slot="{ column, row }">
          <!-- 如果列的prop的值为status-->
          <div  v-if="column.property === 'status'">
              <!-- 使用两个过滤器来格式化方法，因为后端返回的申请状态是0到7 -->
              <el-tag :type="row[column.property] | statusColor">{{ row[column.property] | status }}   
              </el-tag>
          </div>
          <div  v-else-if="column.property === 'opts'">
            <el-button :disabled="[0, 2, 3, 6].indexOf(row['status']) === -1" @click="editApplication(row)" type="primary">编辑</el-button>
            <el-button  @click="deliteApplication(row.id)"  type="danger">删除</el-button>
            <el-button :disabled="[0, 2, 3, 6].indexOf(row['status']) === -1" @click="submitApplication(row.id)"   type="success">提交审核</el-button>
          </div>
          <div v-else>
              {{ row[column.property] }}
          </div>
            
      </template>
    </el-table-column>  
  </el-table>
  <!-- 分页功能 -->
 <!-- size-change处理页码大小；current-change事件处理当前页变动时候触发的事件。 -->
   <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :hide-on-single-page="value"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageOptions.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="rows">
    </el-pagination>
  <el-dialog title="申请管理-编辑" :visible="dialogVisible"  @close="dialogVisible = false"  width="30%">
      <div class="form-box">
          <el-form ref="updateForm" :model="updateForm" :rules="rules" label-width="80px">
              <el-row>
                  <el-col
                          :xl=20 :lg=20
                          :md=12 :sm=24 :xs=24>
                      <el-form-item label="姓名" prop="name">
                          <el-input  type='input' v-model="updateForm.name" ></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col
                          :xl=20 :lg=20
                          :md=12 :sm=24 :xs=24>
                      <el-form-item label="性别" prop="sex">
                          <el-select  v-model="updateForm.sex" >
                              <el-option
                                         key="man"
                                         label="男"
                                         value="man">
                              </el-option>
                              <el-option
                                         key="woman"
                                         label="女"
                                         value="woman">
                              </el-option>
                          </el-select>
                      </el-form-item>
                  </el-col> 
                  <el-col
                            :xl=20 :lg=20
                            :md=12 :sm=24 :xs=24>
                        <el-form-item label="手机号" prop="mobile_phone">
                            <el-input  type='input' v-model="updateForm.mobile_phone" ></el-input>
                        </el-form-item>
                  </el-col>

              </el-row>
          </el-form>

          <div class="btns clear-fix">
              <div>
                  <el-button type="primary" @click="submitUpdate">提交</el-button>
                  <el-button @click="cleanFrom" >重置</el-button>
              </div>
          </div>

      </div>
  </el-dialog>
  </div>
</template>

<script>

import { getLoanList, updateLoan, deleteLoan, submitApprove } from '@/apis/loan.js'
export default {
  filters: {
    statusColor(status) {
      switch (status) {
        case 0:
          return 'success'
          break
        case 1:
          return ''
          break
        case 2:
          return 'success'
          break
        case 3:
          return 'danger'
          break
        case 4:
          return 'warning'
          break
        case 5:
          return 'success'
          break
        case 6:
          return 'danger'
          break
        case 7:
          return 'success'
          break
        default:
          return 'danger'

      }
    },
    status(status) {
      switch (status) {
        case 0:
          return '进件'
          break
        case 1:
          return '提交初审'
          break
        case 2:
          return '初审通过'
          break
        case 3:
          return '初审拒绝'
          break
        case 4:
          return '提交终审'
          break
        case 5:
          return '终审通过'
          break
        case 6:
          return '终审拒绝'
          break
        case 7:
          return '生成合同'
          break
        default:
          return '出错了'
      }
    }

  },
  data() {
    return {
      dialogVisible: false,   //是否显示对话框
      rows: 0,
      value:false,//数据只有一页隐藏分页
      updateForm: {
        id: 0,
        name: "",
        sex: "",
        mobile_phone:"",
      },
      rules: {
        name: [{ required: true, message: "必须写用户名" }],
        sex:[{required:true,message:"必须写性别"}],
      },
      pageOptions: {
        pageNo: 1,
        pageSize: 10,
      },
      query: "",//名称
      //表格数据
      tableData: [],
      columns: [
        {
          label: "姓名",
          prop: "name",
          width: "80",
        },
        {
          label: "出生日期",
          prop: "birthday",
          width: "160",
        },
        {
          label: "性别",
          prop: "sex",
        },
        {
          label: "教育程度",
          prop: "education",
        },
        {
          label: "居住地址",
          prop: "address1",
        },
        {
          label: "手机号",
          prop: "mobile_phone",
        },
        {
          label: "申请状态",
          prop: "status",
        },
        {
          label: "操作",
          width: "280",
          prop: "opts",
        },
        
      ],

    }
  },
  methods: {
    // 分页用到的方法（源自elementui官网）
    handleSizeChange(val) {
      this.pageOptions.pageSize = val;
      this.getLoanList();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pageOptions.pageNo = val;
      this.getLoanList();
      console.log(`当前页: ${val}`);
    },
    //编辑操作
    async editApplication(row) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.updateForm.id = row.id;
        this.updateForm.name = row.name;
        this.updateForm.sex = row.sex;
        this.updateForm.mobile_phone = row.mobile_phone;
      });
      console.log(row);
    },
    //提交编辑内容
    async submitUpdate(){
      let res = await updateLoan(this.updateForm);
      if (res.data.code === 20000) {
        this.dialogVisible = false;//若成功，更新对话框
        this.getLoanList();//更新数据
      }
    },
    // 提交编辑重置
    cleanFrom() {
      this.$refs.updateForm.resetFields();
    },
    // 删除
     async deliteApplication(id) {
      let res = await deleteLoan(id);
      if (res.data.code === 20000) {
        //删除成功就重新调用一下申请列表的数据
        this.getLoanList();
       }
       console.log("删除", id);
    },
    // 提交审核
     async submitApplication(id) {
       let res = await submitApprove(id); 
       if (res.data.code === 20000) {
         this.getLoanList();
       }
      console.log('审核', id);
    },
    // 模糊查询
    queryName() {
      this.pageOptions.name = this.query;
      let res = this.getLoanList();
      this.pageOptions.name = null;
      console.log(res);
     },
    // 转换生日格式
    getBirthday(date) {
      let dateNow = new Date(date);
      function convert(data) {
        return data < 10 ? "0" + data : data;
      }
      let year = dateNow.getFullYear();
      let month = convert(dateNow.getMonth()+1);
      let day = convert(dateNow.getDate());

      let hours = convert(dateNow.getHours());
      let minutes = convert(dateNow.getMinutes());
      let secounds = convert(dateNow.getSeconds());
      let data = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + secounds;
      // console.log(data);
      return data;

     },
    // 转换性别格式
    getSex(str) { 
      return str === "man" ? "男" : "女";
    },
    // 转换教育程度格式
   getEducation(educationLevel) {
      switch (educationLevel) {
        case 'highschool':
          return '高中毕业';
        case 'college':
          return '专科毕业';
        case 'university':
          return '大学毕业';
        default:
          return '其他';
      }
    },
    async getLoanList() {
      let res = await getLoanList(this.pageOptions);
      // 表格获取数据并调整数据格式
      if (res?.data?.code === 20000) {
        this.tableData = res.data.data.data.data.map((item)=>{
        item.birthday = this.getBirthday(item.birthday);
        item.sex = this.getSex(item.sex);
        item.education = this.getEducation(item.education);
        return item;
        });
      }
      //看一下数据列表有多少数据
      // console.log(res)
      this.rows = res.data.data.rows;
       //申请列表接口返回数据
       console.log(res.data.data.data.data);

     
 
    },
  },
  //页面加载就请求表格数据(异步获取数据)
 mounted() {
   this.getLoanList();
  }
}
</script>

<style lang="scss" scoped>
//表格上面一行两列与斑马纹表格之间的间隙
.el-row{
  margin-bottom: 10px;
}
</style>
