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
var lowerAvgFr ;  
var analyser;
var controls, guiControls, datGUI;
var art_time = 0.0;
/*////////Fish Variables///////*/

var FishQuantity = 8;
var fishFrequencyIndex = [0,2,6,12,46,93,136,325,512];
var fishFrequency = new Uint8Array(FishQuantity);
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
        playAudio(1024);
    }
}

function setAudioContext(fftSize){
    context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    analyser = context.createAnalyser(); 
    src.connect(analyser);
    analyser.connect(context.destination); 
    //FFTSize Deberia ser una potencia de 2
    analyser.fftSize = fftSize;
     //frequencyBinCount son la cantidad de bins donde dividimos los rangos de frecuencia. Deberia ser la mitad de fftSize    
    return analyser;
}

function playAudio(fftSize) { 

    analyser = setAudioContext(fftSize);
    /*/////////////////////////VARIABLES//////////////////**/
    frequencyArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyArray);     
    speed = document.getElementById('thespeedbar').value;

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });    
    renderer.setSize(window.innerWidth, window.innerHeight);



    /*/////////////////////////TEXTURES//////////////////**/

    var texture_loader = new THREE.TextureLoader();
    texture_loader.load("textures/seafloor.png", function(texture){
        scene.background = texture;
    });    

    lower_avg_update();
    var musicAvg = lowerAvgFr*100.0;
    var texture_loader2 = new THREE.TextureLoader();
    var texture2 = createDataTexture(frequencyArray,musicAvg );  

    let uniforms = {
    musicAvg:{type:'float', value: 5.0},
    time:{type:'float', value: 0.0}, 
    spectrum:{type:'t', value: texture2},
    }

    const CircularMaterial =   new THREE.ShaderMaterial({        
    uniforms: uniforms,
    fragmentShader: fragmentShader(),
    vertexShader: vertexShader(),
    blending: THREE.AdditiveBlending,
    transparent:false,
    depthWrite: false,
    depthTest: true,
    });  
    
   
    /*/////////////////////CAMERA/**/////////////////////////

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);   
    camera.position.set( 0,0,0);
    camera.position.set( 40,0,-30);
    camera.rotation.y -= 1.5;
    //controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.update();


    /*///////////////////////////SETTING Scene Objects////////////*/

    centerGroup = new THREE.Group();
    centerGroup.position.set(0,0,0);
    centerGroup.name = 'centerGroup';

    bubbleGroup = new THREE.Group();
    bubbleGroup.name = 'bubbleGroup';  

    setBubbleGroup(bubbleGroup);

    var fishGroup;
    fishGroup = new THREE.Group();
    fishGroup.position.set(300,0,0);
    fishGroup.name ='fishGroup';

    setFishGroup(fishGroup);

    var waveCircle = new THREE.Mesh(TorusGeometry , CircularMaterial);    
    waveCircle.rotation.x +=Math.PI/2; 
    waveCircle.position.set(300, 0,-100);
    waveCircle.name = "waveCircle";


    /*///////////////LIGTHS///////////////*/
    ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.name = "ambientLight";   

    /*////////////////////ADDING TO SCENE///////////////////**/
    fishGroup.add(bubbleGroup);
    centerGroup.add(fishGroup);
    scene.add(centerGroup);    
    scene.add(ambientLight);
    scene.add(waveCircle);
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
        bubble_update(scene, frequencyArray);
        /*///////////////Frequency AGG /////////////////*/
        waveCircle_update(scene, lowerAvgFr);
        lower_avg_update(); 
        /*////CHANGE LIGHTS ///////*/
        lights_update(scene);
        renderer.render(scene, camera);
        window.requestAnimationFrame(render3);
    }  


}

/*//////////////////////UPDATE FUNCTIONS//////////////////////////////*/

function fish_update(scene){
    var overallAvg = avg(frequencyArray);
    for(var i =0; i< fishFrequencyIndex.length -1; i++){        
        fishFrequency[i] = avg(frequencyArray.slice(fishFrequencyIndex[i], fishFrequencyIndex[i+1]));
    }

    for(var i =0; i< FishQuantity; i++){        
        box=scene.getObjectByName('centerGroup').children[0].getObjectByName("fish_container"+i);
        box.position.z = -fishFrequency[i];       
        
    }    
}

function bubble_update(scene, frequencyArray){
    for(var i =0; i< 500; i++){        
        box=scene.getObjectByName('centerGroup').children[0].getObjectByName("bubbleGroup").getObjectByName("bubble"+i);               
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


function lower_avg_update(){    
    lowerHalfArray = frequencyArray.slice(0, (frequencyArray.length/2) - 1); 
    lowerAvg = avg(lowerHalfArray);   
    lowerAvgFr = lowerAvg / lowerHalfArray.length;      
    
}

function rotation_update(scene, speed){
    if(frequencyArray[0]>0){
        if(rotation_global){
            scene.getObjectByName('centerGroup').rotation.y +=0.01;
            camera.rotation.y +=0.01;
        }
        if(rotation_local){
            scene.getObjectByName('centerGroup').children[0].rotation.z -= 0.005*speed;
        }
    }
}



function lights_update(scene){
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


function waveCircle_update(scene, lowerAvgFr){
    musicAvg=parseFloat(lowerAvgFr)*100.0;    
    scene.getObjectByName("waveCircle").material.uniforms['musicAvg'].value=musicAvg;
    scene.getObjectByName("waveCircle").material.uniforms['time'].value=art_time/1000;
    scene.getObjectByName("waveCircle").material.uniforms['spectrum'].value= createDataTexture(frequencyArray, musicAvg);
    art_time++;   
}



/*//////////////////////////////INICIO/////////////////*/
var vizInit = function (){      
  var audio = document.getElementById("audio"); 
  document.onload = function(e){
   audio.play();    
  }
}

window.onload = vizInit();









