import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import {
	baseUrl
} from '@/api/index.js'

export default new Vuex.Store({
	state: {
		admin: {},
	},
	mutations: {
		tologins(state) {
			state.admin = {}
		},
		// 持久化登录
		admins(state) {
			const admin = uni.getStorageSync('admins');
			if (admin) {
				state.admin = admin
			}
		},
		// 登录验证
		loginStatesa(state, data) {
			state.admin = data.data
			const admins = uni.getStorageSync('admins');
			uni.setStorage({
				key: 'admins',
				data: data.data
			});
			uni.hideLoading();
			uni.redirectTo({
				url: '/pages/index/index'
			})

		},
	},
	actions: {
		// 获取用户信息
		admins({
			commit
		}) {
			commit('admins')
		},
		// 验证登录
		loginStates({
			commit
		}) {
			const token = uni.getStorageSync('tokens');
			uni.request({
				url: `${baseUrl}/getadmin`,
				method: "POST",
				data: {
					token: token
				},
				success: res => {
					if (res.data.code == 200) {
						commit('loginStatesa', res.data)
					} else {
						// 清除缓存
						uni.clearStorage('tokens');
						uni.clearStorage('admins');
						commit('tologins')
						uni.redirectTo({
							url: '/pages/login/login'
						})
					}
				

				},
				fail: (err) => {
					console.log(err)
				}
			})
		}
	},
	modules: {},
	
});