<template>
  <!--Se visualizan los proveedores disponibles conjunto con sus respectivos servicios y rango de fechas de disponibilidad-->
  <div>
    <v-data-table
      :headers="headers"
      :items="inventoriesProviders"
      :items-per-page="10"
      class="elevation-1"
      max-width="6000"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mdi-phone" @click="getNumberProvider(item)">
          mdi-phone
        </v-icon>
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
              <a v-bind:href="this.cellphoneM(this.cellphone)">              
                <v-icon class="mdi-whatsapp" >mdi-whatsapp </v-icon>
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
    this.loadInventories();
    //this.cellphoneM();
    this.obtain
  },
  //carga y guarda los datos de los servicios de un proveedor en un arreglo
  data() {
    return {
      cellphone: "",
      users: [],
      inventoriesProviders: [],
      headers: [
        { text: "Nombre producto", value: "nombreproducto"},
        { text: "Tipo producto", value: "tipoproducto"},
        { text: "Tamaño", value: "descripciontamanoproducto"},
        { text: "Descripcion", value: "descripcionproducto"},
        { text: "Precio", value: "precioproducto"},
        { text: "Codigo", value: "codigoproducto"},
        { text: "Celular", value: "numerocelular"},
        { text: "Opciones", value: "actions" },
      ],
      dialogContact: false,
    };
  },
  methods: {
    loadInventories() {
      const url = "http://localhost:3001/api/v2/inventoryProvider";
      let data = {};
      this.$axios
        .get(url)
        .then((res) => {
          let inventoriesProviders = res.data.info;
          //this.inventoriesProviders = inventoriesProviders;

          const url2 = "http://localhost:3001/users"; 
          this.$axios
          .get(url2)
          .then((res) => {
            let users = res.data.info;
            //this.users = users;
            //console.log("Usuarios: ", users, data);
            //this.inventoriesProviders = inventoriesProviders;
            //debugger
            console.log("INVENTORY DATA:", inventoriesProviders);
            console.log("USERS DATA: ", users)

            for(let i = 0; i < inventoriesProviders.length; i++){
              for(let j = 0; j < users.length; j++){
                if(inventoriesProviders[i].cedulausuario === users[j].cedulausuario){
                  inventoriesProviders[i].numerocelular = users[j].numerocelular;
                }
              }
            }

            this.inventoriesProviders = inventoriesProviders;

          })
          .catch((err) => {
            console.error(err);
          });
        })
        .catch((err) => {
          console.error(err);
        });

      let onlineUser = localStorage.getItem("onlineUser");
      if (onlineUser != null) {
        this.onlineUser = JSON.parse(onlineUser);
      }

    },
    getNumberProvider(inventoryProvider){
      //console.log("ITEEEMMMMMMMMMMMMM ", inventoryProvider);
      this.dialogContact = true;
      this.cellphone = inventoryProvider.numerocelular; 
    },
    cancelDialog() {
      this.dialogContact = false;
    },
    cellphoneM(cellphoneNumberProvider){
      return "https://api.whatsapp.com/send?phone=57" + cellphoneNumberProvider + "&text=Bienvenido";
    },
    updateScreen(){
      window.location.reload();
    },
  },
};
</script>