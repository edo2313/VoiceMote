<template>
  <v-container class="bg-surface-variant">
    <v-row>
      <b>{{ busName }}</b>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-slider v-model="Gain" thumb-label :label="`${Gain} dB`" :color="Mute ? `red` : `green`" max="12" min="-60"
          vertical></v-slider>
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
    AmixMode: Number,
    BmixMode: Number,
    CompositeMode: Number,
    EQ: Number,
    FadeTo: Number,
    Gain: Number,
    Mono: Number,
    Mute: Number,
    NormalMode: Number,
    RepeatMode: Number,
    Type: String
  },

  name: "Bus",
  data() {
    return {}
  },

  methods: {
    setData() {
      let data = {};
      for (let prop in this.$props) {
        data[prop] = this.$props[prop];
      }
      this.$emit('setBus', data)
    }
  },

  computed: {
    busName() {
      return  (this.Index < 3 ? "A" : "B") + (this.Index < 3 ? this.Index + 1 : this.Index - 2);
    },
  },

  watch: {
    Gain() {
      this.setData();
    },
    Mute() {
      this.setData();
    }
  }
};
</script>