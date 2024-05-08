<template>
  <div>
    <el-row>
      <el-col :span="22"><el-input placeholder="请输入名称" type="text" v-model="query"></el-input></el-col>
      <el-col :span="2"><el-button type="primary" @click="setQueryName">搜索</el-button></el-col>
    </el-row>
    <el-table :data="tableData" id="gbox"  :useIndex="true"
              :stripe="true" :border="true" :fit="true" :useMultiSelect="false"
              >
        <el-table-column
                         type="index"
                         label="序号"
                         width="75"
                         align="center"
                         >
        </el-table-column>
        <el-table-column
                         v-for="(col, index) in columns"
                         :key="index"
                         :label="col.label"
                         :prop="col.prop"
                         :width="col.width"
                         align="center"
                         >
           <!--插槽，如果当前列是操作，添加三个按钮-->
            <template v-slot="{ column,row}">
                <div   v-if="column.property==='opts'">
                    <!--5代表终审通过,大于5就代表已经生成合同了，需要禁用-->
                    <el-button :disabled="row['status']>5" @click="createContract(row.id)"  type="primary">生成合同</el-button>
                    <!--7代表生成合同,不等于7需要禁用-->
                    <el-button :disabled="row['status']!==7" @click="downloadContract(row.id)"   type="success">下载合同</el-button>
                </div>
                <div   v-else-if="column.property==='status'">
                    <el-tag :type="row[column.property]===7?'success':''">{{ row[column.property]===7?'生成合同':'未生成合同' }}</el-tag>
                
                </div>
                <div v-else>
                    {{ row[column.property] }}
                </div>
            </template>
        </el-table-column>
    </el-table>


    <!-- 分页器 -->
    <el-pagination 
               @current-change="handleCurrentChange"
               @size-change="updateSize"
               :page-sizes="[5,10,30,40]"
               :page-size="pageOptions.pageSize"
               layout="total, sizes, prev, pager, next, jumper"
               :total="rows"
               >
    </el-pagination >
  </div>
</template>

<script>
import { contractList, generateContract, downloadContract } from '@/apis/loan.js'
import request from '@/utils/request';

export default {
    data() {
        return {
            query: "",
            tableData: [],
            columns: [
            {
                label: "姓名",
                prop: "name",
                width: "100",
            },
            {
                label: "身份证",
                prop: "identity_card",
                width: "260",
            },
            {
                label: "合同状态",
                prop: "status",
                width: "160",
            },
            {
                label: "操作",
                prop: "opts",
            },
            ],
            pageOptions: {
                pageNo: 1,
                pageSize: 10,
                birthday:''
            },
            rows: 0,

         
        };
        
    },
    methods: {
        // 下载合同
        async downloadContract(id) {
            let res = await downloadContract(id);
            console.log(res);
            if (res.data.code === 20000) {
                let fileName = '贷款合同-' + id + ".docx";
                let url = res.data.data.url.replace("/api", "");
                console.log(url);
                let resblob = await request({
                    url,//获取的url直接赋值
                    responseType: "blob",
                });
                // 内存中的临时指向
                let link = window.URL.createObjectURL(resblob.data);
                //创建a标签
                let tagA = document.createElement('a');
                tagA.href = link;
                tagA.document = fileName;
                //隐藏a标签
                tagA.style.display = 'none'
                //向body中添加a标签
                document.body.appendChild(tagA);
                //点击a标签
                tagA.click();
                //释放资源
                document.body.removeChild(tagA);
                //释放临时url
                window.URL.revokeObjectURL(url);
            }
        },
        //生成合同
        async createContract(id) {
            let res = await generateContract(id);
            console.log(res);
            if (res.data.code === 20000) {
                this.getContractList();
            }
        },
        //搜索查询方法
        async setQueryName() {
            this.pageOptions.name = this.query;
            // console.log(this.pageOptions)没有身份证的
            await this.getContractList(this.pageOptions);
            this.pageOptions.name = null
        },
        // 分页器方法
        handleCurrentChange(pageNo) {
            this.pageOptions.pageNo = pageNo
            this.getContractList()
        },
        updateSize(pageSize) {
            this.pageOptions.pageSize = pageSize
            this.getContractList()
        },

        //获取合同列表的数据
        async getContractList() {
            let res = await contractList(this.pageOptions);
            if (res.data.code === 20000) {
                this.tableData = res.data.data.data.data;
                this.rows = res.data.data.rows;
            }
        },
    },
    mounted() {
        this.getContractList();
    }
}
</script>

<style lang="scss" scoped>

.btns {
    text-align: center;
}
.el-row {
    margin-bottom: 10px;
}
//当具有水平滚动条的表格组件的主体包装器元素出现水平溢出时，将水平溢出的部分隐藏，以避免页面出现水平滚动条。
::v-deep .el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: hidden;
}
</style>