<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  style="max-width: 680px; margin:auto">
      <el-form-item label="pdt" prop="pdtId" required>
        <el-select v-model="ruleForm.pdtId" placeholder="请选择pdt" style="width: 100%;" @change="pdtChange">
          <el-option
            v-for="(item, index) in pdtList"
            :key="item.index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目名" prop="projectId" required>
        <el-select v-model="ruleForm.projectId" placeholder="请选择项目名" style="width: 100%;">
          <el-option
             v-for="(item, index) in projectList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期" required>
        <el-col :span="24">
          <el-form-item prop="dailyDate">
            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.dailyDate" style="width: 100%;" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="进度百分比(%)" prop="percent" class="is-required" >
       <el-input type="number" v-model.number="ruleForm.percent" min="0" placeholder="请输入百分比"></el-input>
      </el-form-item>
      <el-form-item label="当天耗时(h)" prop="jobDuration" class="is-required">
        <el-input  v-model.number="ruleForm.jobDuration" type="number" min="0" placeholder="请输入当天耗时"></el-input>
      </el-form-item>
      <el-form-item label="工作内容" prop="jobContent" class="is-required">
       <el-input type="textarea" v-model="ruleForm.jobContent"></el-input>
      </el-form-item>
      <el-form-item label="困难和求助" prop="difficultiesAppeals">
       <el-input type="textarea" v-model="ruleForm.difficultiesAppeals"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')" style="margin-top: 16px">提交申请</el-button>
    </el-form>
