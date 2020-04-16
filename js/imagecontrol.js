/******************
 class myImage
******************/
myImage.prototype = Object.create(fabric);
myImage.prototype.constructor = myImage;

function myImage(canvasname) {
	this.canvas=canvasname;
	this.params=$('#'+canvasname).data();
	this.c = new this.Canvas(canvasname);
	clonedcanvas = new this.Canvas('cc');
	var now = new Date();
	this.name = 'clipart-'+now.getMonth()+'-'+now.getDate()+'-'+now.getHours()+'-'+now.getMinutes()+'-'+now.getSeconds();
	if(this.params.clipart!=''){
		new Clipart(this.params.clipart, this.c, this);
	}
}

myImage.prototype.getWH=function(){

	var angle=this.c._objects[0].angle;
	var theta=angle*2*Math.PI/360;
	var srcw=$('#scale-width-src').val();
	var srch=$('#scale-height-src').val();

	function rotateX(x,y,t){return x*Math.cos(t)-y*Math.sin(t);}
	function rotateY(x,y,t){return x*Math.sin(t)+y*Math.cos(t);}

	angle=-angle;
	//Standart case of rotate
	if ( (Math.abs(angle) == 90) || (Math.abs(angle) == 270) ) {
		width = srch;
		height = srcw;
		if ( (angle == 90) || (angle == -270) ) {
			minX = 0;
			maxX = width;
			minY = -height+1;
			maxY = 1;
		} else if ( (angle == -90) || (angle == 270) ) {
			minX = -width+1;
			maxX = 1;
			minY = 0;
			maxY = height;
		}
	} else if (Math.abs(angle) == 180) {
		width = srcw;
		height = srch;
		minX = -width+1;
		maxX = 1;
		minY = -height+1;
		maxY = 1;
	} else {
		// Calculate the width of the destination image
		temp = [
			rotateX(0, 0, 0-theta),
			rotateX(srcw, 0, 0-theta),
			rotateX(0, srch, 0-theta),
			rotateX(srcw, srch, 0-theta)
		];
		minX = Math.floor(Math.min(...temp));
		maxX = Math.ceil(Math.max(...temp));
		width = maxX - minX;
 
		// Calculate the height of the destination image
		temp = [ 
			rotateY(0, 0, 0-theta),
			rotateY(srcw, 0, 0-theta),
			rotateY(0, srch, 0-theta),
			rotateY(srcw, srch, 0-theta)
		];
		minY = Math.floor(Math.min(...temp));
		maxY = Math.ceil(Math.max(...temp));
		height = maxY - minY;
	}
	return [width, height];
}
//-----------------------
// DOWNLOAD
myImage.prototype.download=function(){
	//[width, height]=this.getWH();
	 var width=$('#scale-width').val();
	 var height=$('#scale-height').val();
	
	var oi=fabric.util.object.clone(this.c._objects[0]);
	clonedcanvas.clear().add(oi);
	clonedcanvas.setDimensions({width:width, height:height});

	if(height<width)
		clonedcanvas._objects[0].scaleToWidth(width);
	else 
		clonedcanvas._objects[0].scaleToHeight(height);

	clonedcanvas.viewportCenterObject(clonedcanvas._objects[0]);
	clonedcanvas.discardActiveObject();

	var link = document.createElement("a");
	var imgData = clonedcanvas.toDataURL({
		format: 'png',
		//multiplier: 1
	});

	var strDataURI = imgData.substr(22, imgData.length);
	var blob = this.dataURLtoBlob(imgData);
	var objurl = URL.createObjectURL(blob);
	link.download = this.name+".png";
	link.href = objurl;
	this.simulateClick(link);
	this.c.setActiveObject(this.c._objects[0]);
} 
myImage.prototype.dataURLtoBlob=function(dataurl) {
	var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
	while(n--){
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], {type:mime});
}
// Simulate a click event for damn FF.
myImage.prototype.simulateClick = function (elem) {
	var evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
	// If cancelled, don't dispatch our event
	var canceled = !elem.dispatchEvent(evt);
}
//****************************************

/******************
 class Clipart
******************/
function Clipart(url, canvas, img) {
	this.clipart = new fabric.Image.fromURL(url, function(oImg) {
		oImg.set('hasControls', true),
		oImg.setControlsVisibility({
			mt: false, // middle top disable
			mb: false, 
			ml: false, 
			mr: false, 
			tl: false, 
			tr: false, 
			bl: false, 
			br: false, 
		});
		oImg.set('centeredRotation',true);
		//oImg.scaleToWidth($('#scale-width').val());
		//oImg.scaleToHeight(250);
		canvas.add(oImg).setActiveObject(oImg);
		
		var zoom=canvas.width/1.6/$('#scale-width-src').val();
		var center = canvas.getCenter(),
			 point = {
				x: center.left,
				y: center.top
			 };	
		canvas.zoomToPoint(point, canvas.getZoom()*zoom);
		oImg.center();
		canvas.renderAll();

		var angleControl = $('#angle-control');
		angleControl.on("input", function() {
			var newValue = this.value; 
			oImg.rotate(parseInt(newValue, 10)).setCoords();
			canvas.renderAll();
			$('#angle-control').attr('data-original-title', Math.round(this.value)+" °").tooltip('show');
			$('#scale-prop').val(img.getWH()[0]/img.getWH()[1]);
			$('#scale-width').val(img.getWH()[0]);
			$('#scale-height').val(img.getWH()[1]);
		});

		canvas.on({
			'object:rotating': function(){
				$('#angle-control').val(oImg.angle);
				$('#angle-control').attr('data-original-title', Math.round(oImg.angle)+" °").tooltip('show');
				$('#scale-prop').val(img.getWH()[0]/img.getWH()[1]);
				$('#scale-width').val(img.getWH()[0]);
				$('#scale-height').val(img.getWH()[1]);
			}
		});
	});
}
