<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  created() {
      const currentPath = this.$router.history.current.path;

    // if (window.localStorage.getItem('authenticated') === 'false') {
    //   this.$router.push('/login');
    // }
    
    if (currentPath === '/' || currentPath === '/app') {
      this.$router.push('/app/dashboard');
    }

    this.$http.interceptors.response.use(undefined, function (err) {
    return new Promise(function () {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch("logout")
        }
        throw err;
      });
    });
  },
};
</script>

<style src="./styles/theme.scss" lang="scss" />
