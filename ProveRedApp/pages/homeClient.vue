<template>
  <!-- se carga el Home del cliente el cual dará paso al menú de navegación y aplicación del cliente-->
  <div>
    <h1>Cliente</h1>
    <br />
    <br />
    <div class="contenedor">
      <v-card class="mx-auto" max-width="434" tile>
        <v-img
          height="100%"
          src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
        >
          <v-row align="end" class="fill-height">
            <v-col align-self="start" class="pa-0" cols="12">
              <v-avatar
                class="profile"
                color="rgba(88, 115, 187, 0.7)"
                size="164"
                tile
              >
                <span class="inicialesP">{{ iniciales() }}</span>
                <!--<v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>-->
              </v-avatar>
            </v-col>
            <v-col class="py-0">
              <v-list-item color="rgba(0, 0, 0, .4)" dark>
                <v-list-item-content>
                  <v-list-item-title class="title" v-text="userOnlineC.nombre">
                  </v-list-item-title>
                  <v-list-item-subtitle
                    v-text="userOnlineC.correoelectronico"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
        </v-img>
      </v-card>
      <br />
      <br />
      <p id="parCentral">
        ¡Bienvenido, cliente! Este es tu home, acá, podrás tener acceso a las
        funcionalidades que vienen con tu rol: podrás editar tu perfil, mirar
        los contratos activos y terminados, y también podrás darle una reseña a
        los servicios adquiridos, todo esto para que puedas sacarle el mayor
        provecho a nuestra página.
      </p>
    </div>
  </div>
</template>
<style>
#parCentral {
  color: #333;
  position: relative;
  text-align: justify;
  width: 500px;
  height: 120px;
  margin: 10px 0px 0px 0px;
  font-family: Georgia, "Times New Roman", Times, serif;
  /** background-color: rgba(0, 255, 255, 0.3);
      background-color: rgba(88, 115, 187, 0.5);
      border: solid ;
      border-radius: 5px;*/
}

.mx-auto {
  color: #333;
  position: relative;
  text-align: justify;
  width: 500px;
  height: 280px;
  margin: 10px 0px 0px 330px;
  font-family: Georgia, "Times New Roman", Times, serif;
  /** background-color: rgba(0, 255, 255, 0.3);*/
  background-color: rgba(88, 115, 187, 0.5);
  border: solid;
  border-radius: 5px;
}

.contenedor {
  color: #333;
  position: relative;
  text-align: justify;
  width: 530px;
  height: 520px;
  margin: 10px 0px 0px 330px;
  padding: 10px;
  font-family: Georgia, "Times New Roman", Times, serif;
  /** background-color: rgba(0, 255, 255, 0.3);*/
  background-color: rgba(88, 115, 187, 0.5);
  border: solid;
  border-radius: 5px;
}

.inicialesP {
  font-size: 80px;
}
</style>
<script>
export default {
  beforeMount() {
    this.loadInfo();
    this.iniciales();
    //console.log(this.userOnline);
  },
  layout: "defaultClient",
  data: () => ({
    clients: [],
    usersClients: [],
    temp: {
      nombre: null,
      apellidos: null,
      cedulausuario: null,
      correoelectronico: null,
      contraseña: null,
      edad: null,
      numerocelular: null,
      direccion: null,
      rol: null,
    },

    userOnlineT: {
      nombre: null,
      apellidos: null,
      cedulausuario: null,
      correoelectronico: null,
      contraseña: null,
      edad: null,
      numerocelular: null,
      direccion: null,
      rol: null,
    },

    user: {
      nombre: null,
      apellidos: null,
      cedulausuario: null,
      correoelectronico: null,
      contraseña: null,
      edad: null,
      numerocelular: null,
      direccion: null,
      rol: null,
    },
  }),
  methods: {
    loadInfo() {
      let onlineUser = localStorage.getItem("onlineUser");
      this.userOnlineC = JSON.parse(onlineUser);
      this.user = this.userOnline;
    },

    iniciales() {
      let name = this.userOnlineC.nombre;
      let inicialName = "";
      let nameSplit = "";
      console.log("name ", name);
      //debugger
      if (name.includes(" ")) {
        nameSplit = this.userOnlineC.nombre.split([" "]);
        nameSplit = nameSplit[0].toString();
        nameSplit =
          nameSplit.split([]) + " " + this.userOnlineC.apellidos.split([]);
        console.log(nameSplit);
      } else {
        nameSplit =
          this.userOnlineC.nombre.split([]) +
          " " +
          this.userOnlineC.apellidos.split([]);
      }

      for (let i = 0; i < nameSplit.length; i++) {
        if (nameSplit[i - 1] == " ") {
          inicialName = nameSplit[0] + nameSplit[i];
          break;
        }
        //console.log(nameSplit[i])
      }
      return inicialName;
    },
  },
};
</script>
