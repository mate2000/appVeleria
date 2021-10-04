<template>
  <!--Se visualizan los proveedores disponibles conjunto con sus respectivos servicios y rango de fechas de disponibilidad-->
  <div>
    <v-data-table
      :headers="headers"
      :items="electronicBills"
      :items-per-page="10"
      class="elevation-1"
      max-width="6000"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          small
          class="mdi mdi-arrow-expand"
          @click="getInfoElectronicBill(item)"
        >
          mdi mdi-arrow-expand
        </v-icon>
      </template>
    </v-data-table>
    <!--Se muestra el dialogo con las opciones de contacto para con el proveedor-->
    <v-dialog v-model="dialogContact" max-width="600px">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          <v-text v-text="this.fecha"> </v-text>
        </v-card-title>

        <!--<v-card-text>
          <v-text-field
            disabled
            v-model="this.electronicBills[this.textTest()].total" 
          >-->
        <v-card-text>
          <v-text v-text="this.electroncBillSelected"> </v-text>
        </v-card-text>

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
</template>

<script>
export default {
  layout: "defaultClient",
  beforeMount() {
    this.loadElectronicBills();
    this.obtain;
  },
  //carga y guarda los datos de los servicios de un proveedor en un arreglo
  data() {
    return {
      electroncBillSelected: "",
      fecha: "",
      users: [],
      electronicBills: [],
      cedulausuarioEnPlataforma: "",
      headers: [
        { text: "Fecha", value: "fechaexpedicion" },
        { text: "Cedula comprador", value: "cedulacomprador" },
        { text: "Cedula vendedor", value: "cedulavendedor" },
        { text: "Total", value: "total" },
        { text: "Opciones", value: "actions" },
      ],
      dialogContact: false,
    };
  },
  methods: {
    loadElectronicBills() {
      let onlineUser = localStorage.getItem("onlineUser");
      if (onlineUser != null) {
        this.onlineUser = JSON.parse(onlineUser);
        this.cedulausuarioEnPlataforma = this.onlineUser.cedulausuario;
        console.log("this.onlineUser", this.onlineUser);
      }

      const url = "http://localhost:3001/api/v2/electronicBills";
      let data = {};
      this.$axios
        .get(url)
        .then((res) => {
          let electronicBills = res.data.info;
          let electronicBillsToReturn = [];
          let cont = 0;

          //debugger

          for (let i = 0; i < electronicBills.length; i++) {
            if (
              electronicBills[i].cedulacomprador ==
                this.cedulausuarioEnPlataforma ||
              electronicBills[i].cedulavendedor ==
                this.cedulausuarioEnPlataforma
            ) {
              electronicBillsToReturn[cont] = electronicBills[i];
              cont++;
            }
          }

          this.electronicBills = electronicBillsToReturn;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getInfoElectronicBill(electronicBill) {
      this.dialogContact = true;
      this.total = electronicBill;
      this.fecha = "Fecha de la Factura: " + electronicBill.fechaexpedicion;
      this.formatTextElectronicBillSelected(electronicBill);
    },
    cancelDialog() {
      this.dialogContact = false;
    },
    cellphoneM(cellphoneNumberProvider) {
      return (
        "https://api.whatsapp.com/send?phone=57" +
        cellphoneNumberProvider +
        "&text=Bienvenido"
      );
    },
    formatTextElectronicBillSelected(electronicBill) {
      let espacio = "\n";

      let cedulaComprador =
        "Cédula del comprador: " + electronicBill.cedulacomprador + espacio;

      let cedulavendedor =
        " Cédula del vendedor: " + electronicBill.cedulavendedor;

      //this.electroncBillSelected = cedulaComprador, espacio, cedulavendedor;

      this.electroncBillSelected =
        "Cédula del comprador: " +
        electronicBill.cedulacomprador +
        " ||\nCédula del vendedor: " +
        electronicBill.cedulavendedor +
        " ||\nNombre del comprador: " +
        electronicBill.nombrecomprador +
        " ||\nNumero del celular: " +
        electronicBill.numerocelularcomprador +
        " ||\nCantidad del producto: " +
        electronicBill.cantidadproducto +
        " ||\nCódigo del producto: " +
        electronicBill.codigoproducto +
        " ||\nPrecio del producto: " +
        electronicBill.precioproducto +
        " ||\nValor total del producto: " +
        electronicBill.valortotalproducto +
        " ||\nCondiciones de pago: " +
        electronicBill.condicionespago +
        " ||\nTotal: " +
        electronicBill.total;
    },
    updateScreen() {
      window.location.reload();
    },
  },
};
</script>
