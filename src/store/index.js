import Vue from 'vue';
import Vuex from 'vuex';

import layout from './layout';
import axios from 'axios';

Vue.use(Vuex);

let store = new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token')|| '',
    user : localStorage.getItem('login')|| '',
    gstar_messages: []
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, suser) {
      
      state.status = 'success'
      state.token = suser.token
      state.user = suser.username
      
    },
    auth_error(state) {
      state.status = 'error'
    },
    logout(state) {
      state.status = ''
      state.token = ''
    }
  },
  actions: {
    // GSTAR_DEVICES_FROM_API({commit}) {
    //   return axios(url, {

    //   })
    // },
    login({commit}, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
           axios({url: 'http://46.101.236.239:5000/user/login', data: user, method: 'POST'})
            .then(resp => {
              const token = resp.data.token              
              
              localStorage.setItem('token', token)
              localStorage.setItem('login', user.username)
              axios.defaults.headers.common['Authorization'] = token
              
              commit('auth_success', {token: token, username: user.username})
              resolve(resp)                        
            })
            .catch(err => {
              commit('auth_error')
              localStorage.removeItem('token')            
              reject(err)
            })
      })
    },
    logout({commit}) {
      return new Promise((resolve) => {
        commit('logout')
        localStorage.removeItem('token')
        delete
        axios.defaults.headers.common['Authorization']
        resolve()
      })      
    }

  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    GSTAR_DEVICES( state ) {
      return state.gstar_messages;
    },
    getUsername(state) {
      return state.username
    },
    getUseraddress(state) {
      return state.getUseraddress
    }


  },
  modules: {
    layout,
  },
});

export default store;