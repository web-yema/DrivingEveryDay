<template>
	<view>
		<!-- 接收内容 -->
		<view>
			接收消息内容
			<view v-for="(item,index) in messageList" :key='index'>
				{{item.username}}
				{{item.content}}
			</view>
		</view>
		<!--  -->
		<view>
			<input type="text" v-model="content" />
			<button @click="onBtn" > 发送</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content:'',
				username:'17635438954',
				
				messageList:[],
				
			}
		},
		mounted(){
			this.onMessage()
		},
		methods: {
			// 发送消息
			onBtn(){
				
				let obj = {
					username:this.username,
					content:this.content
				}
				this.messageList.push(obj)
				this.content = ''
				// console.log(this.content)
				this.socket.emit('sendout',obj)
			},
			// 接收消息
			onMessage(){
				console.log('接收消息')
				
				this.socket.on('receiveout',(data)=>{
					console.log(data)
					this.messageList.push(data)
				})
			}
		}
	}
</script>

<style>

</style>
