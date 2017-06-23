<template>
  <el-form :model="ruleForm2" @submit.prevent="handleSubmit2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">ReplacePlastic Admin: Login</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="ruleForm2.username" placeholder="Nutzername"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="Passwort"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">Login merken</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">Anmelden</el-button>
    </el-form-item>
  </el-form>
</template>

<script> 
  import { auth } from '../api';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          username: [
            { required: true, message: 'Bitte geben Sie Ihren Nutzernamen ein.', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: 'Bitte geben Sie ein Passwort ein.', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      }, 
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            this.logining = true;
            var loginParams = { username: this.ruleForm2.username, password: this.ruleForm2.checkPass };
            auth.login(loginParams).then(res => {
              this.logining = false;
              sessionStorage.setItem('rpp_userdata', JSON.stringify(res.data));
              this.$router.push({ path: '/main' });
            }).catch(err => {
                this.logining = false;
                this.$message({
                  message: err.message,
                  type: 'error'
                });
            });
          } else {
            return false;
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>