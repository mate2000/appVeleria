<template>
  <div>
    <h2>
      Para continuar con el proceso de creacion de cuenta, por favor rellene los
      siguientes campos de acuerdo a su informacion como proveedor
    </h2>

    <!-- Se crea el form de proveedor -->

    <v-form ref="formProvider" v-model="formProvider" lazy-validation>
      <v-text-field
        v-model="userProvider.id"
        :counter="40"
        :rules="nameRules"
        label="Documento de identidad"
        disabled
        class="mt-md-6 px-md-6"
        required
      ></v-text-field>

      <v-text-field
        v-model="userProvider.nameCompany"
        :counter="40"
        :rules="nameRules"
        label="Nombre de la empresa"
        class="px-md-6 mx-lg-auto"
        required
      ></v-text-field>

      <v-select
        v-model="userProvider.typeProvider"
        :items="typeProviderSelect"
        :rules="[(v) => !!v || 'Item is required']"
        label="Tipo de proveedor"
        class="px-md-6 mx-lg-auto"
        required
      ></v-select>

      <!-- Aqui el proveedor va a dar detalles sobre su servicio o servicios -->
      <v-textarea
        v-model="userProvider.serviceDescription"
        :counter="300"
        :rules="serviceRules"
        class="px-md-6 mx-lg-auto"
        label="Describa su servicio(s)"
      >
      </v-textarea>

      <v-checkbox
        v-model="checkbox"
        :rules="[(v) => !!v || 'You must agree to continue!']"
        label="¿Esta de acuerdo?"
        class="px-md-6 mx-lg-auto"
        required
      ></v-checkbox>

      <v-btn :disabled="!valid" class="mr-4" @click="finishFormProvider">
        Continuar
      </v-btn>
    </v-form>

    <!-- informa si existe o no un campo por llenar-->
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline"> Error </v-card-title>

        <v-card-text> Llene todos los campos </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="accent" text @click="dialog = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  layout: "blank",
  beforeMount() {
    this.loadUser();
  },

  data: () => ({
    /*Reglas para los campos*/
    valid: true,
    name: "",
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 40) || "",
    ],
    serviceRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 300 && v.length > 20) || "",
    ],
    select: null,
    typeProviderSelect: ["Proveedor formal", "proveedor informal"],
    checkbox: false,
    formProvider: null,
    dialog: false,
    userProvider: {
      /*Estos datos deberan ser almacenados en la bd junto con los nuevos datos que se adquieren en esta pagina*/
      /*fullname: null,
      email: null,
      password: null,
      entity: null,
      rol: null,*/
      id: null,
      nameCompany: null,
      typeProvider: null,
      cellphoneNumber: null,
      serviceDescription: null,
    },
  }),

  methods: {
    loadUser() {
      let id = sessionStorage.getItem("idProvider");
      this.userProvider.id = id;
    },
    //una vez completados todos los campos del formulario se verifica si el proveedor que se intenta crear existe, y continuamente se remite al home del proveedor
    finishFormProvider() {
      // this.userProvider.id = this.users[this.users.length - 1];
      if (this.$refs.formProvider.validate() && this.formProvider) {
        const url = "http://localhost:3001/api/v2/providers";
        let data = {};

        data.idUser = this.userProvider.id;
        data.companyName = this.userProvider.nameCompany;
        data.typeProvider = this.userProvider.typeProvider;
        data.serviceDescription = this.userProvider.serviceDescription;
        //data.averagePunctuation = 0/null;
        this.$axios
          .post(url, data)
          .then((res) => {
            console.log(res);
            alert("Proveedor registrado correctamete");
            this.$router.push("/");
          })
          .catch((err) => {
            console.error(err);
            alert("La persona que intenda crear ya existe");
          });
      } else {
        this.dialog = true;
      }
    },
  },
};
</script>