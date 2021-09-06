<template>
  <!--Se visualizan los proveedores disponibles conjunto con sus respectivos servicios y rango de fechas de disponibilidad-->
  <div>
    <v-data-table
      :headers="headers"
      :items="services"
      :items-per-page="10"
      class="elevation-1"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mdi-phone" @click="getService(item)">
          mdi-phone
        </v-icon>
        <v-icon small @click="addServiceToMyContractsInProcces(item)"> mdi-clipboard-check </v-icon>
      </template>
    </v-data-table>
    <!--Se muestra el dialogo con las opciones de contacto para con el proveedor-->
    <v-dialog v-model="dialogContact" max-width="600px">
      <v-card>
        <v-card-title class="headline"
          >Que opcion de contactos desea usar</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-row style="width: 300px;">
            <v-col cols="12" sm="6">
              <a
                href="https://api.whatsapp.com/send?phone=573137364711&text=Bienvenido"
                target="_blank"
              >
                <v-icon class="mdi-whatsapp">mdi-whatsapp </v-icon>
                <v-icon class="mr-2" style="margin-left: 20px;">mdi-email</v-icon>
              </a>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
          <v-row>
            <v-col cols="12" sm="6">
              <v-btn color="blue darken-1" text @click="cancelDialog()"
                >Cancel</v-btn
              >
            </v-col>
          </v-row>

          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  layout: "defaultClient",
  beforeMount() {
    this.loadInfo();
    console.log(this.contracts);
  },
  //carga y guarda los datos de los servicios de un proveedor en un arreglo
  data() {
    return {
      //servicesUserProviders: [],
      isFalse: false,
      services: [],
      userProviders: [],
      userProvider: {},
      onlineUserClient: {},
      service: {},
      contracts: [],
      contract: {
        idcontract: null,
        idclient: null,
        idprovider: null,
        idservice: null,
        totalneto: null,
        documentcontract: null,
        isaceptedprovider: null,
        isaceptedclient: null,
        isprovidernotified: null,
        isclientnotified: null,
        state: null,
      },
      headers: [
        { text: "id del proovedor", value: "idprovider" },
        { text: "id del servicio", value: "idservice" },
        { text: "Descripcion del servicio", value: "description" },
        { text: "fecha inicial", value: "initdate" },
        { text: "Fecha final", value: "findate" },
        { text: "Valor total", value: "total" },
        { text: "Opciones", value: "actions" },
      ],
      dialogContact: false,
    };
  },
  methods: {
    loadInfo() {
      //let services = localStorage.getItem("services");
      let j = 0;
      //let contracts = localStorage.getItem("contracts");
      const url = "http://localhost:3001/api/v2/services";
      let data = {};
      this.$axios
        .get(url)
        .then((res) => {
          let services = res.data.info;
          console.log("Regist" + services, data);
          let servicesInProcces = []; 
          for(let i = 0; i < services.length; i++){
            if(services[i].state === "En espera"){
              servicesInProcces[j] = services[i];
              j++;
            }
          }
          this.services = servicesInProcces;
          console.log("services", this.services);
        })
        .catch((err) => {
          console.error(err);
        });

      let onlineUserClient = localStorage.getItem("onlineUserClient");
      if (onlineUserClient != null) {
        this.onlineUserClient = JSON.parse(onlineUserClient);
      }
    },
    getService(service) {
      this.dialogContact = true;
      this.contract.idService = service.idService;
      this.contract.idProvider = service.id;
      this.contract.idClient = this.onlineUserClient.id;

      if (this.contracts.length != 0) {
        for (var i = 0; i < this.contracts.length; i++) {
          if (this.contracts.length - 1 == i) {
            this.contract.idContract = i + 2;
          }
        }
      } else {
        this.contract.idContract = 1;
      }

      console.log(this.contract);
      this.contracts.push(this.contract);
      localStorage.setItem("contracts", JSON.stringify(this.contracts));
      this.contract = {
        nameFile: null,
        pathFile: null,

        isTotalAceptedProvider: null,
        isTotalAceptedClient: null,

        isAceptedProvider: null,
        isAceptedClient: null,
        dataFile: null,
      };
    },
    cancelDialog() {
      this.dialogContact = false;
    },
    addServiceToMyContractsInProcces(service){
      //debugger
      console.log("serviceeeeeee", service);
      const url = "http://localhost:3001/api/v2/contracts";
        let data = {};
        data.idclient = this.onlineUserClient.iduser;
        data.idprovider = service.idprovider;
        data.idservice = service.idservice;
        data.totalneto = service.total;
        data.documentcontract = "nn";
        data.isaceptedprovider = this.isFalse;
        data.isaceptedclient = this.isFalse;
        data.isprovidernotified = this.isFalse;
        data.isclientnotified = this.isFalse;
        data.state = "En proceso";
        this.$axios
          .post(url, data)
          .then((res) => {
            alert("Contrado agregado a contratos en proceso");
              //sessionStorage.setItem("idProvider", this.user.id);
              //this.$router.push("/formProvider");
          })
          .catch((err) => {
            //alert(err.message);
            alert("Error en la creacion del contrato");
          });

        //Se cambia el estado del servicio para que este ya no se muestre en "En espera"

        const urlService =
          "http://localhost:3001/api/v2/services/" + service.idservice;
        let dataService = {};
        //dataService.idservice = service.idservice;
        dataService.idprovider = service.idprovider;
        dataService.description = service.description;
        dataService.initdate = service.initdate;
        dataService.findate = service.findate;
        dataService.state = "En proceso";
        dataService.total = service.total;
        console.log("iididididd", service.idservice);
        console.log("hgfgh", dataService);
        this.$axios
          .put(urlService, dataService)
          .then((res) => {
            console.log(res);
            //loadPage();
            this.getService(service);
          })
          .catch((err) => {
            console.error(err);
            alert("Se edito correctamente");
          });
          this.updateScreen();
        //this.getUser();
    },
    updateScreen(){
      window.location.reload();
    },
  },
};
</script>

