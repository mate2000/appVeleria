<template>
  <!--Se visualizan los proveedores disponibles conjunto con sus respectivos servicios y rango de fechas de disponibilidad-->
  <div>
    <v-data-table
      :headers="headers"
      :items="inventoriesProviders"
      :items-per-page="10"
      class="elevation-1"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mdi-phone" @click="getInventoryProvider(item)">
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
    this.loadInventories();
  },
  //carga y guarda los datos de los servicios de un proveedor en un arreglo
  data() {
    return {
      inventoriesProviders: [],
      onlineUserClient: {},
      headers: [
        { text: "id inventario", value: "idinventarioproveedor" },
        { text: "cedula proveedor", value: "cedulausuario" },
        { text: "Nombre producto", value: "nombreproducto"},
        { text: "Tipo producto", value: "tipoproducto"},
        { text: "tamaño", value: "descripciontamanoproducto"},
        { text: "descripcion", value: "descripcionproducto"},
        { text: "precio", value: "precioproducto"},
        { text: "codigo", value: "codigoproducto"},
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
          this.inventoriesProviders = inventoriesProviders;
        })
        .catch((err) => {
          console.error(err);
        });

      let onlineUser = localStorage.getItem("onlineUser");
      if (onlineUser != null) {
        this.onlineUser = JSON.parse(onlineUser);
      }
    },
    getInventoryProvider(inventoryProvider){
      this.dialogContact = true;
    },
    cancelDialog() {
      this.dialogContact = false;
    },
    updateScreen(){
      window.location.reload();
    },
  },
};
</script>