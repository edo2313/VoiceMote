<template>
  <v-container class="bg-surface-variant">
    <v-row>
      <b>{{ stripName }} - {{ Label }}</b>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-slider v-model="Gain" thumb-label :label="`${Gain} dB`" :color="Mute ? `red` : Solo ? `orange` : `green`"
          max="12" min="-60" vertical></v-slider>
      </v-col>
      <v-col cols="5">
        <v-checkbox v-model="A1" label="A1" color="red" hide-details></v-checkbox>
        <v-checkbox v-model="A2" label="A2" color="red" hide-details></v-checkbox>
        <v-checkbox v-model="A3" label="A3" color="red" hide-details v-if="Type == 1 || Type == 2"></v-checkbox>
        <v-checkbox v-model="A4" label="A4" color="red" hide-details v-if="Type == 2"></v-checkbox>
        <v-checkbox v-model="A5" label="A5" color="red" hide-details v-if="Type == 2"></v-checkbox>
        <v-checkbox v-model="B1" label="B1" color="green" hide-details></v-checkbox>
        <v-checkbox v-model="B2" label="B2" color="green" hide-details v-if="Type == 1 || Type == 2"></v-checkbox>
        <v-checkbox v-model="B3" label="B3" color="green" hide-details v-if="Type == 2"></v-checkbox>
      </v-col>
      <v-col cols="2">
        <v-divider vertical></v-divider>
      </v-col>
    </v-row>
    <v-row class="ma-3">
      <v-checkbox v-model="Mute" label="Mute" color="green" hide-details></v-checkbox>
    </v-row>   
    <v-row class="pa-2 ma-2">
      <v-btn @click="Gain = 0">
        Reset
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    Index: Number,
    Mono: Number,
    Mute: Number,
    Solo: Number,
    MC: Number,
    Gain: Number,
    Pan_x: Number,
    Pan_y: Number,
    Color_x: Number,
    Color_y: Number,
    fx_x: Number,
    fx_y: Number,
    Audibility: Number,
    Comp: Number,
    Gate: Number,
    EqGain1: Number,
    EqGain2: Number,
    EqGain3: Number,
    Label: String,
    A1: Number,
    A2: Number,
    A3: Number,
    A4: Number,
    A5: Number,
    B1: Number,
    B2: Number,
    B3: Number,
    FadeTo: Number,
    Type: String
  },

  name: "Strip",
    data() { return {};
  },
  methods: {
    setData() {
      let data = {};
      for (let prop in this.$props) {
        data[prop] = this.$props[prop];
      }
      this.$emit('setStrip', data)
    }
  },

  computed: {
    stripName() {
      return  (this.Index < 3 ? "A" : "B") + (this.Index < 3 ? this.Index + 1 : this.Index - 2);
    },
  },

  watch: {
    Gain() {
      this.setData();
    },
    Mute() {
      this.setData();
    },
    Solo() {
      this.setData();
    },
    A1() {
      this.setData();
    },
    A2() {
      this.setData();
    },
    A3() {
      this.setData();
    },
    A4() {
      this.setData();
    },
    A5() {
      this.setData();
    },
    B1() {
      this.setData();
    },
    B2() {
      this.setData();
    },
    B3() {
      this.setData();
    }
  }
};
</script>