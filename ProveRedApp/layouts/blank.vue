<template>
<!-- Plantilla utilizada para toda pagian que no utilice un menú de navegación o aplicación-->
  <v-app>
    <center>
      <nuxt />
    </center>
  </v-app>
</template>
<script>
export default {
  beforeMount() {
    this.token();
  },

  methods: {
    logout() {
      this.$router.push("/");
      localStorage.setItem("onlineUserClient", {});
    },
    token() {
      let token = localStorage.getItem("token");
      this.$axios.setToken(token, "Bearer");
    },
  },
};
</script>