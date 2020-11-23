import Vue from 'vue'
import App from './App'

import store from './store/index.js'
import {baseUrl} from '@/api/index.js'
import io from 'common/weapp.socket.io.js'
Vue.prototype.socket= io(baseUrl)


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
