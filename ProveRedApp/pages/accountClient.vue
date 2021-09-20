<template>
  <div>
    <v-form ref="formEdit" v-model="formEdit" lazy-validation>
      <v-container>
        <h1>Cuenta del cliente</h1>

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
        </v-row>

        <v-row style="width: 550px; margin-left: 20px">
          <v-text-field
            v-model="user.cellphone"
            :counter="10"
            :rules="nameRules"
            label="Numero de celular"
            required
          ></v-text-field>

          <v-select
            v-model="user.entity"
            :items="entity"
            :rules="[(v) => !!v || 'Item is required']"
            label="Entidad"
            class="px-md-0"
            style="width: 250px; margin-left: 30px"
            required
          ></v-select>
        </v-row>

        <v-btn
          style="width: 300px; height: 40px; margin-left: 0px; margin-top: 16px"
          color="primary"
          @click="editUserClient()"
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
          En esta seccion podras eliminar tu cuenta de cliente, nos borra la
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
          <v-btn color="primary" text @click="deleteAccountClient()">
            Aceptar
          </v-btn>

          <v-btn color="primary" text @click="dialog = false"> Cancelar </v-btn>
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
export default {
  beforeMount() {
    this.loadInfo();
    //console.log(this.userOnline);
  },
  layout: "defaultClient",
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
      ,
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

    onlineUserClient: {},
    user: {
      fullname: null,
      iduser: null,
      email: null,
      password_: null,
      entity: null,
      cellphone: null,
      rol: null,
    },
  }),
  methods: {
    loadInfo() {
      let onlineUserClient = localStorage.getItem("onlineUserClient");
      this.userOnline = JSON.parse(onlineUserClient);
      this.user = this.userOnline;
    },
    editUserClient() {
      const url = "http://localhost:3001/api/v2/users/" + this.user.iduser;
      let data = {};
      data.fullname = this.user.fullname;
      data.email = this.user.email;
      data.password = this.user.password_;
      data.cellphoneNumber = this.user.cellphone;
      data.entity = this.user.entity;
      data.rol = this.user.rol;
      data.id = this.user.iduser;
      this.$axios
        .put(url, data)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
      alert("Se edito correctamente");
      this.getUser();
    },
    deleteAccountClient() {
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
      localStorage.setItem("onlineUserClient", {});
    },
    getUser() {
      let user = {};
      const url = "http://localhost:3001/users/" + this.user.iduser;
      this.$axios
        .get(url)
        .then((res) => {
          user = res.data.info[0];
          console.log(user);
          this.onlineUserClient = user;
          localStorage.setItem(
            "onlineUserClient",
            JSON.stringify(this.onlineUserClient)
          );
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>
<style>
</style>