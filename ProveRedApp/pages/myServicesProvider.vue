<template>
  <!-- Muestra los servicios actuales de un proveedor y permite editar un servicio del proveedor especificando sus diferentes campos o atributos, y activarlo-->
  <div>
    <v-form ref="formEdit" v-model="formEdit" lazy-validation>
      <h1>Mis servicios activos</h1>

      <v-row>
        <v-text-field
          v-model="onlineUserProvider.iduser"
          label="Cedula"
          class="mt-md-6 px-md-6"
          disabled
        ></v-text-field>

        <v-text-field
          v-model="servicesOnlineUserProvider.idservice"
          label="ID del servicio"
          class="mt-md-6 px-md-6"
          disabled
        ></v-text-field>

        <v-text-field
          v-model="servicesOnlineUserProvider.initdate"
          label="Fecha de incio del evento"
          class="mt-md-6 px-md-6"
          type="date"
          required
          :rules="nameRules"
          v-if="editing"
        ></v-text-field>

        <v-text-field
          v-model="servicesOnlineUserProvider.findate"
          label="Fecha final del evento"
          class="mt-md-6 px-md-6"
          type="date"
          required
          :rules="nameRules"
          v-if="editing"
        ></v-text-field>
      </v-row>

      <v-textarea
        v-model="servicesOnlineUserProvider.description"
        :counter="300"
        label="Descripcion"
        style="width: 1000px; margin-left: 12px"
        required
        :rules="nameRules"
        v-if="editing"
      ></v-textarea>

      <v-text-field
        v-model="servicesOnlineUserProvider.total"
        type="number"
        label="Total"
        style="width: 200px; margin-left: 12px"
        required
        :rules="nameRules"
        v-if="editing"
      ></v-text-field>

      <v-col cols="12" md="4">
        <v-btn
          style="width: 300px; height: 40px; margin-left: 0px; margin-top: 16px"
          @click="editService()"
          v-if="editing"
          color="primary"
          >Editar servicio</v-btn
        >
      </v-col>
    </v-form>

    <v-data-table
      style="margin-left: 12px"
      :headers="headers"
      :items="servicesOnlineUserProviders"
      :items-per-page="10"
    >
      <!--class="elevation-1" -->

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="loadService(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteService(item)"> mdi-delete </v-icon>

        <!-- <v-dialog v-model="dialogD" persistent @click="">
          <v-card>
            <v-card-title class="headline">
              Eliminacion de servicio</v-card-title
            >
            <v-card-text>
              ¿Seguro que quieres eliminar este servicio?</v-card-text
            >

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="primary" text @click="Isaccepted = true">
                Aceptar
              </v-btn>
              <v-btn color="primary" text @click="dialogD = false">
                Cancelar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog> -->
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="290" persistent>
      <v-card>
        <v-card-text> Servicio editado con exito, muchas gracias </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" text @click="dialog = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogR" max-width="290">
      <v-card>
        <v-card-title class="headline"> Error </v-card-title>

        <v-card-text> Llene todos los campos </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" text @click="dialogR = false"> Cerrar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
 
<script>
export default {
  beforeMount() {
    this.loadPage();
  },
  //Carga  los datos del servicio requeridos en el dataTable
  data() {
    return {
      Isaccepted: false,
      formEdit: null,
      dialogR: false,
      dialog: false,
      dialogD: false,
      headers: [
        //{ text: "Cedula", value: "iduser" },
        { text: "ID del servicio", value: "idservice" },
        { text: "Fecha de inicio", value: "initdate" },
        { text: "Fecha de finalizacion", value: "findate" },
        { text: "Descripcion", value: "description" },
        { text: "Valor total", value: "total" },
        { text: "Actions", value: "actions" },
      ],

      onlineUserProvider: {},

      servicesOnlineUserProviders: [],
      servicesOnlineUserProvider: {
        iduser: null,
        idservice: null,
        initdate: null,
        findate: null,
        description: null,
        total: null,
      },

      services: [],
      service: {
        iduser: null,
        idservice: null,
        initdate: null,
        findate: null,
        description: null,
        total: null,
      },

      //Indica si esta en un proceso de edicion o no
      editing: false,
      services3: null,
      nameRules: [
        (v) => !!v || "El campo es requerido",
        (v) => (v && v.length <= 40) || "",
      ],
    };
  },
  methods: {
    //Carga y muestra la pagina con los servicios del proveedor
    loadPage() {
      let onlineUserProvider = localStorage.getItem("onlineUserProvider");
      this.onlineUserProvider = JSON.parse(onlineUserProvider);

      const url =
        "http://localhost:3001/api/v2/services/" +
        this.onlineUserProvider.iduser;
      this.$axios
        .get(url)
        .then((res) => {
          console.log(res.data.info);
          let servicesE = [];
          let j = 0;
          let services = res.data.info;
          console.log(services);
          for (let i = 0; i < services.length; i++) {
            if (services[i].state === "En espera") {
              servicesE[j] = services[i];
              //this.servicesOnlineUserProviders = services[i];
              j++;
            }
          }
          this.servicesOnlineUserProviders = servicesE;
          //this.dates(this.servicesOnlineUserProviders);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    loadService(service) {
      this.servicesOnlineUserProvider = service;
      this.editing = true;
      this.services3 = service;
    },
    //permite editar un servicio seleccionado, previamente cargado en los campos de edición
    editService() {
      if (this.$refs.formEdit.validate() && this.formEdit) {
        const url =
          "http://localhost:3001/api/v2/services/" +
          this.servicesOnlineUserProvider.idservice;
        let data = {};
        data.description = this.servicesOnlineUserProvider.description;
        data.initdate = this.servicesOnlineUserProvider.initdate;
        data.findate = this.servicesOnlineUserProvider.findate;
        data.total = this.servicesOnlineUserProvider.total;
        data.id = this.servicesOnlineUserProvider.idservice;
        this.$axios
          .put(url, data)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.error(err);
          });

        // let editedService = this.servicesOnlineUserProvider;
        // console.log(editedService);
        // let idEditedService = editedService.idService;
        // console.log(idEditedService);
        // for (var i = 0; i < this.servicesOnlineUserProvider.length; i++) {
        //   if (this.servicesOnlineUserProvider[i].idService == idEditedService) {
        //     this.servicesOnlineUserProvider[i] = editedService;
        //     break;
        //   }
        // }

        // localStorage.setItem(
        //   "services",
        //   JSON.stringify(this.servicesOnlineUserProviders)
        // );
        this.servicesOnlineUserProvider = {};
        this.editing = false;
        this.dialog = true;
      } else {
        this.dialogR = true;
      }
    },
    deleteService(service) {
      const url = "http://localhost:3001/api/v2/services/" + service.idservice;

      this.$axios
        .delete(url)
        .then((res) => {
          console.log(res);
          this.loadPage();
          //this.dialogD = false;
        })
        .catch((err) => {
          console.error(err);
        });
    },

    dates(servicesOnlineUserProviders) {
      //2020-11-16T00:00:00.000Z
      console.log(this.servicesOnlineUserProvider);
      let initdate = this.servicesOnlineUserProvider.initdate.split("T");
      console.log("dates ", initdate);
    },
  },
};
</script>