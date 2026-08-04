import { createApp } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import "./style.css";
import App from "./App.vue";

const vuetify = createVuetify();

createApp(App).use(vuetify).use(VueQueryPlugin).mount("#app");
