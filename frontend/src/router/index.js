import Vue from 'vue'
import Router from 'vue-router'
import Landing from '../components/Landing'
import PointOfSale from "@/components/PointOfSale"
import Lifecycle from "@/components/Lifecycle"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/pointOfSale',
      name: 'PointOfSale',
      component: PointOfSale
    },
    {
      path: '/Lifecycle',
      name: 'Lifecycle',
      component: Lifecycle
    }
  ]
})
