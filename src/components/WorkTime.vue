<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  style="max-width: 680px; margin:auto">
      <el-form-item label="pdt" prop="pdtId">
        <el-select v-model="ruleForm.pdtId" placeholder="请选择pdt" style="width: 100%;">
          <el-option
            v-for="(item, index) in pdtList"
            :key="item.index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目名" prop="projectId">
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
            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.dailyDate" style="width: 100%;" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="工作内容" prop="jobContent" required>
       <el-input type="textarea" v-model="ruleForm.jobContent"></el-input>
      </el-form-item>
      <el-form-item label="百分比(%)" prop="percent" required>
       <el-input type="number" v-model="ruleForm.percent"></el-input>
      </el-form-item>
      <el-form-item label="当天耗时(h)" prop="jobDuration">
        <el-input  v-model.number="ruleForm.jobDuration" type="number"></el-input>
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
      if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        } else {
          if (value < 18) {
            callback(new Error('必须年满18岁'));
          } else {
            callback();
          }
        }
    };
    return {
      pdtList: [],
      projectList: [],
      userInfo: [],
      code: '',
      value: '',
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
        percent: ''
      },
      rules: {
        pdtId: [
          { required: true, message: '请选择PDT', trigger: 'change' }
        ],
        project_id: [
          { required: true, message: '请选择项目名称', trigger: 'change' }
        ],
        dailyDate: [
          {required: true, message: '请选择日期', trigger: 'change' }
        ],
        percent: [
          { required: true, message: '请输入百分比', trigger: 'blur' },
          // { min: 1, max: 100, message: '长度在 1 到 100 之间', trigger: 'blur' }
        ],
        jobContent: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        jobDuration: [
          {validator: checkJobDuration, trigger: 'change'},
        ]
      }
    };
  },
  mounted() {
    /**
     * 获取用户 code 授权码, 后台可通过 code 与 access_token 获取用户信息
    */
    // this.pdtList = await this.getPdtList();
    this.getPdtList();
    this.getProjectList();
    this.init()
    
  },
  methods: {
    // 初始化数据, 获取 code, userid, 用户信息
    async init() {
      const data = await this.getUserInfo()
      debugger
    },
    // 通过 corpId 获取用户 code，后台需要通过 code 获取 userid 
    getCode() {
      const that = this
      return new Promise ((resolve, reject) => {
      dd.ready(function() {
    // dd.ready参数为回调函数，在环境准备就绪时触发，jsapi的调用需要保证在该回调函数触发后调用，否则无效。
        dd.runtime.permission.requestAuthCode({
          corpId: "ding971c712e65652d5335c2f4657eb6378f",
          onSuccess: function(result) {
            alert(result.code)
            that.ruleForm.content = result.code
            resolve(result.code)
          },
          onFail : function(err) {}
        });
      });
      })

    },
    // 获取 userId
    getUserId(code) {
      return new Promise ((resolve, reject) => {
        this.$http.get(this.$api.GET_DINGDING_USERID, {'code': '547a9e1fb3ac33ab83f88d2dbbbf4f3a'}).then((req, res) => {
          resolve(res)
          debugger
        }).catch(e => alert(e));
      })
    },
    // 获取用户信息
    getUserInfo() {
      return new Promise ((resolve, reject) => {
        this.$http.get(this.$api.GET_DINGDING_USERINFO, {'user_id': '0555565151841213'}).then((res) => {
          resolve(res)
          this.userInfo = res.data
          debugger
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
    // 获取项目列表
    getProjectList() {
      return new Promise ((resolve, reject) => {
        this.$http.get(this.$api.GET_DINGDING_PROJECT).then((res) => {
          // resolve(res)
          const list = res.data.list;
          let data = [];
          list.forEach(element => {
            data.push({value: element.id, label: element.projectName})
          });
          this.projectList = data;
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
      dd.device.notification.alert({
        message: "提交成功",
        title: "提示",//可传空
        buttonName: "确定",
        onSuccess : function() {
          //onSuccess将在点击button之后回调
          /*回调*/
           this.$refs['ruleForm'].resetFields();
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
