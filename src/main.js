import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

fetch('/config.json').then(response => response.json()).then(configJson => {
  new Vue({
    vuetify,
    data: {
      config: configJson
    },

    render(h) {
      return h(App, {
        props: {
          'config': this.config
        }
      })
    }
  }).$mount('#app')
});