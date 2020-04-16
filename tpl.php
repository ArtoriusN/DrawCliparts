<script type="application/javascript" src="/js/fabric.min.js"></script>
<script type="application/javascript" src="/js/imagecontrol.js"></script>
<section id="tools-imagecontrol" class="header-gradient-software typography-1">
	<div class="header text-dark">
		<div class="container">
			<div class="row">
				<div class="col-lg-8 col-md-12 col-12">
					<div id="canvasarea" class="area transparent">
						<canvas id="c" width="400" height="400" style="border:1px solid #ccc" data-postid="" data-clipart="<?=isset($data->image->id)?url("service@getimage",$data->image->url):''?>"></canvas>
						<div style="display: none"><canvas id="cc"></canvas></div>
					</div>
				</div>
				<div class="col-lg-4 col-md-12 col-12 mt-3">
					<div class="row">
						<div class="col-12">
							<form class="form-inline">
								<div class="form-row">
									<div class="form-group col-12 justify-content-lg-start justify-content-center">
										<label>Angle:</label>
										<input style="border:0px;" class="form-control ml-3 custom-range px-0" type="range" data-toggle="tooltip" data-placement="top" title="0 &deg;" id="angle-control" value="0" min="0" max="360" step="1">
									</div>
									<div class="form-group col-12 my-3 justify-content-lg-start justify-content-center">
										<label>Size:</label>
										<input class="form-control mx-3" size="2" type="text" id="scale-width" value="<?=$data->image->width?>"> x
										<input class="form-control ml-3" size="2" type="text" id="scale-height" value="<?=$data->image->height?>">
										<input type="hidden" id="scale-width-src" value="<?=$data->image->width?>">
										<input type="hidden" id="scale-height-src" value="<?=$data->image->height?>">
										<input type="hidden" id="scale-prop" value="<?=$data->image->width/$data->image->height?>">
									</div>
									<div class="form-group col-12 justify-content-lg-start justify-content-center">
										<button class="btn btn-primary btn-custom btn-sm" onclick="canvas.download(); return false;">Download</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
<script>
var canvas = new myImage('c');
$('#scale-width').on('change', function(){
	$('#scale-height').val(Math.round(this.value/$('#scale-prop').val()));
});
$('#scale-height').on('change', function(){
	$('#scale-width').val(Math.round(this.value*$('#scale-prop').val()));
});
canvas.c.on('mouse:wheel', function(opt) {
	var delta = opt.e.deltaY;
	var zoom = canvas.c.getZoom();
	zoom = zoom + delta/2000;
	if (zoom > 20) zoom = 20;
	if (zoom < 0.01) zoom = 0.01;
	canvas.c.setZoom(zoom);
	opt.e.preventDefault();
	opt.e.stopPropagation();
})
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});
</script>
