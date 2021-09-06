import colors from "vuetify/es5/util/colors";
//"vuetify": "^2.3.14"

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: "%s - El taller",
    title: "Inicio",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
  },
  build: {
    babel: {
      plugins: [["@babel/plugin-proposal-private-property-in-object", { loose: true }]],
    },
  },
  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  modules: ["@nuxtjs/axios"],
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  modules: ['@nuxtjs/axios'],

  // Configuración del vuetify
  vuetify: {
    theme: {
      light: true,
      themes: {
        light: {
          primary: "#009688",
          "dark-primary": "#00796B",
          "light-primary": "#B2DFDB",
          secondary: "#757575",
          text: "#FFFFFF",
          "primary-text": "#212121",
          accent: "#607D8B",
        },
      },
    },
  },
};
