<template>
  <div class="auth-page">
    <b-container>
      <h5 class="auth-logo">
        <i class="fa fa-circle text-primary"></i>
        SatTech
        <i class="fa fa-circle text-danger"></i>
      </h5>
      <Widget class="widget-auth mx-auto" title="<h3 class='mt-0'>SatTech порталына қош келдіңіз!</h3>" customHeader>
        <p class="widget-auth-info">
            Электрондық почтаңызды қолданып системаға кіріңіз
        </p>
        <form class="mt" @submit.prevent="login">
          <b-alert class="alert-sm" variant="danger" :show="!!errorMessage">
            {{errorMessage}}
          </b-alert>
          <div class="form-group">
            <input class="form-control no-border" ref="username" required type="username" name="username" placeholder="Логин" v-model="username"/>
          </div>
          <div class="form-group">
            <input class="form-control no-border" ref="password" required type="password" name="password" placeholder="Пароль" v-model="password" />
          </div>
          <b-button type="submit" size="sm" class="auth-btn mb-3" variant="inverse">Кіру</b-button>
          <!-- <p class="widget-auth-info">or sign in with</p>
          <div class="social-buttons">
            <b-button variant="primary" class="social-button mb-2">
              <i class="social-icon social-google"></i>
              <p class="social-text">GOOGLE</p>
            </b-button>
            <b-button variant="success" class="social-button">
              <i class="social-icon social-microsoft"></i>
              <p class="social-text">MICROSOFT</p>
            </b-button>
          </div> -->
        </form>
        <!-- <p class="widget-auth-info">
          Аккаунтыңыз жоқ болса, тіркеліңіз!
        </p>
        <router-link class="d-block text-center" to="login">Тіркелу</router-link> -->
      </Widget>
    </b-container>
    <footer class="auth-footer">
      2020 &copy; SatTech порталы
    </footer>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';

//import axios from 'axios'
//import router from '../../Routes'

export default {
  name: 'LoginPage',
  components: { Widget },
  data() {
    return {
      errorMessage: null,
      username: "",
      password: ""
    };
  },
  methods: {
    login() {      
      let username = this.username
      let password = this.password

      this.$store.dispatch('login', {
        username, password
      }).then(() => this.$router.push('/app/dashboard','/login'))
      .catch(err => console.log(err))
    },
  },
  // created() {
  //   if (window.localStorage.getItem('authenticated') === 'true') {
  //     this.$router.push('/app/main/analytics');
  //   }
  // },
};
</script>
