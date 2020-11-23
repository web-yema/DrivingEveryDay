<template>
	<view>
		<view v-if='orderdetailsList.length==0'>
			订单详情
		</view>
		<view v-else class="box-ord">
			<view class="top-img">
				<image :src="orderdetailsList.user[0].photourl" ></image>
			</view>
			<view class="shouji">
				手机号：{{orderdetailsList.username}}
			</view>
			<view class="nickname">
				昵称：{{orderdetailsList.user[0].nickname}}
			</view>
			<view class="dizhi">
				地址：{{orderdetailsList.address.poiName}} 到 {{orderdetailsList.destination.end}}
			</view>
			
			<view class="btn-box" v-if="admin.jurisdiction==1">
				<button v-if="orderdetailsList.flag==1"  @click="onOrder(2)">接单</button>
				<button v-if="orderdetailsList.flag==2" @click="onOrder(3)">完成订单</button>
				<button v-if='orderdetailsList.flag==2' @click="toChat()" >联系用户</button>
			</view>
			<view class="btn-box" v-else >
				<button v-if='orderdetailsList.flag!=3' @click="quxiOrder()" >取消订单</button>
				<button v-if='!jiedan' @click="toChat()">联系司机</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { baseUrl } from '@/api/index.js';
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				orderdetailsList:[],
				jiedan:true,
				quxiaodingdan: true,
			}
		},
		onLoad(option) {
			this.getOrder(option.id)
		},
		computed:{
			...mapState(['admin'])
		},
		methods: {
			
			// 取消订单
			quxiOrder(){
				// console.log(this.orderdetailsList._id)
				let _this = this
				uni.request({
					url: `${baseUrl}/cancleorder`,
					method: 'POST',
					data: {
						id:_this.orderdetailsList._id,
					},
					success: function({data}) {
						uni.showToast({
							title:data.message,
							icon:'none'
						})
						if(data.code==200){
							setTimeout(()=>{
								uni.redirectTo({
									url:'/pages/index/index'
								})
							},1000)
						// 	_this.orderdetailsList.flag=flag;
						// 	_this.jiedan = false
						}else{
							
						}
					}
				});
			},
			
			// 接单与完成订单
			onOrder(flag){
				let _this = this
				uni.request({
					url: `${baseUrl}/confirmoroderon`,
					method: 'POST',
					data: {
						id:this.orderdetailsList._id,
						ordername:this.admin.username,
						flag:flag
					},
					success: function({data}) {
						if(data.code==200){
							_this.orderdetailsList.flag=flag;
							_this.jiedan = false
						}
					}
				});
			},
			// 去聊天页面
			toChat(){
				let user
				if(this.admin.jurisdiction==1){
					user=this.orderdetailsList.username
				}else{
					user=this.orderdetailsList.ordername
				}
				
				uni.navigateTo({
					url:`/pages/chat/chat?user=${user}`
				})
			},
			// 获取所有订单
			getOrder(val) {
				let _this = this;
				uni.request({
					url: `${baseUrl}/orderall`,
					method: 'POST',
					data: {id:val},
					success: function(data) {
						if (data.data.code == 200) {
							_this.orderdetailsList = data.data.data[0];
							if(data.data.data[0].flag==2){
								_this.jiedan= false
							}
						}
					}
				});
			}
			
		}
	}
</script>

<style lang="less" scoped>
.box-ord{
	padding: 2rem;
	box-sizing: border-box;
}
.top-img{
	text-align: center;
	padding:2rem 4rem;
	box-sizing: border-box;
	image{
		width: 5rem;
		height: 5rem;
		border-radius: 50%;
	}
}
.btn-box{
	display: flex;
	button{
		flex: 1;
		margin: 1rem;
	}
}
</style>
