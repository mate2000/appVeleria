<template>
  <!-- muestra los campos necesarios para la creación y activación de una cuenta de acceso de un usuario-->
  <div>
    <v-form ref="formRegister" v-model="formRegister" lazy-validation>
      <!-- Se crea el formulario de regsitro de usuario -->

      <v-text-field
        v-model="user.fullname"
        :counter="40"
        :rules="nameRules"
        label="Nombre completo"
        class="mt-md-6 px-md-6"
        required
      ></v-text-field>

      <v-text-field
        v-model="user.id"
        :counter="40"
        :rules="nameRules"
        label="Documento de identidad"
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
        :counter="10"
        :rules="nameRules"
        label="Contraseña"
        type="password"
        class="px-md-6 mx-lg-auto"
        required
      ></v-text-field>

      <v-text-field
        v-model="user.cellphoneNumber"
        :rules="cellphoneNumber"
        label="Numero de celular"
        type="number"
        class="px-md-6 mx-lg-auto"
        required
      ></v-text-field>

      <v-select
        v-model="user.entity"
        :items="entity"
        :rules="[(v) => !!v || 'Item is required']"
        label="Entidad"
        class="px-md-6 mx-lg-auto"
        required
      ></v-select>

      <v-select
        v-model="user.rol"
        :items="rol"
        :rules="[(v) => !!v || 'Item is required']"
        label="Rol"
        class="px-md-6 mx-lg-auto"
        required
      ></v-select>

      <v-checkbox
        v-model="checkbox"
        :rules="[(v) => !!v || 'You must agree to continue!']"
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
    cellphoneNumber: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length == 10) || "",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail es requerido",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    select: null,
    entity: ["Persona juridica", "Persona natural"],
    rol: ["Proveedor", "Cliente"],
    checkbox: false,
    users: [],
    user: {
      fullname: null,
      id: null,
      email: null,
      password: null,
      cellphoneNumber: null,
      entity: null,
      rol: null,
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
        data = this.user;
        this.$axios
          .post(url, data)
          .then((res) => {
            if (this.user.rol == "Proveedor") {
              alert("Proveedor en proceso de registro");
              sessionStorage.setItem("idProvider", this.user.id);
              this.$router.push("/formProvider");
            } else {
              this.createClient();
            }
          })
          .catch((err) => {
            //alert(err.message);
            alert("Error en la creacion del usurio");
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