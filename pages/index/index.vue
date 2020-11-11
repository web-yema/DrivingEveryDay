<template>
	<view class="container">
		<!-- 头部 -->
		<view class="top-box">
			<view class="header">
				<span class="spansss"><span class="icon iconfont" @click="tonews">&#xe638;</span></span>
				<span class="spansss"><span class="icon iconfont" @click="tomenu">&#xe610;</span></span>
				<span class="spansss"><span class="icon iconfont" @click="tomy">&#xe61a;</span></span>
			</view>
			<view class="name-box">司机端</view>
			<view class="title-box">Tian Tian I</view>
			<!-- 预留input框  -->
			<view class="intput-box" @click="btns()">
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
				style="width: 100vw; height: 51vh;"
				:enable-traffic="true"
				:latitude="latitude"
				:longitude="longitude"
				:markers="markers"
				:polyline="polyline"
				:show-compass='true'
			>
			<cover-view class="shishi-box" >
					预计耗时{{duration}}小时
					
			</cover-view >
			<cover-view class="shishi-boxa" >
						全程 {{distance}} 
			</cover-view >
			
			</map>
			
		</view>
		
			<!-- <view  v-for="(item,index) in stepsList" :key='index'>
			   {{index+1}}.{{item.instruction}}
			</view> -->
		<!-- </view> -->
		<!-- 底部 -->
		<view  class="bootm-box">
			<view class="b-r"><span>首页</span></view>
			<view><span>订单</span></view>
		</view>
	</view>
</template>

<script>
import amapFile from '../../static/amap-wx.js';
export default {
	data() {
		return {
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
			
			markers: [],
			polyline: [],
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
	methods: {
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
							console.log(data);
							
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
								
								// _this.stepsList =data.paths[0].steps
							}

							_this.polyline = [
								{
									points: points,
									color: '#ED1C24',
									width: 10
								}
							];
							// if(){
								
								_this.duration = Math.round(data.paths[0].duration * 10/60/60) / 10
							// }
							if (data.paths[0] && data.paths[0].distance) {
								_this.distance = data.paths[0].distance + '米';
								console.log(_this.distance);
							}
							if (data.taxi_cost) {
								_this.cost = '打车约' + parseInt(data.taxi_cost) + '元';
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
			    success: function (res) {
			        console.log('当前位置的经度：' + res.longitude);
			        console.log('当前位置的纬度：' + res.latitude);
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
			// let myAmapFun = new amapFile.AMapWX({ key: 'd543ccedafcc74cd880a88bfbc0b2576' });
			// myAmapFun.getRegeo({
			// 	success: function(data) {
			// 		let res = data[0];
			// 		_this.longitude = res.longitude;
			// 		_this.latitude = res.latitude;

			// 		let obj = {
			// 			longitude: res.longitude * 1,
			// 			latitude: res.latitude * 1,
			// 			iconPath: '../../static/touxiang.png'
			// 		};
			// 		_this.markers = [obj];
			// 		//成功回调
			// 	},
			// 	fail: function(info) {
			// 		//失败回调
			// 		console.log(info);
			// 	}
			// });
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
		height: 2rem;
		background: #FFFFFF;
		border-radius: 10px 10px 0px 10px;
		text-align: center;
		line-height: 2rem;
		position: absolute;
		bottom: 2.7rem;
		z-index: 10000;
		left: 20vw;
	}
.shishi-boxa{
	width: 60vw;
	height: 2rem;
	background: #FFFFFF;
	// border-radius: 10px;
	text-align: center;
	line-height: 2rem;
	position: absolute;
	bottom: 1rem;
	z-index: 10000;
	left: 20vw; 
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
