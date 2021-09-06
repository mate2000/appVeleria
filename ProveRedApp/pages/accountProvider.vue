<template>
<!--permite visualizar los campos relacionados con el perfil del proveedor, subir o adjuntar multimedia relacionada, y asi mismo poder actualizarlo-->
  <div>
    <v-form ref="formEdit" v-model="formEdit" lazy-validation>
      <v-container>
        <h1>Cuenta del proveedor</h1>

        <v-row>
          <p>Subir documentos sobre mis servicios</p>

          <p style="margin-left: 290px">Adjuntar informacion</p>
        </v-row>

        <v-row>
          <v-file-input
            truncate-length="15"
            label="Subir multimedia"
            style="width: 410px; height: 50px"
          ></v-file-input>

          <v-file-input
            accept="image/png, image/jpeg, image/bmp"
            label="Fotos del producto o servicio"
            prepend-icon="mdi-camera"
            style="width: 500px; height: 50px; margin-left: 40px"
          ></v-file-input>
        </v-row>

        <v-btn
          @click="sendInfo()"
          style="width: 300px; height: 40px; margin-left: 0px; margin-top: 16px"
          color="primary"
          >Subir ambos archivos
        </v-btn>
      </v-container>

      <v-container style="margin-top: 50px">
        <v-row>
          <v-text-field
            v-model="user.fullname"
            :counter="40"
            :rules="nameRules"
            label="Nombre completo"
            style="margin-left: 30px"
            required
          ></v-text-field>

          <v-text-field
            v-model="user.email"
            :rules="emailRules"
            label="E-mail"
            style="margin-left: 30px"
            required
          ></v-text-field>

          <v-text-field
            v-model="user.password_"
            :counter="10"
            :rules="nameRules"
            label="Contraseña"
            style="margin-left: 30px"
            required
          ></v-text-field>

          <v-text-field
            v-model="user.cellphone"
            :counter="10"
            :rules="cellphone"
            label="Numero de celular"
            style="margin-left: 30px"
            required
          ></v-text-field>
        </v-row>

        <v-row>
          <v-select
            v-model="user.typeprovider"
            :items="typeproviderSelect"
            :rules="[(v) => !!v || 'Item is required']"
            label="Tipo de proveedor"
            class="px-md-6 mx-lg-auto"
            style="width: 300px; margin-left: 0px"
            required
          ></v-select>

          <v-select
            v-model="user.entity"
            :items="entity"
            :rules="[(v) => !!v || 'Item is required']"
            label="Entidad"
            class="px-md-0"
            style="width: 80px; margin-left: 30px"
            required
          ></v-select>

          <v-text-field
            v-model="user.nameCompany"
            :counter="40"
            :rules="nameRules"
            label="Nombre de la Empresa"
            style="width: 80px; margin-left: 30px"
            required
          ></v-text-field>
        </v-row>

        <v-textarea
          v-model="user.serviceDescription"
          :counter="300"
          :rules="serviceRules"
          label="Describa su servicio(s)"
          style="width: 1000px; margin-left: 12px"
        ></v-textarea>

        <v-btn
          style="width: 300px; height: 40px; margin-left: 0px; margin-top: 16px"
          color="primary"
          @click="editUser()"
          >Editar</v-btn
        >
      </v-container>
    </v-form>

    <v-form
      style="margin-top: 50px"
      ref="formDialog"
      v-model="formDialog"
      lazy-validation
    >
      <v-container>
        <h1>!ELIMINAR MI CUENTA¡</h1>

        <p style="width: 970px">
          En esta seccion podras eliminar tu cuenta de proveedor, nos borra la
          sonrisa tu partida, así que te deseamos el mejor de los viajes.
        </p>

        <v-text-field
          v-model="user.iduser"
          label="Cedula"
          style="width: 200px"
          disabled
          required
        ></v-text-field>

        <v-btn
          style="width: 300px; height: 40px; margin-left: 0px; margin-top: 16px"
          color="primary"
          @click="dialog = true"
          >Eliminar cuenta</v-btn
        >
      </v-container>
    </v-form>
    <v-dialog v-model="dialog" max-width="290" persistent>
      <v-card>
        <v-card-title class="headline"> Eliminacion de cuenta </v-card-title>

        <v-card-text>
          ¿Estas seguro de que quieres eliminar tú cuenta?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="deleteAccountProvider1()">
            Aceptar
          </v-btn>
          <v-btn color="primary" text @click="dialog = false"> Cerrar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog2" max-width="290" persistent>
      <v-card>
        <v-card-title class="headline"> Eliminacion de cuenta </v-card-title>

        <v-card-text>
          Ocurrio un error a la hora de eliminar la cuenta, intentalo de nuevo
          más tarde
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" text @click="dialog2 = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>

