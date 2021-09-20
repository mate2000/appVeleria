<template>
  <!-- muestra el Login que se debe completar como filtro de acceso a la cuenta -->
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card>
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>appVeleria</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Cedula"
                  prepend-icon=""
                  type="number"
                  v-model="id"
                ></v-text-field>

                <v-text-field
                  label="Clave"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!--Aquí en vez de LoginTemp() va solo Login()-->
              <v-btn @click="Login()" color="primary">Ingresar</v-btn>
              <v-btn @click="goToRegister()" color="primary">Registrarme</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<!-- si el login verifica que la cuenta existe y corresponde a un cliente/proveedor, se redirige al home respectivo-->
<script>
import homeClientVue from "./homeClient.vue";
export default {
  layout: "blank",
  beforeMount() {},
  data: () => ({
    id: null,
    password: null,

    users: [],
    userProviders: [],
    onlineUserProvider: {
      fullname: null,
      id: null,
      email: null,
      password: null,
      cellphoneNumber: null,
      entity: null,
      rol: null,
      nameCompany: null,
      typeprovider: null,
      serviceDescription: null,
      averagepunctuation: null,
    },
    onlineUser: {},
  }),
  methods: {
    loadUser(id) {
      let user = {};
      let userProvider = {};
      const url = "http://localhost:3001/users/" + id;
      this.$axios
        .get(url)
        .then((res) => {
          user = res.data.info[0];
          if (user.rol === "P") {
            this.onlineUser = user;
            //this.loadUsersProviders(id);
            this.$router.push("/homeProvider");
          } else {
            this.onlineUser = user;
            localStorage.setItem(
              "onlineUser",
              JSON.stringify(this.onlineUser)
            );
            this.$router.push("/homeClient");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    loadUsersProviders(id) {
      const url = "http://localhost:3001/api/v2/providers/" + id;
      let data = {};
      this.$axios
        .get(url)
        .then((res) => {
          let userProvider = res.data.info[0];
          console.log("userProvider ", userProvider);
          this.onlineUserProvider.nameCompany = userProvider.companyname;
          this.onlineUserProvider.typeprovider = userProvider.typeprovider;
          this.onlineUserProvider.serviceDescription =
            userProvider.servicedescription;
          this.onlineUserProvider.averagepunctuation =
            userProvider.averagepunctuation;
          localStorage.setItem(
            "onlineUserProvider",
            JSON.stringify(this.onlineUserProvider)
          );
        })
        .catch((err) => {
          console.error(err);
        });
    },
    login() {
      let user = this.users.find((x) => x.id == this.id);
      if (user != undefined) {
        if (this.password == user.password) {
          if (user.rol == "Proveedor") {
            let userProvider = this.userProviders.find((x) => x.id == this.id);
            this.onlineUserProvider = user;
            this.onlineUserProvider.nameCompany = userProvider.nameCompany;
            this.onlineUserProvider.typeprovider = userProvider.typeprovider;
            this.onlineUserProvider.serviceDescription =
              userProvider.serviceDescription;
            console.log(this.onlineUserProvider);
            localStorage.setItem(
              "onlineUserProvider",
              JSON.stringify(this.onlineUserProvider)
            );
            this.$router.push("/homeProvider");
          } else {
            this.onlineUserClient = user;
            localStorage.setItem(
              "onlineUserClient",
              JSON.stringify(this.onlineUserClient)
            );
            //Teo aquí la nueva pagina a la que va es /homeTrader y borras ahí si el metodo LoginTemp()
            this.$router.push("/homeClient");
          }
        } else {
          alert("La contraseña no es correcta");
        }
      } else {
        alert("El usuario no tiene una cuenta");
      }

      console.log(this.id, this.password);
    },
    Login() {
      const url = "http://localhost:3001/api/v2/users/login";
      let data = {};
      data.id = this.id;
      data.password = this.password;
      this.$axios
        .post(url, data)
        .then((res) => {
          localStorage.setItem("token", res.data.info);
          this.loadUser(this.id);
        })
        .catch((err) => {
          alert("Usuario o contraseña incorrecta");
        });
    },
    goToRegister() {
      this.$router.push("/register");
    },
  },
};
</script>