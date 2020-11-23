<template>
	<view class="container">
		<!-- 头部 -->
		<view class="top-box">
			<view class="header">
				<span class="spansss"><span class="icon iconfont" @click="tonews">&#xe638;</span></span>
				<span class="spansss"><span class="icon iconfont" @click="tomenu">&#xe610;</span></span>
				<span class="spansss"><span class="icon iconfont" @click="tomy">&#xe61a;</span></span>
			</view>
			<view class="name-box">{{admin.jurisdiction==1?'司机端':'用户端'}}</view>
			<view class="title-box">Tian Tian I</view>
			<!-- 预留input框  -->
			<view class="intput-box" @click="admin.jurisdiction==1?'':btns()">
				{{targetName}}
			</view>
			
			<!-- 切换 -->
			<view class="switch-box">
				<view class="switch-item" v-for="(item, index) in switchList" :key="index" @click="onSwitch(index)" :class="indexs == index ? 'switch-item-color' : ''">
					{{ item.title }}
				</view>
			</view>
		</view>
		<!-- 地图盒子 -->
		<view class="map-box">
			<map
				v-if="indexs == 0"
				style="width: 100vw; height: 50vh;"
				:enable-traffic="true"
				:latitude="latitude"
				:longitude="longitude"
				:markers="markers"
				:polyline="polyline"
				:show-compass='true'
			>
			<cover-view class="shishi-box" v-if='duration.length!=0' >
					预计耗时{{duration}}小时
			</cover-view >
			<cover-view class="shishi-boxa" v-if='distance.length!=0' >
						全程 {{distance}} 大概需要{{cost}}
				
			</cover-view>
			<cover-view v-if="admin.jurisdiction==1" class="shishi-boxsc" @click="onJiedan()" >
						点击接单
			</cover-view>
			<cover-view  v-else class="shishi-boxsc"  @click="isShow?onPlace():'' " >
				{{isShow?'点击下单':'等待接单……'}}
			</cover-view>
			
			</map>

		</view>
		<!-- 底部 -->
		<view  class="bootm-box">
			<view class="b-r"><span>首页</span></view>
			<view><span @click='onOrder()'>订单</span></view>
		</view>
	</view>
</template>

<script>
import amapFile from '../../static/amap-wx.js';
import {mapState}  from 'vuex'
export default {
	data() {
		return {
			isShow:true,
			indexs: 0,
			switchList: [
				{
					title: '实时'
				},
				{
					title: '预约'
				},
				{
					title: '附近司机'
				},
				{
					title: '热力图'
				}
			],
			longitude: 0,
			latitude: 0,
			address:{},
			markers: [],
			polyline: [],
			endLongitude:0,
			endLatitude:0,
			stepsList:[],
			targetName:'',
			distance: '',
			cost: '',
			duration:''
		};
	},
	onLoad() {
		this.onGetLocation();		
	},
	computed:{
		...mapState(['admin'])
	},
	methods: {
		// 去订单页
		onOrder(){
			uni.navigateTo({
				url:'/pages/order/order'
			})
		},
		// 接单
		onJiedan(){
			this.onMes()
		},
		// 下单
		onPlace(){
			if(this.targetName.length==0){
				uni.showToast({
				  title:`请选择目的地`,
				  icon: "none",
				});
				return 
			}
			let obj = {
				username:this.admin.username,
				address:this.address,
				origin:{
					longitude:this.longitude,
					latitude:this.latitude
				},
				destination:{
					 end:this.targetName,
					 longitude:this.endLongitude,
					 latitude:this.endLatitude
				},
			}
			console.log(obj)
			this.socket.emit('place',obj)
			uni.showToast({
			  title:`下单成功`,
			  icon: "none",
			});
			this.isShow = false
			this.socket.on('connect', () => {
				console.log('connection created.')
			});
		},
		// 接收消息
		onMes(){
			console.log('接收消息')
			this.socket.on('receive',(data)=>{
				console.log(data)
				uni.showToast({
				  title:`${data.username} 下单`,
				  icon: "none",
				});
			})
		},
		
		
		btns() {
			// 搜索目的地
			this.onGetLocation();
			let _this = this;
			uni.chooseLocation({
				success: function(res) {
					// console.log('位置名称：' + res.name);
					// console.log('详细地址：' + res.address);
					// console.log('纬度：' + res.latitude);
					// console.log('经度：' + res.longitude);
					_this.targetName = res.name
					_this.endLongitude=res.longitude
					_this.endLatitude=res.latitude
					let obj = {
						longitude: res.longitude * 1,
						latitude: res.latitude * 1,
						iconPath: '../../static/touxiang.png'
					};
					_this.markers.push(obj);
					// 获取路线
					let myAmapFun = new amapFile.AMapWX({ key: 'd543ccedafcc74cd880a88bfbc0b2576' });
					myAmapFun.getDrivingRoute({
						origin: `${_this.longitude},${_this.latitude}`,
						destination: `${res.longitude},${res.latitude}`,
						success: function(data) {
							// console.log(data);
							var points = [];
							if (data.paths && data.paths[0] && data.paths[0].steps) {
								var steps = data.paths[0].steps;
								for (var i = 0; i < steps.length; i++) {
									var poLen = steps[i].polyline.split(';');
									for (var j = 0; j < poLen.length; j++) {
										points.push({
											longitude: parseFloat(poLen[j].split(',')[0]),
											latitude: parseFloat(poLen[j].split(',')[1])
										});
									}
								}
							}
							_this.polyline = [
								{
									points: points,
									color: '#ED1C24',
									width: 10
								}
							];
							_this.duration = Math.round(data.paths[0].duration * 10/60/60) / 10
							if (data.paths[0] && data.paths[0].distance) {
								_this.distance = data.paths[0].distance + '米';
								console.log(_this.distance);
							}
							if (data.taxi_cost) {
								_this.cost = parseInt(data.taxi_cost) + '元';
								console.log(_this.cost);
							}
						}
					});
				}
			});
		},
		// 获取当前的地理位置
		onGetLocation() {
			let _this = this;
			uni.getLocation({
			    type: 'gcj02',
				geocode:true,
			    success: function (res) {
			        // console.log('当前位置的经度：' + res.longitude);
			        // console.log('当前位置的纬度：' + res.latitude);
							if(res.address){
								 _this.address = res.address
							}
							_this.longitude = res.longitude;
							_this.latitude = res.latitude;
							let obj = {
								longitude: res.longitude * 1,
								latitude: res.latitude * 1,
								iconPath: '../../static/touxiang.png'
							};

							_this.markers = [obj];
			    }
			});
		},
		// 切换
		onSwitch(id) {
			this.indexs = id;
		},
		// 去消息
		tonews() {
			uni.navigateTo({
				url: '/pages/news/news'
			});
		},
		// 去设置
		tomenu() {
			uni.navigateTo({
				url: '/pages/menu/menu'
			});
		},
		// 去我的
		tomy() {
			uni.navigateTo({
				url: '/pages/my/my'
			});
		}
	}
};
</script>

