<template>
  <v-app>
    <v-app-bar app color="primary">
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">{{ type }} v. {{ version }}</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container v-for="strip in strips" :key="strip.Label">
        <Strip v-bind="strip" />
        <v-divider></v-divider>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Strip from "./components/Strip";
import io from "socket.io-client";
var socket = io.connect("http://192.168.1.215:8080");

export default {
  name: "App",

  components: {
    Strip,
  },

  data() {
    return {
      strips: [],
      type: "",
      version: "",
    };
  },
  created() {
    this.getData();
    this.sendReady();
  },

  methods: {
    sendReady() {
      socket.on("info", (info) => {
        info = JSON.parse(info);
        this.type = info.type;
        this.version = info.version;
      });
      socket.emit("ready");
    },

    getData() {
      socket.on("newdata", (data) => {
        data = JSON.parse(data);
        this.strips = data;
      });
    },
  },
};
</script>
