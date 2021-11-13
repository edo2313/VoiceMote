<template>
  <v-row>
    <v-col cols="5">
      <b>{{ Label }}</b>
      <v-slider
        v-model="Gain"
        :label="`${Gain} dB`"
        thumb-label
        :color="Mute ? `red` : Solo ? `orange` : `green`"
        max="12"
        min="-60"
        vertical
      ></v-slider>
      <p v-if="Solo">Solo</p>
      <p v-if="Mute">Mute</p>
    </v-col>
    <v-col cols="5">
      <v-checkbox v-model="A1" label="A1" color="red" hide-details></v-checkbox>
      <v-checkbox v-model="A2" label="A2" color="red" hide-details></v-checkbox>
      <v-checkbox v-model="A3" label="A3" color="red" hide-details v-if="Type == 1 || Type == 2"></v-checkbox>
      <v-checkbox v-model="A4" label="A4" color="red" hide-details v-if="Type == 2"></v-checkbox>
      <v-checkbox v-model="A5" label="A5" color="red" hide-details v-if="Type == 2"></v-checkbox>
      <v-checkbox v-model="B1" label="B1" color="red" hide-details></v-checkbox>
      <v-checkbox v-model="B2" label="B2" color="red" hide-details v-if="Type == 1 || Type == 2"></v-checkbox>
      <v-checkbox v-model="B3" label="B3" color="red" hide-details v-if="Type == 2"></v-checkbox>

    </v-col>
    <v-col cols="2">
      <v-divider vertical></v-divider>
    </v-col>
  </v-row>
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
  data() {
  },
  methods: {
    setData() {
      let data ={};
      for (let prop in this.$props) {
        data[prop] = this.$props[prop];
      }
      this.$emit('setStrip', data)
    }
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