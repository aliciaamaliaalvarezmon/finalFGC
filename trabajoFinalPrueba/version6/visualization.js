//initialise simplex noise instance
//var noise = new SimplexNoise();

// the main visualiser function
var file;
var fileLabel;
var context;
var speed;
var scene, camera, renderer;



/*//////////////Data_medium variables/////////////////*/
var frequencyArray;
var lowerHalfArray; 
var upperHalfArray;    
var overallAvg; 
var normaloveAvg;
var high_average;
var lowerMaxFr ;
var lowerAvgFr ;
var upperMaxFr  ;   
var upperAvgFr ;

var analyser;
var controls, guiControls, datGUI;

var art_time = 0.0;
/*////////Fish Variables///////*/

var FishQuantity = 8;
var fishGroup;
var fishFrequencyIndex = [0,2,6,12,46,93,136,325,512];
var fishFrequency = new Uint8Array(FishQuantity);
var fishCol;
var joya =[];
var rotation_global = false;
var rotation_local = false;


function LocalRotate(){
    rotation_local = !rotation_local;
}

function GlobalRotate(){
    rotation_global = !rotation_global;
}


///Applies when it plays a song.
function LoadMusic (param){
    if ( param.files && param.files[0] ){
        fileLabel = document.querySelector("label.file");        
        fileLabel.classList.add('normal');
        audio.classList.add('active');
        var files = param.files;
        audio.src = URL.createObjectURL(files[0]);
        audio.load();               
        audio.play();
        play3(1024);
    }
  }



function ChangeFishColor(param){

    fishCol = document.getElementById("fishColor").value;
    for(var i =0; i< FishQuantity; i++){  
        var fishContainer =scene.children[0].children[0].getObjectByName("fish_container"+i);        
        fishContainer.children[0].children[0].material.color.r= hexToRgb(fishCol)[0];
        fishContainer.children[0].children[0].material.color.g= hexToRgb(fishCol)[1];
        fishContainer.children[0].children[0].material.color.b= hexToRgb(fishCol)[2];
        fishContainer.children[0].children[0].material.needsUpdate= true;
        console.log("volor?", fishContainer.children[0].children[0].material.color);
        renderer.render(scene, camera);
    }


}

function setAudioContext(){
    context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    analyser = context.createAnalyser(); 
    src.connect(analyser);
    analyser.connect(context.destination); 
    //FFTSize Deberia ser una potencia de 2
    analyser.fftSize = 1024;//512
     //frequencyBinCount son la cantidad de bins donde dividimos los rangos de frecuencia. Deberia ser la mitad de fftSize
    console.log(context);
     
    return analyser;
}

function getAudioContext(){
      
    var src = context.createMediaElementSource(audio);
    analyser = context.createAnalyser(); 
    src.connect(analyser);
    analyser.connect(context.destination); 
    //FFTSize Deberia ser una potencia de 2
    analyser.fftSize = 1024;//512
    //frequencyBinCount son la cantidad de bins donde dividimos los rangos de frecuencia. Deberia ser la mitad de fftSize

    return analyser;
}


