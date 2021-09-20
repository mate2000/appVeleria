<template>
  <!-- se carga el Home del proveedor el cual dará paso al menú de navegación y aplicación del proveedor-->
  <div>
    <h1>Proveedor</h1>
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
               <!--  <span class="inicialesP">{{ iniciales() }}</span> -->
              </v-avatar>
            </v-col>
            <v-col class="py-0">
              <v-list-item color="rgba(0, 0, 0, .4)" dark>
                <v-list-item-content>
                  <v-list-item-title class="title" v-text="userOnline.nombre">
                  </v-list-item-title>
                  <v-list-item-subtitle
                    v-text="userOnline.email"
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
        ¡Bienvenido, proveedor! Este es tu home, acá, podrás tener acceso a las
        funcionalidades que vienen con tu rol: podrás crear servicios, aceptar
        contratos, editar tu perfil, y en general, podrás estar al tanto de
        todas tus acciones en nuestra página, para que puedas sacarle el mayor
        provecho.
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
//verifica que los metodos estén correctos antes de cargar, subir o actualizar la información
export default {
  beforeMount() {
    this.loadInfo();
    //this.loadUsers();
    //console.log(this.userOnline);

   // console.log(this.iniciales());
  },

  data: () => ({
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
  
    userOnline: {
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
    //carga los usuarios almacenados localmente y convierte sus datos a JSON
    loadInfo() {
      let onlineUser = localStorage.getItem("onlineUser");
      this.userOnline = JSON.parse(onlineUser);
      this.user = this.userOnline;
      //this.iniciales();
    },

    iniciales() {
      let inicialName = "";
      let nameSplit = this.userOnline.fullname.split([]);
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
