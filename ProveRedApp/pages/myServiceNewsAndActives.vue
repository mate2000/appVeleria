<!--
import time
import datetime
-->

<template>
  <!-- permite crear un nuevo servicio del proveedor especificando sus diferentes campos o atributos, y activarlo-->
  <div>
    <!-- campos requeridos para la creación de un nuevo servicio del proveedor-->
    <v-form ref="formService" v-model="formService">
      <v-row align-content="center" justify-content="center">
        <v-col>
          <v-text-field
            v-model="producto.nombreproducto"
            :counter="20"
            :rules="nameRules"
            outlined
            label="Nombre del producto"
            clearable
          >
          </v-text-field>
        </v-col>
      </v-row>

      <v-row align-content="center" justify-content="center">
        <v-col>
          <v-combobox
            v-model="producto.tipoproducto"
            :items="tipos"
            :rules="typeRules"
            clearable
            dense
            hide-selected
            outlined
            label="Tipo de Producto"
          >
          </v-combobox>
        </v-col>
      </v-row>
      <v-row align-content="center" justify-content="center">
        <v-col>
          <v-textarea
            v-model="producto.descripciontamanoproducto"
            auto-grow
            label="Descripcion del tamaño del producto"
             :rules="serviceRules"
            clearable
            outlined
          >
          </v-textarea>
        </v-col>
      </v-row>
      <v-row align-content="center" justify-content="center">
        <v-col>
          <v-textarea
            v-model="producto.descripcionproducto"
            :rules="serviceRules"
            auto-grow
            label="Descripcion general producto"
            clearable
            outlined
          >
          </v-textarea>
        </v-col>
      </v-row>
      <v-row align-content="center" justify-content="center">
        <v-col>
          <v-text-field
            v-model="producto.precioproducto"
            label="Valor del producto"
            :rules="costRules"
            prefix="$"
            type="number"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align-content="center" justify-content="center">
        <v-col>
          <v-text-field
            v-model="producto.codigoproducto"
            :rules="codigoRules"
            label="Codigo del producto"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
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
        <v-card-title class="headline"> Producto  creado </v-card-title>

        <v-card-text> Se ha creado un nuevo producto </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" text @click="dialogCreateService = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn
      @click="createProduct()"
      style="width: 300px; height: 40px; margin-left: 450px; margin-top: 16px"
      color="primary"
      >Nuevo producto</v-btn
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
      (v) => (v && v.length <= 100 && v.length > 1) || "",
    ],
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 40) || "",
    ],
    typeRules: [
      (v) => !!v || "El campo es requerido",
    ],
    costRules: [
      (v) => !!v || "El campo es requerido",
    ],
    codigoRules: [
      (v) => !!v || "El campo es requerido",
    ],
    onlineUserProvider: {},
    producto: {
      cedulausuario: null,
      nombreproducto: null,
      tipoproducto: null,
      descripciontamanoproducto: null,
      descripcionproducto: null,
      precioproducto: null,
      codigoproducto: null,
    },
    tipos: [
      "Vela",
      "Velon",
      "Pascualito",
      "Cirio",
      "Cirio Pascual",
      "Veladora",
    ],
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
      let onlineUser = localStorage.getItem("onlineUser");
      if (onlineUser != null) {
        this.onlineUser = JSON.parse(onlineUser);
      }
    },
    /// Crea un nuevo servicio una vez verificados todas las reglas de los campos del formulario, y lo guarda en el arreglo de servicios
    createProduct() {
      //consol.log(this.onlineUser)
      if (this.$refs.formService.validate() && this.formService) {
        const url = "http://localhost:3001/api/v2/services";
        let data = {};
        this.producto.cedulausuario = this.onlineUser.cedulausuario;
        data = this.producto;
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
