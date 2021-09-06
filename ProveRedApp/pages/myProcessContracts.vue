<template>

  <div style="width: 30; ">
    <v-container>
      <v-text-field 
        v-model="idSelected"
        label="ID del servicio"
        type = "number"
        style="width: 390px;"
        required
        v-if="disabled"
    ></v-text-field>

    <v-btn 
      color="primary"
      v-if="disabled"
      style="width: 300px; height: 40px; margin-left: 0px; margin-top: 16px" 
      @click="selectContractInProcess()">
      Seleccionar
    </v-btn>
    </v-container>

    <v-container v-if="!isInProcessContract" style="width: 30;">
      <div>
      <v-data-table
        :headers="headers"
        :items="services"
        :items-per-page="10"
        class="elevation-1"
      >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon @click="getService(item)"> mdi-file-send </v-icon>
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

    </v-container>
    <!-- QUITAR LA NEGACION DE EL CONTAINER DE ABAJO AL MOMENTO DE PODER TRABAJAR CON CONTRATOS QUE VENGAN DEL LOCALSTORAGE -->
    <v-container v-if="!isInProcessContract">
      <h1>Mis contratos en proceso</h1>

      <p>Subir documento de el proceso (contrato)</p>
      <v-file-input
        v-model="contractSelected"
        truncate-length="15"
        label="Subir pdf"
        accept =".pdf"
        style="width: 410px; height: 50px;"
      ></v-file-input>

      <v-container v-if="!negotiateInProcess">
        <v-btn color="primary" @click="acceptedContract()" v-if="documentsUp">Aceptar contrato</v-btn>
        <v-btn color="primary" @click="rejectedContract()" v-if="documentsUp">Rechazar contrato</v-btn>
    
        <v-btn color="primary" style="width: 300px; height: 40px; margin-left: 0px; margin-top: 16px"
         @click="upDocuments()" v-else>Subir documento</v-btn>
      </v-container>
      
      <v-btn color="primary" @click="negotiateContract()" v-if="negotiateInProcess">Negociar contrato</v-btn>
      <v-btn color="primary" @click="confirmRejectedContract()" v-if="negotiateInProcess">Comfirmar Rechazar contrato</v-btn>

    </v-container>

    <div>
    <v-dialog v-model="dialog" max-width="360" persistent>
      <v-card>
        <v-card-title class="headline"> Sin contratos en proceso </v-card-title>
        <v-card-text> No tiene contratos en proceso por el momento </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false" color="primary"> Aceptar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog2" max-width="460" persistent>
      <v-card>
        <v-card-title class="headline"> Contrato anteriormente aceptado </v-card-title>
        <v-card-text> Usted ya había aceptado el contrato anteriormente, 
            por favor espere la respuesta del cliente </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog2 = false"> Aceptar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogIsWantAccepted" max-width="360" persistent>
      <v-card>
        <v-card-title class="headline"> ¿Estás seguro? </v-card-title>
        <v-card-text> ¿Está seguro que desea aceptar este contrato? NO habrá vuelta atras;
            (El cliente aún no ha respuesto sobre este contrato). </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="accepted()"> Aceptar </v-btn>
          <v-btn color="primary" text @click="dialogIsWantAccepted = false"> Cancelar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog3" max-width="360" persistent>
      <v-card>
        <v-card-title class="headline"> ¿Estás seguro? </v-card-title>
        <v-card-text> ¿Está seguro que desea aceptar este contrato? NO habrá vuelta atras;
            (El cliente ya ha aceptado este contrato). </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="accepted()"> Aceptar </v-btn>
          <v-btn color="primary" text @click="dialog3 = false"> Cancelar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogTotalRejected" max-width="360" persistent>
      <v-card>
        <v-card-title class="headline"> ¿Estás seguro? </v-card-title>
        <v-card-text> ¿Está seguro que desea rechazar este contrato? NO habrá vuelta atras;
            (El cliente ya ha aceptado este contrato). </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="rejected()"> Aceptar </v-btn>
          <v-btn color="primary" text @click="dialogTotalRejected = false"> Cancelar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogIsWantRejected" max-width="360" persistent>
      <v-card>
        <v-card-title class="headline"> ¿Estás seguro? </v-card-title>
        <v-card-text> ¿Está seguro que desea rechazar este contrato? NO habrá vuelta atras;
            (El cliente aún no ha respuesto sobre este contrato). </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="rejected()"> Aceptar </v-btn>
          <v-btn color="primary" text @click="dialogIsWantRejected = false"> Cancelar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogRejected2" max-width="460" persistent>
      <v-card>
        <v-card-title class="headline"> Contrato anteriormente rechazado </v-card-title>
        <v-card-text> Usted ya había rechazado el contrato anteriormente, 
            por favor espere la respuesta del cliente </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogRejected2 = false"> Aceptar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogRejected3" max-width="360" persistent>
      <v-card>
        <v-card-title class="headline"> ¿Estás seguro? </v-card-title>
        <v-card-text> ¿Está seguro que desea rechazar este contrato? NO habrá vuelta atras;
            (El cliente ya ha rechazado este contrato). </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="rejected()"> Aceptar </v-btn>
          <v-btn color="primary" text @click="dialogRejected3 = false"> Cancelar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="negotiationContractDialog" max-width="360" persistent>
      <v-card>
        <v-card-title class="headline"> Hablale </v-card-title>
        <v-card-text>Dirigite al cliente y dile que dialogen de nuevo sobre los terminos para intentar
            llegar a un nuevo acuerdo
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="negotiationContractDialog = false"> Aceptar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    </div>

    </div>
