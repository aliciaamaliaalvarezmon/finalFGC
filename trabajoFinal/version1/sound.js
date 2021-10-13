
var canvas, canvasMusicCtx, gl;
var analyser, bufferLength ,dataArray,audioCtx;  
var source;
window.onload = InitWebGL;   
function InitWebGL()
{
  // Inicializamos el canvas WebGL
  console.log("se llama");
  canvas = document.getElementById("canvas");
  canvas.oncontextmenu = function() {return false;};  
  gl = canvas.getContext("webgl", {antialias: false, depth: true}); 
  if (!gl) 
  {
    alert("Imposible inicializar WebGL. Tu navegador quizás no lo soporte.");
    return;
  }
  

 // gl.enable(gl.DEPTH_TEST); // habilitar test de profundidad 
  
  // Inicializar los shaders y buffers para renderizar  
 // boxDrawer  = new BoxDrawer();
 // meshDrawer = new MeshDrawer();
  
  // Setear el tamaño del viewport
  UpdateCanvasSize();
}





// Funcion para actualizar el tamaño de la ventana cada vez que se hace resize
function UpdateCanvasSize()
{
  // 1. Calculamos el nuevo tamaño del viewport
  canvas.style.width  = "100%";
  canvas.style.height = "100%";

  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width  = pixelRatio * canvas.clientWidth;
  canvas.height = pixelRatio * canvas.clientHeight;

  const width  = (canvas.width  / pixelRatio);
  const height = (canvas.height / pixelRatio);

  canvas.style.width  = width  + 'px';
  canvas.style.height = height + 'px';
  
  // 2. Lo seteamos en el contexto WebGL
  //gl.viewport( 0, 0, canvas.width, canvas.height );

  // 3. Cambian las matrices de proyección, hay que actualizarlas
  //UpdateProjectionMatrix();
}


function WindowResize()
{
  UpdateCanvasSize();
  //DrawScene();
}



var x; 

function playAudio() { 
  console.log("play")
  x.play(); 
  
} 

function pauseAudio() { 
  x.pause();
   

} 


function LoadMusic( param )
{
  if ( param.files && param.files[0] ) 
  {
    var reader = new FileReader();
    reader.onload = function(e) 
    {
      music = e.target.result;      
      var audio = new Audio(music);
      if(x != null){
        pauseAudio();
      }
      x = audio;
      if(audioCtx == null){
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      };
      console.log("context", audioCtx);      
      analyser = audioCtx.createAnalyser();      
      console.log('analyser',analyser);
      analyser.fftSize = 2048;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      //gl.viewport(0, 0, canvas.width, canvas.height);
      draw();


      const stream_dest = audioCtx.createMediaStreamDestination();
      source = audioCtx.createMediaElementSource(audio);
      source.connect(stream_dest);

      const stream = stream_dest.stream;
      source.connect(analyser);
      //analyser.connect(distortion);
      //distortion.connect(audioCtx.destination);
      analyser.connect(audioCtx.destination);
      //audio.play();      
      console.log('stream',stream, source);
      //audio.play();
    };
    reader.readAsDataURL( param.files[0] );
  }
}




function draw() {
      var canvasMusic = document.getElementById("canvas-music");
      var canvasMusicCtx = canvasMusic.getContext("2d");

      WIDTH = canvasMusic.width;
      HEIGHT = canvasMusic.height; 

      drawVisual = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);
      console.log(dataArray);
      canvasMusicCtx.fillStyle = 'rgb(50, 200, 50)';
      canvasMusicCtx.fillRect(0, 0, WIDTH , HEIGHT );

      canvasMusicCtx.lineWidth = 2;
      canvasMusicCtx.strokeStyle = 'rgb(0, 0, 0)';

      canvasMusicCtx.beginPath();

      var sliceWidth = WIDTH * 1.0 / bufferLength;
      console.log("bufferLength", bufferLength);
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;
        
        //console.log("corr", x, y, v);

        if(i === 0) {
          canvasMusicCtx.moveTo(x, y);
        } else {
          canvasMusicCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasMusicCtx.lineTo(canvas.width, canvas.height/2);
      canvasMusicCtx.stroke();
}

   







function doupload(param) {
  if ( param.files && param.files[0] ) {
    let data = document.getElementById("track").files[0];
    let entry = document.getElementById("track").files[0];
    console.log('doupload',entry,data)
    fetch('uploads/' + encodeURIComponent(entry.name), {method:'PUT',body:data});
    alert('your file has been uploaded');
    location.reload();
  }
}































function add() {
  var a = document.getElementById('a').value;
  var b = document.getElementById('b').value;

  var sum = parseInt(a) + parseInt(b);
  alert(sum);
}