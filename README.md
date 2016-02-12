# viewpointslider
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
		( !!! currently it only deal with string/number array, I am just lazy, cos my use case is like slide to choose diff months ), 
		2. an range array as handler positon indicator

		and the drag/auto-play operation will change the value inside the range array will as action feedback, so you 
		just need to watch that range array changing in you scope which provides it, and that is it. 

	
	Due to time limitation, I just hard coded the size inside the code, 
	but it will be pretty easy to add it to directive.

	Current style will be:
	.double_slider, .single_slider  {
		display: inline-block;
		position: relative;
		
		width: 300px;
		height: 40px;
	}