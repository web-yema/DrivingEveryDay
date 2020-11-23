<script>
export default {
	onLaunch: function() {
		this.$store.dispatch("admins");
		this.$store.dispatch("loginStates");
		this.socket.on('connect',()=>{
			console.log('连接成功')
		}) 
		// 获取登录信息
		let timer = setInterval(()=>{
			if(this.$store.state.admin.username){
				clearInterval(timer)
				this.socket.emit('oninit',{
					username:this.$store.state.admin.username
				})
			}
		},10)
	},
	onShow: function() {
		console.log(this.socket.id)
		console.log('App Show');
		
	},
	onHide: function() {
		console.log('App Hide');
	},
};
</script>

<style>
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
</style>
