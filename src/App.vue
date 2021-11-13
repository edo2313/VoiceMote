<template>
  <v-app>
    <v-app-bar app color="primary">
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/logo-white.png"
          transition="scale-transition"
          width="40"
        />
        <a href="https://github.com/edo2313/VoiceMote" target="_blank">
          <v-toolbar-title class="white--text">
            VoiceMote
          </v-toolbar-title>
        </a>
      </div>

      <v-spacer></v-spacer>
      <v-btn icon @click="toggleDark">
        <v-icon color="white">mdi-brightness-6</v-icon>
      </v-btn>
      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2 white--text">{{ type }} v. {{ version }}</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="auto" v-for="strip in strips" :key="strip.Label">
            <Strip @setStrip="setStrip" v-bind="strip" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer padless>
      <v-card flat tile width="100%" color="primary" class="text-center">
        <v-card-text class="white--text">
          Made with <v-icon class="white--text">mdi-heart</v-icon> by
          <a href="https://edo2313.github.io" target="_blank">
            <strong class="white--text text-decoration-none">edo2313</strong>
          </a>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import Strip from "./components/Strip";
import io from "socket.io-client";
var socket;
export default {
  name: "App",
  props: ["config"],

  components: {
    Strip,
  },

  data() {
    return {
      connected: false,
      strips: [],
      type: "",
      version: "",
    };
  },

  created() {
    if (this.config.theme == "dark") {
      this.$vuetify.theme.dark = true;
    }
    socket = io.connect(`http://${this.config.ip}:${this.config.port}`);
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

    setStrip(data) {
      socket.emit("setStrip", JSON.stringify(data));
    },

    toggleDark() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
};
</script>
