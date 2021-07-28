<template>
  <div class="auth-page">
    <b-container>
      <h5 class="auth-logo">
        <i class="fa fa-circle text-primary"></i>
        SatTech
        <i class="fa fa-circle text-danger"></i>
      </h5>
      <Widget class="widget-auth mx-auto" title="<h3 class='mt-0'>Системаға регистрация жасаңыз</h3>" customHeader>
        <p class="widget-auth-info">
            Регистрация жасаңыз.
        </p>
        <form class="mt" @submit.prevent="login">
          <b-alert class="alert-sm" variant="danger" :show="!!errorMessage">
            {{errorMessage}}
          </b-alert>
          <div class="form-group">
            <input class="form-control no-border" ref="first_name" required type="first_name" name="first_name" placeholder="Аты" />
          </div>
           <div class="form-group">
            <input class="form-control no-border" ref="last_name" required type="last_name" name="last_name" placeholder="Тегі" />
          </div>
           <div class="form-group">
            <input class="form-control no-border" ref="email" required type="email" name="email" placeholder="Email" />
          </div>
          <div class="form-group">
            <input class="form-control no-border" ref="login" required type="login" name="login" placeholder="Логин" />
          </div>
          <div class="form-group">
            <input class="form-control no-border" ref="password" required type="password" name="password" placeholder="Password" />
          </div>
          <b-button type="submit" size="sm" class="auth-btn mb-3" variant="inverse">Регистрация</b-button>
          
          <div class="social-buttons">
            <b-button variant="primary" class="social-button mb-2">
              <i class="social-icon social-google"></i>
              <p class="social-text">GOOGLE</p>
            </b-button>
            <b-button variant="success" class="social-button">
              <i class="social-icon social-microsoft"></i>
              <p class="social-text">MICROSOFT</p>
            </b-button>
          </div>
        </form>                
      </Widget>
    </b-container>    
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
      name: "",
      email: "",
      login: "",
      password: "",
      password_confirmation : "",
      is_admin : null
    };
  },
  methods: {
    register() {
      let data = {
        name: this.name,
        email: this.email,
        login: this.login,
        password: this.password,
        is_admin: this.is_admin
      }
      this.$store.dispatch('register', data)
      .then(() => this.$router.push('/'))
      .catch(err => console.log(err))
    }
      
  },
  created() {
    if (window.localStorage.getItem('authenticated') === 'true') {
      this.$router.push('/app/main/analytics');
    }
  },
};
</script>
