<template>
  <!-- muestra los campos necesarios para la creación y activación de una cuenta de acceso de un usuario-->
  <div>
    <v-form ref="formRegister" v-model="formRegister" lazy-validation>
      <!-- Se crea el formulario de regsitro de usuario -->

      <v-text-field
        v-model="user.name"
        :counter="40"
        :rules="nameRules"
        label="Nombre"
        class="mt-md-6 px-md-6"
        required
      ></v-text-field>

       <v-text-field
        v-model="user.lastname"
        :counter="40"
        :rules="nameRules"
        label="Apellidos"
        class="mt-md-6 px-md-6"
        required
      ></v-text-field>

      <v-text-field
        v-model="user.id"
        :rules="idRules"
        label="Documento de identidad"
        input
        class="px-md-6 mx-lg-auto"
        required
      ></v-text-field>

      <v-text-field
        v-model="user.age"
        :rules="ageRules"
        label="Edad"
        input
        type="number"
        class="px-md-6 mx-lg-auto"
        required
      ></v-text-field>

      <v-text-field
        v-model="user.email"
        :rules="emailRules"
        label="E-mail"
        class="px-md-6 mx-lg-auto"
        required
      ></v-text-field>

      <v-text-field
        v-model="user.password"
        :counter="15"
        :rules="passwordRules"
        label="Contraseña"
        type="password"
        class="px-md-6 mx-lg-auto"
        required
      ></v-text-field>

      <v-text-field
        v-model="user.cellphoneNumber"
        :rules="cellphoneNumber"
        label="Numero de celular"
        class="px-md-6 mx-lg-auto"
        required
      ></v-text-field>

      <v-text-field
        ref="address"
        v-model="user.address"
        :rules="address"
        label="Direccion"
        counter="25"
        class="px-md-6 mx-lg-auto"
        required
      ></v-text-field>

      <v-select
        v-model="user.rol"
        :items="rol"
        :rules="[(v) => !!v || 'El campo es requerido']"
        label="Rol"
        class="px-md-6 mx-lg-auto"
        required
      ></v-select>

      <v-checkbox
        v-model="checkbox"
        :rules="[(v) => !!v || 'Debes estar de acuerdo para continuar']"
        label="¿Esta de acuerdo con los terminos y condiciones?"
        class="px-md-6 mx-lg-auto"
        required
      ></v-checkbox>

      <v-btn class="mr-4" @click="createUser"> Registrarse </v-btn>
    </v-form>

    <!-- Le informa al usuario de la omisión o error de un campo necesario para la realización del registro-->
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline"> Error </v-card-title>

        <v-card-text> Llene todos los campos </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="accent" text @click="dialog = false"> Cerrar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  layout: "blank",
  beforeMount() {
    //this.loadUsers();
  },
  data: () => ({
    /*Reglas para los campos requeridos en el formulario de registro*/
    valid: true,
    formRegister: null,
    name: "",
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
    select: null,
    rol: ["Proveedor", "Comerciante"],
    checkbox: false,
    users: [],
    user: {
      id:null,
      password:null,
      name:null,
      lastname:null,
      rol:null,
      age:null,
      cellphoneNumber:null,
      email:null,
      address:null
    },
    dialog: false,
  }),

  methods: {
    loadUsers() {
      let users = localStorage.getItem("users");
      if (users != null) {
        this.users = JSON.parse(users);
      }
      console.log(this.users);
    },
    // Una vez validada la existencia ó no de un usuario, se realiza la creación o registro de un usuario nuevo
    createUser() {
      if (this.$refs.formRegister.validate() && this.formRegister) {
        const url = "http://localhost:3001/api/v2/users";
        let data = {};
       
        this.user.rol = this.user.rol == "Proveedor" ? "P" : "C"; 

        data = this.user;
        console.log(data)
        this.$axios
          .post(url, data)
          .then((res) => {
           this.$router.push("/");
          })
          .catch((err) => {
            //alert(err.message);
            alert("Error en la creacion del usuario");
          });
      } else {
        this.dialog = true;
      }
    },

    createClient() {
      const url = "http://localhost:3001/api/v2/clients";
      let data = {};
      data.idClient = this.user.id;
      data.idUser = this.user.id;
      this.$axios
        .post(url, data)
        .then((res) => {
          console.log(res);
          alert("Cliente registrado correctamete");
          this.$router.push("/");
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>
