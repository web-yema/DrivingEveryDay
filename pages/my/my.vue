<template>
	<view>
		我的
		<button @click="tuichuLogin()"> 退出登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			tuichuLogin(){
				// 清除缓存
				uni.clearStorage('tokens');
				uni.clearStorage('admins');
				uni.reLaunch({
				    url: '/pages/login/login'
				});
			}
		}
	}
</script>

<style>

</style>
