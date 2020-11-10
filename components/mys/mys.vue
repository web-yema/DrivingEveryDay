<template>
<view>
	<view class="myOne">
		<view class="myimg">
			<view class="img"  @click="toziliao">
				<image src="../../static/touxiang.png" mode=""></image>
			</view>
			<view class="name">李伟</view>
			<view class="xing" style="width: 60px;"></view>
		</view>
		<view class="mymoney">
			<view class="time" style="font-size: 12px; margin-right: 30px;left: 0;top: 0;">
				在线时间<br>
				<text>120</text>小时
			</view>
			<view class="yue" style="font-size: 12px;right: 20%;top: 0;">
				当前余额<br>
				<text>800.4</text>元
			</view>
			<view class="shouru" style="font-size: 12px; margin-right: 30px;left: 0;bottom: 0;">
				今日收入<br>
				<text style="color: #FF8873;">120</text>元
			</view>
			<view class="cishu"  style="font-size: 12px;right: 20%;bottom: 0;">
				成交次数<br>
				<text>300</text>次
			</view>
		</view>
	</view>
	<view class="myTwo">
		<uni-list>
			 <uni-list-item @click="toxiguan" title="我的习惯" thumb="/static/my/xiguan.png" thumb-size="lg" class="list_item"></uni-list-item>
			 <uni-list-item @click="tomima" title="密码设置" thumb="/static/my/mima.png" thumb-size="lg" class="list_item"></uni-list-item>
			 <uni-list-item @click="tofuwu" title="服务协议" thumb="/static/my/fuwu.png" thumb-size="lg" class="list_item"></uni-list-item>
			 <uni-list-item @click="togenghuan" title="更换手机" thumb="/static/my/genghuan.png" thumb-size="lg" class="list_item"></uni-list-item>
			 <uni-list-item @click="todingdan" title="历史订单" thumb="/static/my/dingdan.png" thumb-size="lg" class="list_item"></uni-list-item>
			 <uni-list-item @click="topingjia" title="我的评价" thumb="/static/my/pingjia.png" thumb-size="lg" class="list_item"></uni-list-item>
		</uni-list>
	</view>	
</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {
			// 去资料页面
			toziliao() {
				uni.navigateTo({
					url: "/components/my/ziliao/ziliao"
				})
			},
			// 去习惯页面
			toxiguan() {
				uni.navigateTo({
					url: "/components/my/myuanuan/myuanuan"
				})
			},
			// 去密码设置
			tomima() {
				uni.navigateTo({
					url: "/components/my/mima/mima"
				})
			},
			// 去服务协议
			tofuwu() {
				uni.navigateTo({
					url: "/components/my/fuwu/fuwu"
				})
			},
			// 去更换手机
			togenghuan() {
				uni.navigateTo({
					url: "/components/my/genghuan/genghuan"
				})
			},
			// 去历史订单
			todingdan() {
				uni.navigateTo({
					url: "/components/my/dingdan/dingdan"
				})
			},
			// 我的评价
			topingjia() {
				uni.navigateTo({
					url: "/components/my/pingjia/pingjia"
				})
			}
		}
	}
</script>

<style lang="less" scoped>
a {
	text-decoration: none;
}
li {
	list-style: none;
}
// 上面盒子
.myOne {
	width: 100%;
	height: 105px;
	border-bottom: 10px #EEEEEE solid;
	padding: 45px  0  30px 10%;
	// 左侧照片
	.myimg{
		height: 105px;
		border-right: 2px solid #EEEEEE;
		float: left;
		text-align: center;
		padding-right: 30px;
		.img{
			margin: 0 auto;
			height: 50px;
			width: 50px;
			border-radius: 50%;
			background: #008000;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.name {
			font-size: 14px;
			margin-top: 5px;
		}
		.xing {
			margin: 0 auto;
			height: 12px;
			margin-top: 5px;
			background: url(../../static/my/xing.png);
		}
	}
	// 右侧金钱
	.mymoney{
		margin-left: 20px;
		height: 105px;
		width: 60%;
		float: left;
		position: relative;
		view {
			height: 50%;
			width: 30%;
			position: absolute;
		}
		text {
			font-size: 20px;
		}
	}
}
// 下面盒子
.myTwo {
	width: 100%;
	height: 400px;
	.list_item{
		width: 90%;
		// margin: 0 auto;
		// border-bottom: 1px solid #EDEDED;
	}
}
</style>