function play3(fftSize) {
    
    if (context == undefined) {
        analyser = setAudioContext();
    }else{
         analyser =  getAudioContext();
    }
    /*/////////////////////////VARIABLES//////////////////**/
    frequencyArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyArray);     
    speed = document.getElementById('thespeedbar').value;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });    
    renderer.setSize(window.innerWidth, window.innerHeight);

    lowerHalfArray = frequencyArray.slice(0, (frequencyArray.length/2) - 1);
    lowerAvg = avg(lowerHalfArray);
    lowerAvgFr = lowerAvg / lowerHalfArray.length;

    var musicAvg = lowerAvgFr*100.0;






    var texture_loader = new THREE.TextureLoader();
    texture_loader.load("textures/seafloor.png", function(texture){
        scene.background = texture;
    });    

    var texture_loader2 = new THREE.TextureLoader();
    var texture2 = createDataTexture(frequencyArray,musicAvg );//texture_loader2.load("textures/hokusai_painting.jpg");    
    
    /*/////////////////////GEOMETRY AND MATERIALS/**/////////////////////////

    var lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0xff0000,
        wireframe: false
    }); 
    var MeshMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity:0.7, transparent:true, wireframe: true} );    
    var SphereGeometry = new THREE.SphereBufferGeometry(100, 50);
    var TorusGeometry = new THREE.TorusGeometry(1200, 600, 100,100);

    cubeGeometry = new THREE.BoxGeometry(10, 10, 15);
    seedGeometry = new THREE.IcosahedronGeometry(3.0);//new THREE.BoxGeometry(3, 3, 3); 
    /*/////////////////////CAMERA/**/////////////////////////

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);   
    camera.position.set( 0,0,0);
    camera.position.set( 40,0,-30);
    camera.rotation.y -= 1.5;
    /*///////////////////////////SETTING Scene Objects////////////*/ 
    //controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.update();

    fishGroup = new THREE.Group();
    fishGroup.position.set(300,0,0);
    fishGroup.name ='fishGroup';

    centerGroup = new THREE.Group();
    centerGroup.position.set(0,0,0);
    centerGroup.name = 'centerGroup';

    faunaGroup = new THREE.Group();
    faunaGroup.name = 'faunaGroup';  

    const texture = new THREE.TextureLoader().load( 'textures/particle_texture.jpeg' );  


    //const color = THREE.MathUtils.randInt(0, 0xffffff);
    var color2 = 0x00ff00;
    var color3= 0x2e8b57;
    var color1= 0xffff55;
    cubeMaterial2 = new THREE.MeshLambertMaterial({color:color1});
    cubeMaterial2.opacity= 1;
    cubeMaterial2.blending = THREE.AdditiveBlending;
    cubeMaterial2.transparent= true;
    cubeMaterial2.map = texture;
    cubeMaterial3= new THREE.MeshLambertMaterial({color:color2}); 
    cubeMaterial3.opacity= 1;
    cubeMaterial3.blending = THREE.AdditiveBlending;
    cubeMaterial3.transparent= true;
    cubeMaterial3.map = texture;
    cubeMaterial4= new THREE.MeshLambertMaterial({color:color3});
    cubeMaterial4.opacity= 1;
    cubeMaterial4.blending = THREE.AdditiveBlending;
    cubeMaterial4.transparent= true;
    cubeMaterial4.map = texture;



  
   

    var colorvar = 0;
    var x= 150;
    var y =-100;
    var z =-250;

    for (var i=0; i< 512;i++){
        if(colorvar< 10){
        cube = new THREE.Mesh(seedGeometry, cubeMaterial2);
        }else{
            if(colorvar>=10 && colorvar<=20){
               cube = new THREE.Mesh(seedGeometry, cubeMaterial3); 
            }else{
                cube = new THREE.Mesh(seedGeometry, cubeMaterial4); 
            }
        }
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.name = "fauna"+i;
        cube.position.z = z;
        z += 25;   
        if ( z == 100){
            y += 30;
            z = -250;
            colorvar += 1;
        }
        else if (y >= 90){
            y = -100;
            x -= 50;
            z = -200;            
        }     
        cube.position.y = y;
        cube.position.x = x;  
        cube.visible = false;   
        faunaGroup.add(cube);      
        //console.log(cube.name, cube.position);
        
    }


    for (var i=0; i< FishQuantity;i++){
        cube = new THREE.Object3D();
        cube.name = "fish_container"+i;
        fishGroup.add(cube);              
    }

    /*frequencyArray2 = new Uint8Array(frequencyArray.length*3);

    for(var i = 0; i< frequencyArray.length; i++){
        frequencyArray2[i+0]= frequencyArray[i];
        frequencyArray2[i+1]= frequencyArray[i+1];
        frequencyArray2[i+2]= frequencyArray[i+2];

    }*/    

    //var texture2 =new THREE.DataTexture( frequencyArray2, 512, 1, THREE.RGBFormat );



    let uniforms = {
        colorB: {type: 'vec3', value: new THREE.Color(0xffffff)},
        colorA: {type: 'vec3', value: new THREE.Color(0xff0000)},
        musicAvg:{type:'float', value: 5.0},
        time:{type:'float', value: 0.0}, 
        musicHigh:{type:'float', value: 1.0},
        musicLow:{type:'float', value: 1.0} , 
        spectrum:{type:'t', value: texture2},         

    }
    const DummyMaterial =   new THREE.ShaderMaterial({        
    uniforms: uniforms,
    fragmentShader: fragmentShader(),
    vertexShader: vertexShader(),
    blending: THREE.AdditiveBlending,
    transparent:false,
    depthWrite: false,
    depthTest: true,
    });

    var dummy = new THREE.Mesh(TorusGeometry , DummyMaterial);
    //dummy.rotation.y +=1.5; 
    dummy.rotation.x +=Math.PI/2; 
    dummy.position.set(300, 0,-100);

    //dummy.position.set(300, 0,100);
    
    dummy.name = "dummy";

    /*var dummy2 =  new THREE.Mesh(SphereGeometry , lambertMaterial);
    dummy2.position.set(-1000, 0,100);

    var dummy3 = new THREE.Mesh(SphereGeometry , lambertMaterial);
    dummy3.position.set(0, 0,1000);

    var dummy4 =  new THREE.Mesh(SphereGeometry , lambertMaterial);
    dummy4.position.set(0, 0,-1000);
*/

   
    //fishCol= document.getElementById('fishColor').value;  
    /*/////////////////////////LOADING Scene Objects ////////////*/

    const loader = new THREE.GLTFLoader();

    loader.load( 'colorfish1.glb', function ( gltf ) {

    for(var i=0; i< FishQuantity; i++){
        let copy= gltf.scene.clone();        
        copy.scale.set(7,7,7); 
        copy.name ='actual_fish_group'+i;
        copy.children[0].name = "actual_fish_mesh"+i;
        copy.position.set(50,-60+20*i,0);
        copy.rotation.y+= Math.PI/2;
        copy.receiveShadow = true;        
        copy.children[0].receiveShadow = true;
        //copy.children[0].material = lambertMaterial.clone();
        joya.push(copy.children[0]);
        fishGroup.getObjectByName('fish_container'+i).add(copy);      
    }
    }, undefined, function ( error ) {
    console.error( error );
    } );  



    /*///////////////LIGTHS///////////////*/
    //color = 0xffffff;//0xff3300;
    ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.name = "ambientLight";   

    var spotlight3 = new THREE.SpotLight(0xff0000);
    spotlight3.name = "spotlight3";
    spotlight3.position.set(+700,50,100);
    spotlight3.castShadow = true;
    spotlight3.rotation.x -=1.5;
    spotlight3.target = fishGroup;
    
    var spotlight4 = new THREE.SpotLight(0x0000ff);
    spotlight4.name = "spotlight4";
    spotlight4.position.set(-700,50,100);
    spotlight4.castShadow = true;
    spotlight4.rotation.x -=1.5;
    spotlight4.target = fishGroup;

    console.log("light?", fishGroup);

    const helper3 = new THREE.SpotLightHelper( spotlight3, 0x00ffff );
    const helper4 = new THREE.SpotLightHelper( spotlight4, 0x0000ff );


    /*////////////////////ADDING TO SCENE///////////////////**/
    fishGroup.add(faunaGroup);
    centerGroup.add(fishGroup);
    scene.add(centerGroup);    
    scene.add(ambientLight);
    
   // fishGroup.add(spotlight3 );
    //fishGroup.add(spotlight4 );
    scene.add(dummy);
    /*scene.add(dummy2);
    scene.add(dummy3);
    scene.add(dummy4);*/
    //fishGroup.add(helper3);
    //fishGroup.add(helper4);
    //scene.add(camera);
    render3();
    document.getElementById('out').appendChild(renderer.domElement); 





    function render3(){
        speed = document.getElementById('thespeedbar').value;    
        audio.playbackRate = speed;  
        analyser.getByteFrequencyData(frequencyArray);
        //*///////////////// MOVER PECES ///////////////////*/
        fish_update(scene, fishFrequency);
        rotation_update(scene, speed);
        /* /////////////////////Desaparecer cajas ///////////////////* */
        fauna_update(scene, frequencyArray);

        /*///////////////Frequency AGG /////////////////*/
        dummy_update(scene, lowerAvgFr);
        freq_stats_update(); 
        /*////CHANGE LIGHTS ///////*/
        lights_update(scene);
        renderer.render(scene, camera);
        window.requestAnimationFrame(render3);
    }  


}