<style lang="less" scoped>
// 导入字体图标
@font-face {
	font-family: 'iconfont';
	src: url('~@/static/iconfont.ttf') format('truetype');
}

// 设置字体图标
.iconfont {
	font-family: 'iconfont' !important;
	font-size: 2rem;
	font-style: normal;
	color: #ff5051;
}
.container {
	width: 100vw;
	height: 100vh;
	position: relative;
	box-sizing: border-box;
	// background: #f0f0f0;

}
.top-box {
	width: 100vw;
	background: #ffffff;
	border-radius: 10px;
	padding: 2rem 1.5rem;
	box-sizing: border-box;
	.spansss {
		margin-right: 1rem;
	}
	.name-box {
		margin-top: 1rem;
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
	}
	.title-box {
		font-size: 1.1rem;
		margin-bottom: 1rem;
	}
	.intput-box {
		width: 100%;
		height: 2.5rem;
		line-height: 2.5rem;
		padding:0px 0.3rem;
		border-radius: 5px;
		background-color: #f0f0f0;
	}
	.switch-box {
		display: flex;
		margin-top: 1rem;
		.switch-item {
			flex: 1;
			text-align: center;
			padding: 0.4rem 0;
			box-sizing: border-box;
		}
		.switch-item-color {
			color: #ffffff;
			border-radius: 7px;
			background: red;
		}
	}
}
// 地图
.map-box {
	width: 100vw;
	height: 51vh;
	
}
.diss{
	font-size: 0.8rem;
}
.shishi-box{
		width: 60vw;
		height: 1.7rem;
		background: #FFFFFF;
		border-radius: 10px 10px 0px 10px;
		text-align: center;
		line-height: 2rem;
		position: absolute;
		bottom: 4.2rem;
		font-size: 0.9rem;
		z-index: 10000;
		left: 20vw;
	}
.shishi-boxa{
	width: 60vw;
	height: 1.7rem;
	background: #FFFFFF;
	font-size: 0.8rem;
	// border-radius: 10px;
	text-align: center;
	line-height: 2rem;
	position: absolute;
	bottom: 2.5rem;
	z-index: 10000;
	left: 20vw; 
}
.shishi-boxsc{
	width: 60vw;
	height: 2.2rem;
	background: #FFFFFF;
	font-size: 1rem;
	// border-radius: 10px;
	text-align: center;
	line-height: 2.2rem;
	position: absolute;
	bottom: 0.2rem;
	z-index: 10003;
	background: red;
	color: #FFFFFF;
	left: 20vw; 
	border-radius: 6px;
}

.bootm-box {
	box-sizing: border-box;
	padding: 2rem 0;
	// background: #ffffff;
	border-radius: 10px;
	width: 100%;
	display: flex;
	position: fixed;
	z-index: 100;
	bottom: 0px;
	left: 0px;
	.b-r {
		border-right: 2px solid #c0c0c0;
		
	}
	view {
		flex: 1;
		text-align: center;
		span {
			border-radius: 5px;
			color: #ffffff;
			padding: 0.5rem 3rem;
			background: #ff5051;
		}
	}
}
</style>
