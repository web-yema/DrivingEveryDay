<template>
	<view>
		<view class="cu-chat">
			<view v-for="(item,index) in messagelist" :key='index'>
				<view v-if='item.username==admin.username' class="cu-item self">
					<view class="main">
						<view class="content bg-green shadow">
							<text> {{item.text}}</text>
						</view>
					</view>
				
					<view class="cu-avatar radius" :style="[{backgroundImage:`url(${admin.photourl})`}]"></view>
					<!-- <view class="date">{{item.time}}</view> -->
				</view>
				<view v-else class="cu-item">
					<view class="cu-avatar radius" :style="[{backgroundImage:`url(${otherList.photourl})`}]"></view>
					<view class="main">
						<view class="content shadow">
							<text> {{item.text}}</text>
						</view>
					</view>
					<!-- <view class="date "> {{item.time}}</view> -->
				</view>
			</view>
		</view>

		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<view class="action">
				<text class="cuIcon-sound text-grey"></text>
			</view>
			<input class="solid-bottom" v-model="text" maxlength="300" cursor-spacing="10" ></input>
			<view class="action">
				<text class="cuIcon-emojifill text-grey"></text>
			</view>
			<button class="cu-btn bg-green shadow" @click="onSend()" >发送</button>
		</view>

	</view>
</template>

<script>
	import { baseUrl } from '@/api/index.js';
	import {mapState} from 'vuex' 
	export default {
		data() {
			return {
				InputBottom: 0,
				othername:'',
				text:'',
				messagelist:[],
				otherList:{}
			};
		},
		onLoad(option){
			this.othername = option.user
			this.receiveMsg()
			this.getMessage()
		},
		computed:{
			...mapState(['admin'])
		},
		methods: {
			// 获取历史记录
			getMessage(){
				console.log('sss')
				let _this = this;
				uni.request({
					url: `${baseUrl}/getmessage`,
					method: 'POST',
					data: {
						username:_this.admin.username,
						othername:_this.othername
					},
					success: function(data) {
						if (data.data.code == 200) {
							_this.otherList = data.data.otherList
							_this.messagelist = data.data.data
						}
					}
				});
			},
			// 发送消息
			onSend(){
				let obj = {
					username: this.admin.username,
					othername: this.othername,
					text: this.text,
				}
				this.messagelist.push(obj)
				this.socket.emit('sendout',obj)
				this.text=''
			},
			// 接收消息
			receiveMsg(){
				this.socket.on('receiveout',(data)=>{
					if(data.username != this.othername){
						return false
					}
					this.messagelist.push(data)
				})
			}
		}
	}
</script>

<style>
@import '@/colorui/main.css';
@import '@/colorui/icon.css';
page{
  padding-bottom: 100upx;
}
</style>