/*//////////////////////UPDATE FUNCTIONS//////////////////////////////*/

function fish_update(scene){
    overallAvg = avg(frequencyArray);
    for(var i =0; i< fishFrequencyIndex.length -1; i++){        
        fishFrequency[i] = avg(frequencyArray.slice(fishFrequencyIndex[i], fishFrequencyIndex[i+1]));
    }

    for(var i =0; i< FishQuantity; i++){        
        box=scene.getObjectByName('centerGroup').children[0].getObjectByName("fish_container"+i);
        box.position.z = -fishFrequency[i];       
        
    }
    console.log("scene", scene);
}

function fauna_update(scene, frequencyArray){
    for(var i =0; i< 500; i++){        
        box=scene.getObjectByName('centerGroup').children[0].getObjectByName("faunaGroup").getObjectByName("fauna"+i);               
        if(frequencyArray[i]>100){           
            box.visible = true;
            if(frequencyArray[i]<=150){
                box.scale.set(1,1,1); 
            }            
            if(frequencyArray[i]>150){
                box.scale.set(2,2,2);               
            }
            if(frequencyArray[i]>200){
                box.scale.set(3,3,3);               
            }
        }else{
            box.visible = false;
        }
        
    }
}


function freq_stats_update(){
    
    lowerHalfArray = frequencyArray.slice(0, (frequencyArray.length/2) - 1);
    upperHalfArray = frequencyArray.slice((frequencyArray.length/2) - 1, frequencyArray.length - 1);   
    lowerMax = max(lowerHalfArray);
    lowerAvg = avg(lowerHalfArray);
    upperMax = max(upperHalfArray);
    upperAvg = avg(upperHalfArray);

    lowerMaxFr = lowerMax / lowerHalfArray.length;
    lowerAvgFr = lowerAvg / lowerHalfArray.length;
    upperMaxFr = upperMax / upperHalfArray.length;    
    upperAvgFr = upperAvg / upperHalfArray.length;
}

