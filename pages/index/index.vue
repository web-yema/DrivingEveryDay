<template>
	<view class="container">
		<!-- 头部 -->
		<view class="top-box">
			<view class="header">
			  <span class='spansss'>
			   <span class="icon iconfont" @click='tonews'>&#xe638;</span>
			  </span>
			  <span class='spansss'>
			   <span class="icon iconfont" @click='tomenu'>&#xe610;</span>
			  </span>
			  <span class='spansss'>
			   <span class="icon iconfont" @click='tomy'>&#xe61a;</span>
			 </span>
			</view>
			<view class="name-box">
				司机端
			</view>
			<view class="title-box">
				Tian Tian I
			</view>
			<!-- 预留input框  -->
			<view class="intput-box" @click="btns()">
				<!-- <input type="text" v-model="shouvalue"  /> -->
			</view>
			<!-- 切换 -->
			<view class="switch-box">
				<view class="switch-item"  v-for='(item,index) in switchList' :key='index' @click="onSwitch(index)" :class="indexs==index?'switch-item-color':''" >
					{{item.title}}
				</view>
			</view>
		</view>
		<!-- 地图盒子 -->
		<view class="map-box">
			 <map style="width: 100vw; height: 51vh;" @tap='huo' :enable-traffic='true' :latitude="latitude" :longitude="longitude" :markers="covers" :polyline='polyline' >
			  </map>
		</view>
	
		<!-- 底部 -->
		<view class="bootm-box">
			<view class="b-r">
				<span>首页</span>
			</view>
			<view>
				<span>订单</span>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shouvalue:'',
				indexs:0,
				id:0, // 使用 marker点击事件 需要填写id
				latitude:0,
				longitude: 0,
				covers: [],
				polyline:[],
				switchList:[
					{
						title:'实时'
					},
					{
						title:'预约'
					},
					{
						title:'附近司机'
					},
					{
						title:'热力图'
					}
				]
			}
		},
		onLoad(){
			this.onGetLocation()
		},
		methods: {
			huo(){
				this.onGetLocation()
			},
			btns(){
				this.onGetLocation()
				let _this = this
				uni.chooseLocation({
				    success: function (res) {
				        // console.log('位置名称：' + res.name);
				        // console.log('详细地址：' + res.address);
				        // console.log('纬度：' + res.latitude);
				        // console.log('经度：' + res.longitude);
						// let covers = JSON.parse(JSON.stringify(_this.covers))
						let obj = {
							latitude:res.latitude*1,
							longitude:res.longitude*1,
							iconPath: '../../static/touxiang.png'
						}
						
						_this.covers = [..._this.covers,obj];
						_this.polyline=[{
							points:_this.covers,
							color: '#FF5051',
							borderColor: '#FF5051',
							borderWidth:10,
							width:10,
							arrowLine:true
						}]
				    }
				});
				
			},
			// 获取当前的地理位置
			onGetLocation(){
				let _this = this
				uni.getLocation({
				    type: 'wgs84',
				    success: function (res) {
						console.log(res)
						_this.longitude = res.longitude
						_this.latitude =res.latitude
				        // console.log('当前位置的经度：' + res.longitude);
				        // console.log('当前位置的纬度：' + res.latitude);
						let obj = {
							longitude:res.longitude*1,
							latitude:res.latitude*1 ,
							iconPath: '../../static/touxiang.png'
						}
						
						_this. = [obj]
						
						
				    }
				});
			},
		// 切换
		onSwitch(id){
			this.indexs = id
		},
		// 去消息
		tonews(){
			uni.navigateTo({
			    url: '/pages/news/news'
			});
		},
		// 去设置
		tomenu(){
			uni.navigateTo({
			    url: '/pages/menu/menu'
			});
		},
		// 去我的
		tomy(){
			uni.navigateTo({
			    url: '/pages/my/my'
			});
		}
		}
	}
</script>

<style lang="less" scoped>
	// 导入字体图标
	@font-face {
		font-family: 'iconfont';
		 src: url('~@/static/iconfont.ttf') format('truetype');
	}
	
	// 设置字体图标
	 .iconfont {
	  font-family: "iconfont" !important;
	  font-size: 2rem;
	  font-style: normal;
	  color: #FF5051;
	 }
	.container {
		width: 100vw;
		height: 100vh;
		position: relative;
		box-sizing: border-box;
		background: #F0F0F0;
	}
	.top-box{
		width: 100vw;
		background: #FFFFFF;
		border-radius: 10px;
		padding: 2rem 1.5rem;
		box-sizing: border-box;
		.spansss{
			margin-right: 1rem;
		}
		.name-box{
			margin-top: 1rem;
			font-size: 0.9rem;
			margin-bottom: 0.5rem;
		}
		.title-box{
			font-size: 1.1rem;
			margin-bottom: 1rem;
		}
		.intput-box{
			width: 100%;
			height: 2.5rem;
			border-radius: 5px;
			background-color: #F0F0F0;
		}
		.switch-box{
			display: flex;
			margin-top:1rem;
			.switch-item{
				flex: 1;
				text-align: center;
				padding: 0.4rem 0;
				box-sizing: border-box;
				
			}
			.switch-item-color{
				color: #FFFFFF;
				border-radius: 7px;
				background: red;
			}
		}
	}
	// 地图
	.map-box{
		width: 100vw;
		height: 51vh;
		
	}
	
	.bootm-box{
		box-sizing: border-box;
		padding: 2rem 0;
		background: #FFFFFF;
		border-radius: 10px;
		width: 100%;
		display: flex;
		position: fixed;
		z-index: 100;
		bottom: 0px;
		left: 0px;
		.b-r{
			border-right: 2px solid #C0C0C0;
		}
		view {
			flex: 1;
			text-align: center;
			span{
				border-radius: 5px;
				color: #FFFFFF;
				padding: 0.5rem 3rem;
				background: #FF5051;
			}
		}
	}
</style>
