<template>
	<view>
		<view class="login">
			{{ isLogin ? '登录' : '注册' }}
			<view class="login-re" @click="onRelo">{{ isLogin ? '注册' : '登录' }}</view>
		</view>
		<view v-if="isLogin">
			<view class="touxiang"><image class="img-box" src="../../static/touxiang.png" mode=""></image></view>
			<input class="input" placeholder="请输入手机号" type="text" v-model="loginList.username" />
			<input class="input" placeholder="请输入密码" type="password" v-model="loginList.password" />
			<view class="tijiao" @click="login()">登录</view>
		</view>
		<view v-else>
			<view class="touxiang"><image class="img-box" src="../../static/touxiang.png" mode=""></image></view>
			<input class="input" placeholder="请输入手机号" type="text" v-model="reList.username" />
			<input class="input" placeholder="请输入密码" type="password" v-model="reList.password" />
			<input class="input" placeholder="请确认密码" type="password" v-model="reList.reendpsw" />
			<radio-group @change="radioChange" class="radio-box">
				<label class="radio-box" v-for="(item, index) in items" :key="item.value">
					<view><radio color='#ED1C24' :value="item.value" :checked="index === reList.jurisdiction" /></view>
					<view>{{ item.name }}</view>
				</label>
			</radio-group>
			<view class="tijiao" @click="regaster()">注册</view>
		</view>
	</view>
</template>

<script>
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
import { baseUrl } from '@/api/index.js';
export default {
	components: {
		uniPopupMessage
	},
	data() {
		return {
			isLogin: true,
			current: 0,
			messages: '',
			items: [
				{
					value: '0',
					name: '用户'
				},
				{
					value: '1',
					name: '司机'
				}
			],
			succe: 'success',
			// 登录
			loginList: {
				username: '',
				password: ''
			},
			// 注册
			reList: {
				username: '',
				password: '',
				reendpsw: '',
				jurisdiction: 0 // 权限
			}
		};
	},

	methods: {
		radioChange: function(evt) {
			for (let i = 0; i < this.items.length; i++) {
				if (this.items[i].value === evt.target.value) {
					this.reList.jurisdiction = i;
					break;
				}
			}
		},
		onRelo() {
			this.isLogin = !this.isLogin;
		},
		messa(succe, messages) {
			this.succe = succe;
			this.messages = messages;
			this.$refs.popup.open();
		},
		yan(data) {
			if (!/^1(3|4|5|6|7|8|9)d{9}$/.test(phone)) {
				alert('手机号码有误，请重填');
				return false;
			}
		},
		// 登录点击事件
		login() {
			if (this.loginList.username.length == 0 && this.loginList.password.length === 0) {
				uni.showToast({
					title: '手机号或密码不能为空',
					icon: 'none'
				});
				return false;
			}

			const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
			if (!reg.test(this.loginList.username)) {
				uni.showToast({
					title: '请输入正确的手机号',
					icon: 'none'
				});
				return false;
			}
			if (this.loginList.password.length < 6) {
				uni.showToast({
					title: '密码不能小于6位',
					icon: 'none'
				});
				return false;
			} else {
				uni.showLoading({
					title: '登录中',
					mask: true
				});
				uni.request({
					url: `${baseUrl}/login`,
					method: 'POST',
					data: {
						username: this.loginList.username,
						password: this.loginList.password
					},
					success: res => {
						if (res.data.code == 203) {
							uni.hideLoading();
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							});
						} else if (res.data.code == 201) {
							uni.hideLoading();
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							});
						} else if (res.data.code == 200) {
							uni.setStorage({
								key: 'tokens',
								data: res.data.data.token
							});
							this.loginList.username = '';
							this.loginList.password = '';
							this.$store.dispatch('loginStates');
							// 聊天
							this.socket.emit('oninit',{
								username:this.loginList.username
							})
						}
					},
					fail: err => {
						console.log(err);
					}
				});
			}
		},
		// 注册点击事件
		regaster() {
			const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
			if (this.reList.username.length == 0 && this.reList.password.length === 0 && this.reList.reendpsw.length === 0) {
				uni.showToast({
					title: '手机号和密码不能为空',
					icon: 'none'
				});
			} else if (!reg.test(this.reList.username)) {
				uni.showToast({
					title: '请输入正确的手机号',
					icon: 'none'
				});
				return false;
			} else if (this.reList.password.length < 6) {
				uni.showToast({
					title: '密码不能小于6位',
					icon: 'none'
				});
			} else if (this.reList.password != this.reList.reendpsw) {
				uni.showToast({
					title: '俩次输入的密码不一样',
					icon: 'none'
				});
			} else {
				uni.showLoading({
					title: '注册中',
					mask: true
				});
				uni.request({
					url: `${baseUrl}/register`,
					method: 'POST',
					data: {
						username: this.reList.username,
						password: this.reList.password,
						jurisdiction: this.reList.jurisdiction
					},
					success: res => {
						if (res.data.code == '201') {
							uni.hideLoading();

							uni.showToast({
								title: res.data.message,
								icon: 'none'
							});
						} else if (res.data.code == '202') {
							uni.hideLoading();
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							});
						} else if (res.data.code == '204') {
							uni.hideLoading();
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							});
						} else if (res.data.code === '200') {
							uni.hideLoading();
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							});

							this.reList.username = '';
							this.reList.password = '';
							this.reList.reendpsw = '';
							this.reList.jurisdiction = 0;
							this.isLogin = !this.isLogin;
						}
					},
					fail: err => {
						uni.hideLoading();
						console.log(err);
					}
				});
			}
		},
		// 选项卡点击事件
		onClickItem(e) {
			if (this.current !== e.currentIndex) {
				this.current = e.currentIndex;
			}
		}
	}
};
</script>

<style lang="less" scoped>
.login {
	width: 100vw;
	padding: 1.7rem 0 0.7rem;
	text-align: center;
	color: #ffffff;
	font-size: 1.1rem;
	background-color: #ff5051;
	position: relative;
	.login-re {
		position: absolute;
		padding: 1.9rem 1rem 0.7rem;
		top: 0;
		right: 0;
		font-size: 0.9rem;
	}
}
.touxiang {
	width: 100vw;
	padding: 2rem 0;
	background-color: #ff5051;
	text-align: center;
	.img-box {
		width: 5rem;
		height: 5rem;
		border-radius: 50%;
	}
}
.input {
	width: 80vw;
	height: 3rem;
	padding: 0rem 1rem;
	font-size: 0.9rem;
	border-radius: 2rem;
	box-sizing: border-box;
	border: 1px solid #ff5051;
	margin-left: 10vw;
	margin-top: 1rem;
}
.tijiao {
	width: 80vw;
	height: 3rem;
	line-height: 3rem;
	border-radius: 10px;
	color: #ffffff;
	text-align: center;
	background: #ff5051;
	margin-left: 10vw;
	margin-top: 2rem;
}
.radio-box{
	display: flex;
	margin: 0.3rem 1.5rem;
}
</style>