function rotation_update(scene, speed){
    if(frequencyArray[0]>0){
        if(rotation_global){
            scene.getObjectByName('centerGroup').rotation.y +=0.01;//*audio.playbackRate;
            camera.rotation.y +=0.01;
        }
        if(rotation_local){
            scene.getObjectByName('centerGroup').children[0].rotation.z -= 0.005*speed;
        }
    }
}



function lights_update(scene){
       // scene.getObjectByName('centerGroup').children[0].getObjectByName("spotlight3").intensity = lowerMaxFr;
       // console.log("df",lowerAvgFr) ;
        scene.getObjectByName('ambientLight').intensity = frequencyArray[0]/100;
        if(frequencyArray>200){
            var h = 100;
            var s = 0.4;
            var l = 0.4;
        }else{
            var h = 0.4;
            var s = 50;
            var l = 50;
        }
        scene.getObjectByName('ambientLight').color.setHSL ( h, s, l ); 
} 
//*/////////////////    HELPER FUNCTIONS//////////////////////*/
function fractionate(val, minVal, maxVal) {
    return (val - minVal)/(maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
    var fr = fractionate(val, minVal, maxVal);
    var delta = outMax - outMin;
    return outMin + (fr * delta);
}

function avg(arr){
    var total = arr.reduce(function(sum, b) { return sum + b; });
    return (total / arr.length);
}

function max(arr){
    return arr.reduce(function(a, b){ return Math.max(a, b); })
}

function maxIndx(arr){
arr.reduce((bestIndexSoFar, currentlyTestedValue, currentlyTestedIndex, array) => currentlyTestedValue > array[bestIndexSoFar] ? currentlyTestedIndex : bestIndexSoFar, 0);
}

function hexToRgb(h){return['0x'+h[1]+h[2]|0,'0x'+h[3]+h[4]|0,'0x'+h[5]+h[6]|0]}

/*//////////////////////////////INICIO/////////////////*/



var vizInit = function (){    
  
  var audio = document.getElementById("audio"); 
  document.onload = function(e){
    audio.play();    
  }
}




window.onload = vizInit();

/*precision highp float;
varying vec3 vNormal;

#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)

uniform float u_time;
uniform float u_amplitude;
uniform float u_frequency;

void main () {
  vNormal = normalMatrix * normalize(normal);
  float distortion = snoise4(vec4(normal * u_frequency, u_time)) * u_amplitude;
  vec3 newPosition = position + (normal * distortion);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}*/


   function vertexShader() {
    return `
        attribute float vertexDisplacement;        
        varying vec2 vao; 
        uniform float musicAvg;
        uniform float musicHigh;
        uniform float musicLow;
        varying float vWave;

        uniform float time; 

        //  Simplex 3D Noise 
//  by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
} 

        

        void main() {
        
        vao= uv;

        vec3 pos = position;       
        float noiseFreq = 3.5;
        float noiseAmp = musicAvg; 
        vec3 noisePos = vec3(pos.x * noiseFreq + time, pos.y, pos.z);
        pos.z += snoise(noisePos) * noiseAmp;
        vWave = pos.z; // Off it goes!


        vec3 transformed = vec3(position);
        if(musicAvg>0.0){             
            transformed.x = position.x - musicAvg*5.0;            

        }       
  
        vec4 modelViewPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_Position = projectionMatrix * modelViewPosition ; 
        }
    `
    }
    function fragmentShader(){
      return `

      uniform vec3 colorA; 
      uniform vec3 colorB;
      varying vec2 vao; 
      uniform float musicAvg;
      uniform sampler2D spectrum; 
      varying float vWave;      

    


    void main() { 
        float wave = vWave * 0.0007;
        float r = texture2D(spectrum, vao).r;
        float g = texture2D(spectrum, vao+ wave).g;
        float b = texture2D(spectrum, vao).b;
        // Put them back together
        vec3 texture = vec3(r, g, b);
        //vec3 texture = texture2D(spectrum, vao + wave).rgb;           
        
        gl_FragColor = vec4(texture, musicAvg/100.0);
        
      }
    `
    }


function createDataTexture(frequencyArray, musicAvg){
const width = 512;
const height = 512;

var color1 = 50.0;
const size = width * height;
const data = new Uint8Array( 3 * size );
var frequencyClone = frequencyArray;



var j = 0.0;
for ( let i = 0; i < size; i ++ ) {

    const stride = i * 3;
    

    data[ stride ] = frequencyClone[i%256];
    /*if(musicAvg>0){
        data[ stride + 1 ] = j;
    }else{
        data[ stride + 1 ] = 0.0;
    }*/
    data[ stride + 1 ] = j;
    data[ stride + 2 ] = 0.0;

    if(j <100.0){
        j++;
    }else{
        j=0.0;
    }



}
// used the buffer to create a DataTexture

const texture = new THREE.DataTexture( data, width, height, THREE.RGBFormat );
return texture;
}


function dummy_update(scene, lowerAvgFr){
    //console.log("djlad", scene.getObjectByName("dummy"));
    console.log(typeof lowerAvgFr);
    jojo=parseFloat(lowerAvgFr)*100.0;
    console.log("jojo",jojo); 
    joje = parseFloat(upperAvgFr)*100.0;
    scene.getObjectByName("dummy").material.uniforms['musicAvg'].value=jojo;
    scene.getObjectByName("dummy").material.uniforms['musicHigh'].value=joje;
    scene.getObjectByName("dummy").material.uniforms['time'].value=art_time/1000;

    scene.getObjectByName("dummy").material.uniforms['spectrum'].value= createDataTexture(frequencyArray, jojo);
    art_time++;
    //scene.getObjectByName("dummy").material.needsUpdate = true;
}


    /*    void main() {
            vUv = position; 
        vec3 transformed = vec3(position); 
        transformed.x = position.x + position.y/musicAvg*10.0;     
        vec4 modelViewPosition = modelViewMatrix * vec4(position+vec3(musicAvg, musicAvg,musicAvg), 1.0);
        gl_Position = projectionMatrix * modelViewPosition ; 
        }

         gl_FragColor = texture2D(spectrum, vao);

        
    `*/