</template>
<script>
export default {
  beforeMount() {
    this.loadInfo();
    /** HACER QUE CUANDO SE ENTRE A ESTA PESTAÑA SE MIRE SI TIENE ALGUNA NOTIFICACION PENDIENTE */
  },
  layout: "defaultClient",
  beforeUpdate() {
  },
  data: () => ({
    //class="mt-md-6 px-md-6"
    
    isaceptedprovider2: null,
    isaceptedclient2: null,
    isprovidernotified2: null,
    isclientnotified2: null,
    
    contractsToUpdateNameDocument: [],
    serviceSelected: [],
    disabled: true,
    idSelected: null,
    contractSelected: null,
    services: [],
    onlineUserClient: [],
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

    dialog: false,
    dialog2: false,
    dialog3: false,
    dialogContact: false,
    dialogIsWantAccepted: false,
    dialogTotalRejected: false,
    dialogIsWantRejected: false,
    dialogRejected2: false,
    dialogRejected3: false,
    negotiationContractDialog: false,

    isInProcessContract: false,
    documentsUp: false,
    negotiateInProcess: false,

    headers: [
        { text: "id del proovedor", value: "idprovider" },
        { text: "id del servicio", value: "idservice" },
        { text: "Descripcion del servicio", value: "description" },
        { text: "fecha inicial", value: "initdate" },
        { text: "Fecha final", value: "findate" },
        { text: "Valor total", value: "total" },
        { text: "Opciones", value: "actions" },
      ],
}),
methods: {
    loadInfo() {
      //debugger
      let onlineUserClient = localStorage.getItem("onlineUserClient");
      if (onlineUserClient != null) {
        this.onlineUserClient = JSON.parse(onlineUserClient);
      }

      //let contracts = localStorage.getItem("contracts");
      let contracts = []
      const url = "http://localhost:3001/api/v2/contracts/" + this.onlineUserClient.iduser;
      this.$axios
        .get(url)
        .then((res) => {
          contracts = res.data.info;
          console.log("cont", contracts);
          this.contracts = contracts;
          this.contractsToUpdateNameDocument = contracts;
          console.log("contractss", this.contracts);
          this.disabled = true;
        })
        .catch((err) => {
          console.error(err);
        });

      //let contracts = localStorage.getItem("contracts");
      let j2 = 0;

      const url2 = "http://localhost:3001/api/v2/services";
      let data2 = {};
      this.$axios
        .get(url2)
        .then((res) => {
          //debugger
          let services = res.data.info;
          console.log("services", services);
          let servicesInProcces = []; 
          for(let i = 0; i < services.length; i++){
            if(services[i].state === "En proceso"){
              servicesInProcces[j2] = services[i];
              j2++;
            }
          }
          console.log("servicesInProcces", servicesInProcces);
          let servicesForClient = [];
          let l = 0; 
          for(let k = 0; k < contracts.length; k++){
            for(let h = 0; h < servicesInProcces.length; h++){
              if(this.contracts[k].idservice == servicesInProcces[h].idservice){
                servicesForClient[l] = servicesInProcces[h];
                l++;
              }
            }
          }
          console.log("servicesForClient", servicesForClient);

          this.services = servicesForClient;
          console.log("servicesasdf", this.services);
        })
        .catch((err) => {
          console.error(err);
        });

    },
    selectContractInProcess(){
      console.log("asdjfasdjfk", this.idSelected);
      let j = 0;

      let servicesSelectedInProcces = []
      //servicesSelectedInProcces = this.services.idservice = this.idSelected;
      for(let i = 0; i < this.services.length; i++){
        if(this.services[i].idservice == this.idSelected){
          servicesSelectedInProcces[j] = this.services[i];
          j++;
        }
      }
      j = 0;
      if(servicesSelectedInProcces[0] != null) {
        this.disabled = false;
        this.services = servicesSelectedInProcces;
        this.serviceSelected = servicesSelectedInProcces;
        alert("Servicio " + this.idSelected + " seleccionado.");
      }else{
        alert("Seleccione un servicio existente.");
        this.idSelected = "";
      }
    },
    upDocuments(){
        if(this.contractSelected != null){
        //CODIGO PARA ACTUALIZAR EL NOMBRE DEL CONTRATO EN LA TABLA CONTRATOS, ADEMAS DE SUBIR EL DOCUMENTO
        console.log("contract name", this.contractSelected.name);
        
        let contractSelectedToUpdate = [];
        for(let i = 0; i < this.contractsToUpdateNameDocument.length; i++){
          if(this.contractsToUpdateNameDocument[i].idservice == this.idSelected){
            contractSelectedToUpdate = this.contractsToUpdateNameDocument[i];
          }
        }

        this.isaceptedprovider2 = contractSelectedToUpdate.isaceptedprovider;
        this.isaceptedclient2 = contractSelectedToUpdate.isaceptedclient;
        this.isclientnotified2 = contractSelectedToUpdate.isclientnotified;
        this.isprovidernotified2 = contractSelectedToUpdate.isprovidernotified;

        console.log("isaceptedprovider2", this.isaceptedprovider2);
        console.log("55555", contractSelectedToUpdate);

        let nameContractttt = this.contractSelected.name + " ";
        nameContractttt.replace(".pdf", " ");
        console.log("nameContract", nameContractttt);
        //Se cambia el estado del servicio para que este ya no se muestre en "En espera"
        const urlContract =
          "http://localhost:3001/api/v2/contracts/" + contractSelectedToUpdate.idcontract;
        let dataContract = contractSelectedToUpdate;
        //dataService.idservice = service.idservice;
        //dataContract.idcontract = contractSelectedToUpdate.idcontract; 
        //dataContract.idclient = this.onlineUserClient.iduser;
        //dataContract.idprovider = contractSelectedToUpdate.idprovider;
        //dataContract.idservice = contractSelectedToUpdate.idservice;
        dataContract.totalneto = parseInt(contractSelectedToUpdate.totalneto + 0);
        dataContract.documentcontract = nameContractttt;
        //dataContract.isaceptedprovider = this.isaceptedprovider2;
        dataContract.isaceptedclient = this.isaceptedclient2;
        //dataContract.isprovidernotified = this.isprovidernotified2;
        //dataContract.isclientnotified = this.isclientnotified2;
        //dataContract.state = contractSelectedToUpdate.state;
        console.log("hgfgh", dataContract);
        this.$axios
          .put(urlContract, dataContract)
          .then((res) => {
            console.log(res);
            //loadPage();
            //this.getService(service);
          })
          .catch((err) => {
            console.error(err);
            alert("Se edito correctamente");
          });
          //this.updateScreen();
        //this.getUser();
        }else{
            alert("Suba el documento pertinenete por favor");
        }
    },
    acceptedContract(){
        if(this.contract.isTotalAceptedProvider == null && this.contract.isTotalAceptedClient == null){
            this.dialogIsWantAccepted = true;
        }else{
            if(this.contract.isTotalAceptedProvider == true && this.contract.isTotalAceptedClient == null){
                this.dialog2 = true;
            }else{
                if( this.contract.isTotalAceptedProvider == null && this.contract.isTotalAceptedClient == true){
                    this.dialog3 = true;
                }
            }
        }
    },
    rejectedContract(){
        
        this.negotiateInProcess = true;
        //this.isInProcessContract = true;
    },
    negotiateContract(){
        //this.negotiationContractDialog = true;
        alert("Dirigite al cliente y dile que dialogen de nuevo sobre los terminos para intentar llegar a un nuevo acuerdo");
        this.$router.push("/homeProvider");
    },
    confirmRejectedContract(){
        if(this.contract.isTotalAceptedProvider == null && this.contract.isTotalAceptedClient == null){
            this.dialogIsWantRejected = true;
        }else{
            if(this.contract.isTotalAceptedProvider == false && this.contract.isTotalAceptedClient == null){
                this.dialogRejected2 = true;
            }else{
                if( this.contract.isTotalAceptedProvider == null && this.contract.isTotalAceptedClient == false){
                    this.dialogRejected3 = true;
                }
            }
        }
        //this.dialogTotalRejected = true;
    },
    accepted(){
        alert("El contrato fue aceptado con exito");
        //console.log("answer: ", this.contract.isTotalAceptedProvider);  
        this.contract.isTotalAceptedProvider = true;
        //console.log("answer: ", this.contract.isTotalAceptedProvider);

        this.dialogIsWantAccepted = false;
        if(this.contract.isTotalAceptedProvider == true && this.contract.isTotalAceptedClient == true){
            /**AQUI VA LA PARTE DEL CODIGO EN LA QUE PASA A CONTRATO ACTIVO Y SE NOTIFICA AL CLIENTE*/
        }
    },
    rejected(){
        alert("El contrato fue rechazado con exito");
        
        this.contract.isTotalAceptedProvider = false;
        this.dialogIsWantRejected = false;
        
        if(this.contract.isTotalAceptedProvider == false && this.contract.isTotalAceptedClient == false){
            /**AQUI VA LA PARTE DEL CODIGO EN LA QUE SE ELIMINA EL CONTRATO DESPUES DE NOTIFICAR AL CLIENTE*/
        }
    },
},
};
</script>