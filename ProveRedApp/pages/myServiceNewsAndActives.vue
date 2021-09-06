<!--
import time
import datetime
-->

<template>
  <!-- permite crear un nuevo servicio del proveedor especificando sus diferentes campos o atributos, y activarlo-->
  <div>
    <!-- campos requeridos para la creación de un nuevo servicio del proveedor-->
    <v-form ref="formService" v-model="formService">
      <v-textarea
        v-model="service.description"
        :counter="300"
        :rules="serviceRules"
        class="px-md-6 mx-lg-auto"
        label="Describa su servicio(s)"
      >
      </v-textarea>
      <p style="margin-left: 23px">
        Fecha de inicio y finalizacion del servicio
      </p>
      <p style="margin-left: 23px; width: 290px">
        Seleccione la fecha de inicio y luego la de finalizacion del evento
      </p>

      <v-row style="width: 900px">
        <!-- <v-col cols="12" sm="6"> -->
        <v-date-picker
          v-model="dates"
          style="margin-left: 32px"
          range
          locale="es-CO"
        >
        </v-date-picker>
        <!-- </v-col> -->
        <!-- <v-col cols="12" sm="6"> -->
        <v-text-field
          v-model="dateRangeText"
          label="Fecha Inicio - Fecha Finalizacion"
          prepend-icon="mdi-calendar"
          style="width: 0px; margin-left: 100px"
          :rules="nameRules"
          readonly
        ></v-text-field>
        <!-- model: {{ dates }} -->
        <!-- </v-col> -->
      </v-row>
      <v-text-field
        label="Total"
        prepend-icon=""
        type="number"
        :rules="nameRules"
        style="width: 300px; margin-left: 23px"
        v-model="service.total"
      ></v-text-field>
    </v-form>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline"> Error </v-card-title>

        <v-card-text> Llene todos los campos </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" text @click="dialog = false"> Cerrar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogCreateService" max-width="290">
      <v-card>
        <v-card-title class="headline"> Servicio creado </v-card-title>

        <v-card-text> Se ha creado un nuevo Servicio </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" text @click="dialogCreateService = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn
      @click="createService()"
      style="width: 300px; height: 40px; margin-left: 20px; margin-top: 16px"
      color="primary"
      >Nuevo servicio</v-btn
    >
  </div>
</template>
<script>
export default {
  //Carga la información del usuario/proveedor como base de la creación de un nuevo servicio
  beforeMount() {
    this.loadInfo();
    console.log(this.services);
    console.log(this.onlineUserProvider);
  },
  beforeUpdate() {
    //window.location.reload();
  },
  // Reglas de los campos del formulario para la creación de un nuevo servicio
  data: () => ({
    dialog: false,
    dialogCreateService: false,
    formService: null,
    dates: [],
    serviceRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 300 && v.length > 1) || "",
    ],
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 40) || "",
    ],
    onlineUserProvider: {},
    service: {
      idservice: null,
      idprovider: null,
      description: null,
      initdate: null,
      findate: null,
      state: null,
      total: null,
    },
    services: [],
  }),
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
  },
  methods: {
    //Carga los servicios anteriormente creados en un arreglo
    loadInfo() {
      let onlineUserProvider = localStorage.getItem("onlineUserProvider");
      if (onlineUserProvider != null) {
        this.onlineUserProvider = JSON.parse(onlineUserProvider);
      }
    },
    /// Crea un nuevo servicio una vez verificados todas las reglas de los campos del formulario, y lo guarda en el arreglo de servicios
    createService() {
      if (this.$refs.formService.validate() && this.formService) {
        const url = "http://localhost:3001/api/v2/services";
        let data = {};
        this.service.initdate = this.dates[0];
        this.service.findate = this.dates[this.dates.length - 1];
        this.service.state = "En espera";
        this.service.idprovider = this.onlineUserProvider.iduser;
        data = this.service;
        console.log(data);
        this.$axios
          .post(url, data)
          .then((res) => {
            console.log(res);
            //alert("Servicio registrado correctamete");
            this.dialogCreateService = true;
            this.service = {};
          })
          .catch((err) => {
            alert("Servicio no se pudo registrar correctamete");
            console.error(err);
          });
      } else {
        this.dialog = true;
      }
    },
  },
};
</script>