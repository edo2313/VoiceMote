<template>
  <v-container>
    <span>{{ Label }}</span>
    <v-slider v-model="Gain" hint="Im a hint" max="12" min="-60"></v-slider>
    <v-row>
      <v-switch v-model="A1" label="A1" color="red" hide-details></v-switch>
      <v-switch v-model="A2" label="A2" color="red" hide-details></v-switch>
      <v-switch v-model="A3" label="A3" color="red" hide-details></v-switch>
      <v-switch v-model="A4" label="A4" color="red" hide-details></v-switch>
      <v-switch v-model="A5" label="A5" color="red" hide-details></v-switch>
      <v-switch v-model="B1" label="B1" color="red" hide-details></v-switch>
      <v-switch v-model="B2" label="B2" color="red" hide-details></v-switch>
      <v-switch v-model="B3" label="B3" color="red" hide-details></v-switch>

      <span v-if="Mute">Muted</span>

    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
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
  },

  name: "Strip",
  data() {
    return {
      isConnected: false,
    };
  },
};
</script>