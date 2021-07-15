console.log('hola')

const width = 320;
const height = 240;
let uploadedimage = null;
let selectingcolor = false;
const downloadbutton=$('#Download-button');
const ColorBox=$('#color-box');

 const redSlider =$('#red-slider');
 const greenSlider =$('#green-slider');
 const blueSlider =$('#blue-slider');
 const LightnessSlider =$('#Lightness-slider');
 const SaturationSlider =$('#saturation-slider')
 const ToleranceSlider = $('#Tolerance-slider')

 const presetSelect = $('#preset-select');
 
 let sc_r=0,sc_g=0,sc_b=0;


function drawarray(array){
    for(i=0;i<array.length;i=i+1){
        console.log(array[i]);
    }
  }

function setup() {
    createCanvas(width, height).parent('canvas-container');
    pixelDensity(1);


    const htmlDopzone = select('#dropzone');
    htmlDopzone.dragOver(function() {
        //console.log('drag over');
        htmlDopzone.addClass('dragover');
    });
    htmlDopzone.dragLeave(function() {
       // console.log('drag Leave');
        htmlDopzone.removeClass('dragover');
    });
    htmlDopzone.drop(function(file){
        uploadedimage = loadImage(file.data);
        //console.log(file);
        clear();
        htmlDopzone.removeClass('dragover');
    });
  }
  
  function draw() {
    background(220,0);
    //console.log(MouseinCanvas());
    if(uploadedimage === null) return;
    let w,h,x=0,y=0;
    w=width;
    h=height;
    let canvasratio = width/height;
    let imageWidth = uploadedimage.width;
    let imageheight=uploadedimage.height;
    let imageratio= imageWidth/imageheight;
    if(imageratio> canvasratio){
        w= width;
        h=w/imageratio;
        y= (height-h)/2;
    } else{
        h=height;
        w= imageratio * h;
        x=(width-w)/2;
    }
    //resizeCanvas(w,h); //para que no se vea el cuadro gris 
    //image(uploadedimage,0,0,w,h); //para que no se vea el cuadro gris
    

    image(uploadedimage,x,y,w,h);
    loadPixels();

    if(MouseinCanvas() && selectingcolor){
        x = Math.round(mouseX);
        y=Math.round(mouseY);
        let index= (mouseX + mouseY*width)*4;
        //console.log(index);
        sc_r=pixels[index];
        sc_g=pixels[index+1];
        sc_b=pixels[index+2];
        //console.log(sc_r);
        ColorBox.css('background-color',`rgb(${sc_r},${sc_g},${sc_b}`);
    }
    //filters
    if(presetSelect.val() === 'grayscale'){
        GrayScale(pixels);
    }else if(presetSelect.val() === 'none'){
        Default(pixels);
    }else if(presetSelect.val() === 'bw'){
        blackandwhite(pixels);
    }else if (presetSelect.val() === '8-bits'){
        bits(pixels);
    }else if(presetSelect.val() === 'sc'){
        singlecolor(pixels);
    }
    updatePixels();
  }

  downloadbutton.click(function(){
    //back up values 
    uploadedimage.loadPixels();
    let pixelsbackup = [];
      for (let i = 0; i < uploadedimage.pixels.length; i++) {
          pixelsbackup.push(uploadedimage.pixels[i]);
      }
    //   console.log("click");

    //aply filters
    
    if(presetSelect.val() === 'grayscale'){
        GrayScale(uploadedimage.pixels);
    }else if(presetSelect.val() === 'none'){
        Default(uploadedimage.pixels);
    }else if(presetSelect.val() === 'bw'){
        blackandwhite(uploadedimage.pixels);
    }else if (presetSelect.val() === '8-bits'){
        bits(uploadedimage.pixels);
    }else if(presetSelect.val() === 'sc'){
        singlecolor(uploadedimage.pixels);
    }
    uploadedimage.updatePixels();

    //save
    save(uploadedimage, 'edit.png');

    //restore image
    uploadedimage.loadPixels();
    for (let i = 0; i < uploadedimage.pixels.length; i++) {
        uploadedimage.pixels[i]=pixelsbackup[i];
    }
    uploadedimage.updatePixels();
  });

  ColorBox.click(function(){
      selectingcolor=true;
      $('body').addClass('picking-color');
  });

  function mouseClicked(){
      if(MouseinCanvas()){
          selectingcolor=false;
          $('body').removeClass('picking-color');
        }
  }

  function MouseinCanvas(){
      if(mouseX>=0 && mouseX<=width && mouseY>=0 && mouseY<=height){
          return true;
      }else{
          return false;
      }
  }
 
  ///// filters /////
  function GrayScale(pixels){
    for (let i = 0; i < pixels.length/4; i++) {
        let x=i*4;
        let average = (pixels[x+0]+pixels[x+1]+pixels[x+2])/3
        pixels[x+0] = average;
        pixels[x+1] = average;
        pixels[x+2] = average;
    }
  }

  function Default(pixels){
    let r= Number(redSlider.val());
    let g= Number(greenSlider.val());
    let b= Number(blueSlider.val());
    let l=Number(LightnessSlider.val());
    let s=Number(SaturationSlider.val()) * -1;
    let maximo = null;
    
    for (let i = 0; i < pixels.length/4; i++) {
        let x=i*4;
        if(pixels[x+0] > pixels[x+1]){
            maximo=pixels[x+0]
        }else{
            maximo=pixels[x+1]
        }
        if(maximo<pixels[x+2]){
            maximo=pixels[x+2]
        }
        if(maximo==pixels[x+0]){
            pixels[x+0] = pixels[x+0]+ r +l;
        }else{
            pixels[x+0] = pixels[x+0]+ r +l +s;
        }

        if(maximo==pixels[x+1]){
            pixels[x+1] = pixels[x+1]+ g +l;
        }else{
            pixels[x+1] = pixels[x+1]+ g +l +s;
        }

        if(maximo==pixels[x+2]){
            pixels[x+2] = pixels[x+2]+ b +l;
        }else{
            pixels[x+2] = pixels[x+2]+ b +l +s;
        }
    }
    
  }

  function blackandwhite(pixels){
    for (let i = 0; i < pixels.length/4; i++) {
        let x=i*4;
        let average = (pixels[x+0]+pixels[x+1]+pixels[x+2])/3
        if(average>127){
            pixels[x+0] = 255;
            pixels[x+1] = 255;
            pixels[x+2] = 255;
        }else{
            pixels[x+0] = 0;
            pixels[x+1] = 0;
            pixels[x+2] = 0;
        }
        
    }
  }

  function bits(pixels){
    for (let i = 0; i < pixels.length/4; i++) {
        let y=i*4+4
        for(let x=i*4;x<y;x++){
            if(pixels[x]>127.5){
                pixels[x+0] = 255;
            }else{
                pixels[x+0] = 0;
            }
        }
    }
  }

  function singlecolor(pixels){
    for (let i = 0; i < pixels.length/4; i++) {
        let x=i*4;
        let tolerance = Number(ToleranceSlider.val());
        let difference = Math.abs(pixels[x+0]-sc_r) + Math.abs(pixels[x+1]-sc_g) + Math.abs(pixels[x+2]-sc_b);
        if(difference < tolerance) continue;

        let average = (pixels[x+0]+pixels[x+1]+pixels[x+2])/3
        pixels[x+0] = average;
        pixels[x+1] = average;
        pixels[x+2] = average;
    }
  }