import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router';
import VueSimpleWebSocket from 'vue-simple-websocket'
Vue.use(VueSimpleWebSocket, process.env.VUE_APP_SOR_WS, {
  reconnectEnabled: true,
  reconnectInterval: 5000
})

Vue.config.productionTip = false
export const bus = new Vue()

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