</template>
<script>
import axios from 'axios'
import * as dd from 'dingtalk-jsapi'
export default {
  data() {
    const checkJobDuration = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('当天耗时不能为空'));
      }
      if (!Number.isInteger(value / 0.5)) {
          callback(new Error('请输入0.5的倍数'));
        } else {
          if (value > 24) {
            callback(new Error('当天耗时不能超过24小时'));
          } else if (value < 0) {
            callback(new Error('当天耗时不能为负数'));
          } else {
            callback();
          }
        }
    };
    const checkPercent = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('百分比不能为空'));
      }
      if (!Number.isInteger(value)) {
          callback(new Error('百分比必须是数字'));
        } else {
          if (value > 100) {
            callback(new Error('百分比不能大于100'));
          } else if(value < 0) {
            callback(new Error('百分比不能为负数'));
          } else {
            callback();
          }
        }
    };
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      pdtList: [],
      projectList: [],
      userInfo: [],
      code: '',
      show: false,
      radio: '1',
      placeholder: 'pat',
      readonly: 'readonly',
      type: 'number',
      ruleForm: {
        pdtId: '',
        projectId: '',
        dailyDate: '',
        jobDuration: '',
        jobContent: '',
        percent: '',
        difficultiesAppeals: ''
      },
      rules: {
        pdtId: [
          { required: true, message: '请选择PDT', trigger: 'change' }
        ],
        projectId: [
          { required: true, message: '请选择项目名称', trigger: 'change' }
        ],
        dailyDate: [
          {required: true, message: '请选择日期', trigger: 'change' }
        ],
        percent: [
          { validator: checkPercent, required: true, trigger: 'blur' },
          // { min: 1, max: 100, message: '长度在 1 到 100 之间', trigger: 'blur' }
        ],
        jobContent: [
          { required: true, message: '请输入工作内容', trigger: 'blur' },
          { max: 300, message: '长度不能大于 300 个字符', trigger: 'blur' }
        ],
        difficultiesAppeals: [
          { max: 300, message: '长度不能大于 300 个字符', trigger: 'blur' }
        ],
        jobDuration: [
          {validator: checkJobDuration, trigger: 'blur'},
        ]
      }
    };
  },
  mounted() {
    /**
     * 获取用户 code 授权码, 后台可通过 code 与 access_token 获取用户信息
    */
    // this.pdtList = await this.getPdtList();
    const date = new Date()
    this.ruleForm.dailyDate = date.getFullYear() + '-' + Number(date.getMonth() + 1) + '-' + date.getDate()
    this.getPdtList();
  
    this.init()
    
  },
  methods: {
    // 初始化数据, 获取 code, userid, 用户信息
    async init() {
      const code = await this.getCode()
      const userId = await this.getUserId(code)
      this.getUserInfo(userId)
     
      debugger
    },
    // 通过 corpId 获取用户 code，后台需要通过 code 获取 userid 
    getCode() {
      const that = this
      return new Promise ((resolve, reject) => {
      dd.ready(function() {
    // dd.ready参数为回调函数，在环境准备就绪时触发，jsapi的调用需要保证在该回调函数触发后调用，否则无效。
        dd.runtime.permission.requestAuthCode({
          // corpId: "ding971c712e65652d5335c2f4657eb6378f",
          corpId: "ding4b1a8642b4684ac5f2c783f7214b6d69",
          onSuccess: function(result) {
            resolve(result.code)
          },
          onFail : function(err) {
            alert(err)
          }
        });
      });
      })

    },
    // 获取 userId
    getUserId(code) {
      return new Promise ((resolve, reject) => {
        this.$http.get(this.$api.GET_DINGDING_USERID, {'code': code}).then((res) => {
          resolve(res.data.userid)
        }).catch(e => alert(e));
      })
    },
    // 获取用户信息
    getUserInfo(userId) {
      return new Promise ((resolve, reject) => {
        this.$http.get(this.$api.GET_DINGDING_USERINFO, {'user_id': userId}).then((res) => {
          this.userInfo = res.data
        }).catch(e => alert(e));
      })
    },
    // 获取 pdt 列表
    getPdtList() {
      return new Promise ((resolve, reject) => {
        this.$http.get(this.$api.GET_DINGDING_PDT).then((res) => {
          // resolve(res)
          const list = res.data.list;
          let data = [];
          list.forEach(element => {
            data.push({value: element.id, label: element.pdtName})
          });
          this.pdtList = data;
          debugger
        }).catch(e => alert(e));
      }) 
    },
    // 监听 change 事件
    pdtChange(id) {
      this.getProjectList(id)
    },
    // 根据 pdtId 获取项目列表
    getProjectList(id) {
      this.projectList = [];
      this.ruleForm.projectId = '';
      return new Promise ((resolve, reject) => {
        this.$http.get(this.$api.GET_DINGDING_PROJECT, {pdtId: id}).then((res) => {
          // resolve(res)
          const list = res.data.list;
          let data = [];
          list.forEach(element => {
            data.push({value: element.id, label: element.projectName})
          });
          this.projectList = data;
          this.ruleForm.projectId = data.length != 0 ? data[0].value : '';
          debugger
        }).catch(e => alert(e));
      })  
    },
    // 提交采集数据
    submitForm(formName) {
      this.$refs['ruleForm'].validate((valid) => {
        debugger
        const data = this.userInfo
        let obj = {dingTalkUserId: data.userid, dingTalkUserName: data.name, departmentId: data.department[0], jobNumber: data.jobnumber, position: data.position}
        let params = Object.assign(this.ruleForm, obj)
        if (valid) {
          this.$http.post(this.$api.GET_DINGDING_DAILY, params).then((res) => {
          // resolve(res)
          if (res.data === 1) {
            // 弹出钉钉弹框
            this.alertSuccess()
          }
          debugger
        }).catch(e => console.log(e));
      
        } else {
          console.log('验证失败!!');
          return false;
        }
      });
    },
    alertSuccess() {
      const that = this
      dd.device.notification.alert({
        message: "提交成功",
        title: "提示",//可传空
        buttonName: "确定",
        onSuccess : function() {
          //onSuccess将在点击button之后回调
          /*回调*/
          // that.$refs['ruleForm'].resetFields();
          that.ruleForm.difficultiesAppeals = '';
          that.ruleForm.percent = '';
          that.ruleForm.jobDuration = '';
          that.ruleForm.jobContent = '';
        //   dd.biz.navigation.goBack({
        //     onSuccess : function(result) {
        //         /*result结构
        //         {}
        //         */
        //     },
        //     onFail : function(err) {}
        // })

        },
        onFail : function(err) {}
      });
    },
  },
};
</script>

<style>
.el-form-item {
    margin-bottom: 10px;
}
</style>
