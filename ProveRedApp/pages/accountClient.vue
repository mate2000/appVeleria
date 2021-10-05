<template>
  <div>
    <v-form ref="formEdit" v-model="formEdit" lazy-validation>
      <v-container>
        <h1>Cuenta del cliente</h1>

        <v-row>
          <v-text-field
            v-model="user.nombre"
            :counter="40"
            :rules="nameRules"
            label="Nombre"
            style="margin-left: 30px"
            required
          ></v-text-field>

           <v-text-field
            v-model="user.apellidos"
            :counter="40"
            :rules="nameRules"
            label="Apellidos"
            style="margin-left: 30px"
            required
          ></v-text-field>

          <v-text-field
            v-model="user.correoelectronico"
            :rules="emailRules"
            label="E-mail"
            style="margin-left: 30px"
            required
          ></v-text-field>

          <v-text-field
            v-model="user.contraseña"
            :counter="15"
            :rules="passwordRules"
            label="Contraseña"
            style="margin-left: 30px"
            required
          ></v-text-field>
        </v-row>

        <v-row style="width: 550px; margin-left: 20px">
          <v-text-field
            v-model="user.numerocelular"
            :rules="cellphoneNumber"
            label="Numero de celular"
            required
          ></v-text-field>

         
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
          v-model="user.cedulausuario"
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
    idRules:[
      (v) => !!v || "El campo es requerido",
      (v) => (v && (v.length === 10 || v.length === 8)) || "Ingrese un numero de identidad correcto", 
    ],
    ageRules:[
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 2) || "Su edad no puede ser mayor a 99",
      (v) => (v && v.length > 1) || "Su edad no puede ser menor a 10" 
    ],
    cellphoneNumber: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length == 10) || "Su numero de celular debe ser de 10 carácteres, omita el '+57'",
    ],
    address:[
          (address) => !!address || 'El campo es requerido',
          (address) =>
            (!!address && address.length <= 25) ||
            'La direccion solo puede ser de maximo 25 caracteres'
    
        ],
    passwordRules:[
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 15) || "La contraseña puede ser de maximo 15 carácteres",
      (v) => (v && v.length >= 8) || "La contraseña tiene que tener minimo 8 carácteres",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail es requerido",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
   

    dialog: false,
    dialog2: false,

    onlineUser: {},
    user: {
      nombre: null,
      apellidos:null,
      cedulausuario: null,
      correoelectronico: null,
      contraseña: null,
      edad: null,
      numerocelular: null,
      direccion:null,
      rol: null,
    },
  }),
  methods: {
    loadInfo() {
      let onlineUser= localStorage.getItem("onlineUser");
      this.userOnline = JSON.parse(onlineUser);
      this.user = this.userOnline;
    },
    editUserClient() {
      const url = "http://localhost:3001/api/v2/users/" + this.user.cedulausuario;
      let data = {};
      data.name = this.user.nombre;
      data.lastname = this.user.apellidos;
      data.email = this.user.correoelectronico;
      data.cellphoneNumber = this.user.numerocelular;
      data.password = this.user.contraseña;
      data.rol = this.user.rol;
      data.id = this.user.cedulausuario;
      this.$axios
        .put(url, data)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
      this.getUser();
    },
    deleteAccountClient() {
      const url = "http://localhost:3001/api/v2/users/" + this.user.cedulausuario;
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
      localStorage.setItem("onlineUser", {});
    },
    getUser() {
      let user = {};
      const url = "http://localhost:3001/users/" + this.user.cedulausuario;
      this.$axios
        .get(url)
        .then((res) => {
          user = res.data.info[0];
          console.log(user);
          this.onlineUser = user;
          localStorage.setItem(
            "onlineUser",
            JSON.stringify(this.onlineUser)
          );
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>
<style></style>
