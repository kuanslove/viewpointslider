/*
	This is a slider directive which I used in my daily job project,
	it may have a general purpose for simple prime type value array
	So I just put it here see if anyone want to use it.

	This module require d3.js and angular
	you can just add reference like:
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.12/d3.js"></script>
	<script src="./viewpoint-slider.js"></script>
	
	Of course, do not forget the templates folder, just keep current folder structure will be fine 

	Basic instruction is:

	[1] include angular-slider as module inside you main module
	[2] use it in your template like:
		<slider dataset="[prime type value]" range="[prime type value]" handlermode="single or double"></slider>
	[3] And the way how it works:
		this directive accept 
		1. an dataset array as the whole range of the slider
		( !!! currently it only deal with string/number array ), 
		2. an range array as handler positon indicator

		and the drag/auto-play operation will change the value inside the range array will as action feedback, so you 
		just need to watch that range array changing in you scope which provides it, and that is it. 

	
	Due to time limitation, I just hard coded the size inside the code, 
	but it will be pretty easy to add it to directive. C

	Current style will be:
	.double_slider, .single_slider  {
		display: inline-block;
		position: relative;
		
		width: 300px;
		height: 40px;
	}
*/
angular.module("angular-slider", [])
	.directive("slider", function($interval){
		return {
			restrict: "AE",
			replace:true,
			scope: {
				dataset: "=",
				range: "=",
				handlermode: "="
			},
			templateUrl: "templates/slider.html",
			controller: function($scope){
				$scope.playing = false;
			},
			link: function(scope, EL, attrs){
				var stop;
				var init_idx;
				scope.play = function(){
					var end_idx;
					if(scope.handlermode == "single"){
						end_idx = scope.dataset.length-1;
					}else {
						end_idx = scope.dataset.indexOf(scope.range[1]);
					}

					scope.playing = true;
					init_idx = scope.dataset.indexOf(scope.range[0]);

					var cur_idx = init_idx;
					stop = $interval(function(){
						if(cur_idx<end_idx){
							cur_idx++;
							scope.range[0] = scope.dataset[cur_idx];
						}else {
							$interval.cancel(stop);
							scope.range[0] = scope.dataset[init_idx];
							scope.playing = false;
						}
					}, 1000)
				}
				scope.pause = function(){
					scope.playing = false;
					$interval.cancel(stop);
				}
			}
		}
	})
	.directive("doubleSlider", function(){
		return {
			restrict: "AE",
			scope: {
				dataset: "=",
				range: "="
			},
			replace:true,
			templateUrl: "templates/doubleslider.html",
			controller: function($scope){
			},
			link: function(scope, EL, attrs){
				function setState(){
					if(scope.dataset.length==0){
						return;
					}
					function accessor(res_value){
						return function(value){
							if(typeof value !="undefined"){
								res_value = value;
							}
							return res_value;
						}
					}
					scope.ord = function(x){
						var idx = Math.floor( (x+0.5*scope.seg)/scope.seg );
						var ordx = scope.seg*idx;
						return {
							idx:idx,
							ordx:ordx
						};
					}
					scope.w = 300;
					scope.seg = scope.w/(scope.dataset.length-1);
					scope.l_idx = scope.dataset.indexOf(scope.range[0]);
					scope.r_idx = scope.dataset.indexOf(scope.range[1]);
					if(scope.l_idx == -1){
						scope.l_idx = 0;
					}
					if(scope.r_idx == -1){
						scope.r_idx = scope.dataset.length-1;
					}
					if(scope.l_idx > scope.r_idx) {
						scope.l_idx = scope.r_idx;
					}

					var d3EL = 	d3.select(EL[0]);
					var hl = d3EL.select(".tick.left");
					var hr = d3EL.select(".tick.right");

					hl.on("mousedown", function(){
						var initx = parseFloat( hl.style("left") );
						var dragx = d3.event.clientX;
						d3.event.preventDefault();
						d3.select(document)
							.on("mousemove.drag", function(){
								scope.$apply(function(){							
									var dx =  d3.event.clientX - dragx;
									var new_initx = initx + dx;
									if(new_initx<0){
										new_initx = 0;
									}
									var ord = scope.ord(new_initx);
									if(ord.idx>scope.r_idx){
										ord.idx = scope.r_idx;
									}
									scope.l_idx = ord.idx;
									scope.range[0] = scope.dataset[scope.l_idx];
								});
							})
							.on("mouseup.drag", function(){
								d3.select(document)
									.on("mousemove.drag", null)
									.on("mouseup.drag", null);
							});
					})
					hr.on("mousedown", function(){
						var initx = parseFloat( hr.style("left") );
						var dragx = d3.event.clientX;
						d3.event.preventDefault();
						d3.select(document)
							.on("mousemove.drag", function(){
								scope.$apply(function(){
									var dx =  d3.event.clientX - dragx;
									var new_initx = initx + dx;
									if(new_initx>scope.w){
										new_initx = scope.w;
									}
									var ord = scope.ord(new_initx);
									if(ord.idx<scope.l_idx){
										ord.idx = scope.l_idx;
									}
									scope.r_idx = ord.idx;
									scope.range[1] = scope.dataset[scope.r_idx];

								});
							})
							.on("mouseup.drag", function(){
								d3.select(document)
									.on("mousemove.drag", null)
									.on("mouseup.drag", null);
							});
					})
				}
				setState();
				scope.$watchCollection("dataset", function(){
					setState();
				})
				scope.$watchCollection("range", function(){
					setState();
				})
			}
		}// end of return
	})
	.directive("singleSlider", function(){
		return {
			restrict: "AE",
			scope: {
				dataset: "=",
				range: "="
			},
			replace:true,
			templateUrl: "templates/singleslider.html",
			controller: function($scope){
			},
			link: function(scope, EL, attrs){
				function setState(){
					if(scope.dataset.length==0){
						return;
					}
					function accessor(res_value){
						return function(value){
							if(typeof value !="undefined"){
								res_value = value;
							}
							return res_value;
						}
					}
					scope.ord = function(x){
						var idx = Math.floor( (x+0.5*scope.seg)/scope.seg );
						var ordx = scope.seg*idx;
						return {
							idx:idx,
							ordx:ordx
						};
					}
					scope.w = 300;
					scope.seg = scope.w/(scope.dataset.length-1);
					scope.l_idx = scope.dataset.indexOf(scope.range[0]);
					if(scope.l_idx == -1){
						scope.l_idx = 0;
					}
					if(scope.l_idx > (scope.dataset.length-1)) {
						scope.l_idx = scope.dataset.length-1;
					}

					var d3EL = 	d3.select(EL[0]);
					var hl = d3EL.select(".tick.left");

					hl.on("mousedown", function(){
						var initx = parseFloat( hl.style("left") );
						var dragx = d3.event.clientX;
						d3.event.preventDefault();
						d3.select(document)
							.on("mousemove.drag", function(){
								scope.$apply(function(){							
									var dx =  d3.event.clientX - dragx;
									var new_initx = initx + dx;
									if(new_initx<0){
										new_initx = 0;
									}
									var ord = scope.ord(new_initx);
									if(ord.idx>(scope.dataset.length-1)){
										ord.idx = scope.dataset.length-1;
									}
									scope.l_idx = ord.idx;
									scope.range[0] = scope.dataset[scope.l_idx];
								});
							})
							.on("mouseup.drag", function(){
								d3.select(document)
									.on("mousemove.drag", null)
									.on("mouseup.drag", null);
							});
					})
				}
				setState();
				scope.$watchCollection("dataset", function(){
					setState();
				})
				scope.$watchCollection("range", function(){
					setState();
				})
			}
		}// end of return
	});