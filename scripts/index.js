	var $c = $("#predicted_image");
	var ctx = $c[0].getContext("2d");
  function showPredicted(finalResult){

	var  binary_data = new Uint8Array(160 * 160 * 4);
	var counter = 0;
 for(let xy=0; xy < 160*160; xy++){
 		
 		ocean = finalResult[xy] > 0.5? true:false;
 		if( !ocean ){
 			binary_data[counter] = 0;
 			binary_data[counter+1] = 119; 
 			binary_data[counter+2] = 190;
 			binary_data[counter+3] =  255;
 		}
 		else{
 			binary_data[counter] = 87;
 			binary_data[counter+1] = 59; 
 			binary_data[counter+2] = 12;
 			binary_data[counter+3] =  255;
 		}
  		counter+=4;
  	}
  	var img = new ImageData(new Uint8ClampedArray(binary_data.buffer), 160, 160);
  	createImageBitmap(img).then(renderer => 
  ctx.drawImage(renderer, 0,0, 160, 160)
)
}

  	
 
  

		let modelContainer = document.getElementById( "container" );
		let model = new TSP.models.Sequential( modelContainer);		
		model.add( new TSP.layers.GreyscaleInput() );
		
		model.add( new TSP.layers.Conv2d() );
		model.add( new TSP.layers.Pooling2d() );
		
		model.add( new TSP.layers.Conv2d() );
		model.add( new TSP.layers.Pooling2d() );

		model.add( new TSP.layers.Conv2d() );
		model.add( new TSP.layers.Pooling2d() );
		
		model.add( new TSP.layers.Conv2d() );
		model.add( new TSP.layers.Pooling2d() );
		
		model.add( new TSP.layers.Conv2d() );

		model.add( new TSP.layers.Conv2dTranspose() );
		model.add( new TSP.layers.Conv2d() );

		model.add( new TSP.layers.Conv2dTranspose() );
		model.add( new TSP.layers.Conv2d() );

		model.add( new TSP.layers.Conv2dTranspose() );
		model.add( new TSP.layers.Conv2d() );

		model.add( new TSP.layers.Conv2dTranspose() );
		model.add( new TSP.layers.Conv2d() );

		model.add( new TSP.layers.Conv2d() );

		model.load({
			type: "keras",
			url: '../models/dataset1/model.json'
		});
		model.init( function() {
			$.ajax({
				url: "../data/map-seg-14_1.json",
				type: 'GET',
				async: true,
				dataType: 'json',
				success: function (data) {
					showInCanvas(data);
					model.predict( data, showPredicted);
									}
			});
		} );



var color = $(".selected").css("background-color");
var $canvas = $("#signature-pad");
var context = $canvas[0].getContext("2d");
var lastEvent;
var mouseDown = false;

//When click on control list items
$(".controls").on("click", "li",function(){
  // Deselect sibling elements
  $(this).siblings().removeClass("selected");
  // select clicked element
  $(this).addClass("selected");
  //cache current color
  color = $(this).css("background-color");
});


//when new color is pressed
$("#revealColorSelect").click(function(){
  //show color select or hide color select
  changeColor();
  $("#colorSelect").toggle();
});

//update the new color span 
function changeColor() {
   var r = $("#red").val();
   var g = $("#green").val();
   var b = $("#blue").val();
   $("#newColor").css("background-color", "rgb(" + r + "," + g +","+ b + ")");
}
//when color slider change 
$("input[type=range]").change(changeColor);  

//when add color is pressed 
$("#addNewColor").click(function(){
  //append the color to the controls ul
  var $newColor = $("<li></li>");
  $newColor.css("background-color", $("#newColor").css("background-color"));
  $(".controls ul").append($newColor);
  // select the new color
  $newColor.click();
});
 

//On mouse events on the canvas
$canvas.mousedown(function(e){
  lastEvent = e;
  mouseDown = true;
}).mousemove(function(e){
  //draw lines
  if(mouseDown) {
  context.beginPath();
  context.moveTo(lastEvent.offsetX, lastEvent.offsetY);
  context.lineTo(e.offsetX, e.offsetY);
  context.strokeStyle = color;
  context.stroke();
  lastEvent = e;
  }
}).mouseup(function(){
  mouseDown = false;

}).mouseleave(function(){
  $canvas.mouseup();
  model.clear();
  getImage(); 
});
// Added clear functionality
$("#clear").click(function(){
  context.clearRect(0,0,context.canvas.width,context.canvas.height)
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
  model.clear()
});

  function getImage() {
                 imgData = context.getImageData( 0, 0, $canvas[0].width, $canvas[0].height );
                 canvasData = [];
                 for(let i=0; i < imgData.data.length; i += 4) {
    // calculate luma, here using Rec 709
    gray = (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2] )/ 3;
    	if(gray == 0){
    		gray = 250;
    	}
    		 canvasData.push(gray);
                }

                console.log(canvasData);
                model.predict( canvasData, showPredicted);
            }


function showInCanvas(data){

		var  binary_data = new Uint8Array(160 * 160 * 4);
	var counter = 0;
 for(let xy=0; xy < 160*160; xy++){
 			binary_data[counter] = data[xy];
 			binary_data[counter+1] = data[xy]; 
 			binary_data[counter+2] = data[xy];
 			binary_data[counter+3] =  255;
 	
  		counter+=4;
  	}
  	var cimage = new ImageData(new Uint8ClampedArray(binary_data.buffer), 160, 160);
  	createImageBitmap(cimage).then(renderer => 
  context.drawImage(renderer, 0,0, 160, 160)
)
}

var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);



function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            context.drawImage(img,0,0,160,160);
            getImage();
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}