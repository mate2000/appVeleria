<template>
  <!-- Layout de barra de navegación para las páginas -->
  <!-- Layout Default para el proveedor -->
  <div>
    <v-app>
      <v-navigation-drawer v-model="drawer" app>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Menú</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>
          <v-list-item
            :to="item.route"
            v-for="item in items_menu"
            :key="item.id"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title style="padding: 5px">{{
                item.title
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app color="#0096b8" dense
        ><v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon
        ><v-toolbar-title>Red de proveedores</v-toolbar-title
        ><v-spacer></v-spacer><v-btn @click="logout()">Salir</v-btn></v-app-bar
      >
      <v-main
        ><v-container> <nuxt /> </v-container
      ></v-main>
    </v-app>
  </div>
</template>
<script>
export default {
  beforeMount() {
    this.token();
  },
  data() {
    return {
      drawer: null,
      items_menu: [
        { id: "01", title: "Home", icon: "mdi-home", route: "/homeProvider" },
        {
          id: "02",
          title: "Perfil",
          icon: "mdi-account-edit",
          route: "/accountProvider",
        },
        {
          id: "03",
          title: "Mis servicios",
          icon: "mdi-notebook",
          route: "/myServicesProvider",
        },
        {
          id: "04",
          title: "Mis reseñas",
          icon: "mdi-account-star",
          route: "/myReviewsProvider",
        },
        {
          id: "05",
          title: "Contratos activos",
          icon: "mdi-account-switch",
          route: "/myActiveContractsProvider",
        },
        {
          id: "06",
          title: "Nuevo servicio",
          icon: "mdi-clipboard-account",
          route: "/myServiceNewsAndActives",
        },
        {
          id: "07",
          title: "Contratos en procesos",
          icon: "mdi-book-open",
          route: "/myContractsProcess",
        },
        {
          id: "08",
          title: "Buscar productos",
          icon: "mdi-magnify-plus",
          route: "/searchProducts",
        },
      ],
    };
  },
  methods: {
    logout() {
      this.$router.push("/");
      localStorage.setItem("onlineUserProvider", {});
    },
    token() {
      let token = localStorage.getItem("token");
      this.$axios.setToken(token, "Bearer");
    },
  },
};
</script>
