import Vue from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css";
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

import router from "./router";
import { RestDataSource } from "./restDataSource";
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  provide: function () {
    return {
      eventBus: new Vue(),
      restDataSource: new RestDataSource()
    }
  },
  router
}).$mount('#app')
