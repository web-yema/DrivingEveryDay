<template>
	<view>
		<view class="top-box">
			<uni-segmented-control
				:current="current"
				:values="admin.jurisdiction == 1 ? items : itemstow"
				@clickItem="onClickItem"
				style-type="button"
				active-color="#4cd964"
			></uni-segmented-control>
		</view>
		<view v-if="current == 0">
			<view class="text-center" v-if="orderList.length == 0">{{ admin.jurisdiction == 1 ? '暂无订单' : '你还没有去下单' }}</view>
			<view v-else>
				<view v-for="(item, index) in orderList" :key="index">
					<view class="cu-list menu-avatar" @click="toOrderDetails(item._id)">
						<view class="cu-item">
							<view class="cu-avatar round lg" :style="[{ backgroundImage: `url(${item.user[0].photourl})` }]"></view>
							<view class="content">
								<view class="text-grey">{{ item.user[0].nickname }}</view>
								<view class="text-gray text-sm flex">
									<view class="text-cut">{{ item.address.poiName }} 到 {{ item.destination.end }}</view>
								</view>
							</view>
							<view class="action">
								<view class="text-grey text-xs">{{ item.time }}</view>
								<view class="cu-tag " style="background: rgba(0,0,0,0);"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="current == 1">
			<view class="" v-if="orderLists.length == 0">{{ admin.jurisdiction == 1 ? '您还没有去接单' : '你还没有完成的订单' }}</view>
			<view v-else>
				<view v-for="(item, index) in orderLists" :key="index">
					<view class="cu-list menu-avatar" @click="toOrderDetails(item._id)">
						<view class="cu-item">
							<view class="cu-avatar round lg" :style="[{ backgroundImage: `url(${item.user[0].photourl})` }]"></view>
							<view class="content">
								<view class="text-grey">{{ item.user[0].nickname }}</view>
								<view class="text-gray text-sm flex">
									<view class="text-cut">{{ item.address.poiName }} 到 {{ item.destination.end }}</view>
								</view>
							</view>
							<view class="action">
								<view class="text-grey text-xs">{{ item.time }}</view>
								<view class="cu-tag " style="background: rgba(0,0,0,0);"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="current == 2">
			<view class="" v-if="orderListTow.length == 0">{{ admin.jurisdiction == 1 ? '您还没有去接单' : '你还没有完成的订单' }}</view>
			<view v-else>
				<view v-for="(item, index) in orderListTow" :key="index">
					<view class="cu-list menu-avatar" @click="toOrderDetails(item._id)">
						<view class="cu-item">
							<view class="cu-avatar round lg" :style="[{ backgroundImage: `url(${item.user[0].photourl})` }]"></view>
							<view class="content">
								<view class="text-grey">{{ item.user[0].nickname }}</view>
								<view class="text-gray text-sm flex">
									<view class="text-cut">{{ item.address.poiName }} 到 {{ item.destination.end }}</view>
								</view>
							</view>
							<view class="action">
								<view class="text-grey text-xs">{{ item.time }}</view>
								<view class="cu-tag " style="background: rgba(0,0,0,0);"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { baseUrl } from '@/api/index.js';
import { mapState } from 'vuex';
import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
export default {
	components: { uniSegmentedControl },
	data() {
		return {
			orderList: [],
			orderLists: [],
			orderListTow: [],
			// 司机端选项卡
			items: ['所有订单', '正在进行订单', '已完成订单'],
			// 用户选项卡
			itemstow: ['正在进行的订单', '已完成订单'],
			current: 0
		};
	},
	mounted() {
		this.getOrder();
	},
	computed: {
		...mapState(['admin'])
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.currents(this.current,'onpull')
	},
	methods: {
		// 封装选项卡接口
		currents(currentIndex, onpull,) {
			// 获取全部订单
			if (currentIndex == 0) {
				this.getOrder(onpull);
			}
			// 司机未完成的订单
			if (currentIndex == 1&& this.admin.jurisdiction == 1) {
				let obj = {
					flag: 2,
					ordername: this.admin.username
				};
				this.getOrderCom(onpull, obj);
			}
			// 用户已完成订单
			if (currentIndex == 1 && this.admin.jurisdiction == 0) {
				let obj = {
					flag: 3,
					username: this.admin.username
				};
				this.getOrderCom(onpull, obj);
			}
			// 司机已完成订单
			if (currentIndex == 2) {
				let obj = {
					flag: 3,
					ordername: this.admin.username
				};
				this.getOrderCom(onpull, obj);
			}
		},
		// 选项卡
		onClickItem(e) {
			if (this.current !== e.currentIndex) {
				this.current = e.currentIndex;
				this.currents(e.currentIndex)
			}
		},
		// 去订单详情
		toOrderDetails(item) {
			uni.navigateTo({
				url: `/pages/order/orderdetails?id=${item}`
			});
		},
		// 获取已接订单
		getOrderCom(val, data) {
			let _this = this;
			uni.request({
				url: `${baseUrl}/orderall`,
				method: 'POST',
				data: data,
				success: function(data) {
					if (data.data.code == 200) {
						console.log(_this.current)
						if (_this.current == 1) {
							_this.orderLists = data.data.data;
						} 
						if(_this.current ==2) {
							_this.orderListTow = data.data.data;
						}
						if (val) {
							uni.stopPullDownRefresh();
						}
					}
				}
			});
		},
		// 获取所有订单
		getOrder(val) {
			let obj = {};
			if (this.admin.jurisdiction == 1) {
				obj = {
					flag: 1,
					jurisdiction: this.admin.jurisdiction
				};
			} else {
				obj = {
					$or: [{flag: 1}, {flag: 2}],
					username: this.admin.username
				};
			}
			let _this = this;
			uni.request({
				url: `${baseUrl}/orderall`,
				method: 'POST',
				data: obj,
				success: function(data) {
					if (data.data.code == 200) {
						console.log();
						_this.orderList = data.data.data;
						if (val) {
							uni.stopPullDownRefresh();
						}
					}
				}
			});
		}
	}
};
</script>

<style scoped>
@import '@/colorui/main.css';
@import '@/colorui/icon.css';
.action {
	width: 32vw !important;
	text-align: right !important;
	margin-right: 0.5rem;
}
.top-box {
	padding: 1rem;
	box-sizing: border-box;
}
.text-center {
	text-align: center;
}
</style>
