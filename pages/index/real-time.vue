<template>

		<map  style="width: 100vw; height: 100%;" longitude="116.451028" latitude="39.949643" scale="12" :markers="markers" :polyline="polyline"></map>

</template>

<script>
	import amapFile from '../../static/amap-wx.js'
	export default {
		data(){
			return{
				markers: [{
				  iconPath: "../../static/touxiang.png",
				  id: 0,
				  latitude: 39.989643,
				  longitude: 116.481028,
				  width: 23,
				  height: 33
				},{
				  iconPath: "../../static/touxiang.png",
				  id: 0,
				  latitude: 39.90816,
				  longitude: 116.434446,
				  width: 24,
				  height: 34
				}],
				distance: '',
				cost: '',
				polyline: []
			}
		  },
		  mounted() {

		    var _this = this
			var myAmapFun = new amapFile.AMapWX({key:'d543ccedafcc74cd880a88bfbc0b2576'});
			
			myAmapFun.getDrivingRoute({
				  origin: '116.481028,39.989643',
				  destination: '116.434446,39.90816',
				  success: function(data){
					  var points = [];
					   if(data.paths && data.paths[0] && data.paths[0].steps){
							var steps = data.paths[0].steps;
					        for(var i = 0; i < steps.length; i++){
								var poLen = steps[i].polyline.split(';');
								for(var j = 0;j < poLen.length; j++){
									points.push({
										  longitude: parseFloat(poLen[j].split(',')[0]),
										  latitude: parseFloat(poLen[j].split(',')[1])
										})
								} 
							}
					    }
						console.log(points)
						_this.polyline= [{
									points: points,
									color: "#ED1C24",
									width: 10
						}]
						if(data.paths[0] && data.paths[0].distance){
							_this.distance= data.paths[0].distance + '米'
							console.log(_this.distance)
						       
						}
						if(data.taxi_cost){
								_this.cost= '打车约' + parseInt(data.taxi_cost) + '元'
							console.log(_this.cost)
						}
						
								 
				  }
			})
			     
		  },
	}
</script>

<style lang="less" scoped>
	.a{
		color: #ED1C24;
	}
</style>