//verifica que los metodos estén correctos antes de cargar, subir o actualizar la información
export default {
  beforeMount() {
    this.loadInfo();
    //console.log(this.userOnline);
  },

  data: () => ({
    /*Reglas para los campos*/
    formEdit: null,
    formDialog: null,
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 40) || "",
    ],
    email: "",
    entity: ["Persona juridica", "Persona natural"],
    typeproviderSelect: ["Proveedor formal", "Proveedor informal"],
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 40) || "",
    ],

    cellphone: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length == 10) || "",
    ],

    emailRules: [
      (v) => !!v || "E-mail es requerido",
      (v) => /.+@.+\..+/.test(v) || "ingrese un E-mail valido",
    ],
    serviceRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 300 && v.length > 10) || "",
    ],

    dialog: false,
    dialog2: false,

    user: {
      fullname: null,
      iduser: null,
      email: null,
      password_: null,
      typeprovider: null,
      entity: null,
      cellphone: null,
      companyName: null,
      serviceDescription: null,
    },
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
  }),
  methods: {
    loadInfo() {
      let onlineUserProvider = localStorage.getItem("onlineUserProvider");
      this.userOnline = JSON.parse(onlineUserProvider);
      this.user = this.userOnline;
    },

    editUser() {
      if (this.$refs.formEdit.validate() && this.formEdit) {
        const urlProvider =
          "http://localhost:3001/api/v2/providers/" + this.user.iduser;
        let dataProvider = {};

        dataProvider.companyName = this.user.nameCompany;
        dataProvider.typeProvider = this.user.typeprovider;
        dataProvider.serviceDescription = this.user.serviceDescription;
        dataProvider.averagePunctuation = this.user.averagepunctuation;
        this.$axios
          .put(urlProvider, dataProvider)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.error(err);
          });

        const urlUser =
          "http://localhost:3001/api/v2/users/" + this.user.iduser;
        let dataUser = {};
        dataUser.fullname = this.user.fullname;
        dataUser.email = this.user.email;
        dataUser.password = this.user.password_;
        dataUser.cellphoneNumber = this.user.cellphone;
        dataUser.entity = this.user.entity;
        dataUser.rol = this.user.rol;
        dataUser.id = this.user.iduser;
        this.$axios
          .put(urlUser, dataUser)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.error(err);
          });
        this.getUser();
        alert("Se edito correctamente");
      } else {
        alert("ingrese todos los campos");
      }
    },
    // elimina la cuenta del proveedor, guardando su razón para eliminar la cuenta
    deleteAccountProvider1() {
      /**Eliminar los servicios del proveedor al eliminar el proveedor*/
      const url = "http://localhost:3001/api/v2/users/" + this.user.iduser;
      this.$axios
        .delete(url)
        .then((res) => {
          console.log(res);
          //this.dialog = true;
          this.goToMenu();
        })
        .catch((err) => {
          console.error(err);
          this.dialog2 = true;
        });
    },

    goToMenu() {
      this.$router.push("/");
      localStorage.setItem("onlineUserProvider", {});
    },

    getUserProvider() {
      const url = "http://localhost:3001/api/v2/providers/" + this.user.iduser;
      this.$axios
        .get(url)
        .then((res) => {
          let userProvider = res.data.info[0];
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

    getUser() {
      let user = {};
      const url = "http://localhost:3001/users/" + this.user.iduser;
      this.$axios
        .get(url)
        .then((res) => {
          user = res.data.info[0];
          console.log(user);
          this.onlineUserProvider = user;
          
          this.getUserProvider();
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>