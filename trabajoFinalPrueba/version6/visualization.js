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

var analyser;
var controls, guiControls, datGUI;

/*////////Fish Variables///////*/

var FishQuantity = 8;
var fishGroup;
var fishFrequencyIndex = [0,2,6,12,46,93,136,325,512];
var fishFrequency = new Uint8Array(FishQuantity);
var fishCol;
var joya =[];


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
        var fishContainer =scene.children[0].children[0].getObjectByName("box"+i);        
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
    //var x = 0;
    var y = 0;
    var z = 0;
    
    speed = document.getElementById('thespeedbar').value;
    scene = new THREE.Scene();


    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });    
    renderer.setSize(window.innerWidth, window.innerHeight); 

    /*/////////////////////CAMERA/**/////////////////////////

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);   
    
    
    
    /*/////////////////////GEOMETRY AND MATERIALS/**/////////////////////////


    
    var lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0x0000ff,
        wireframe: false
    }); 
    var MeshMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity:0.7, transparent:true, wireframe: true} );    
    var SphereGeometry = new THREE.SphereBufferGeometry(30, 10);
    
    cubeGeometry = new THREE.BoxGeometry(10, 10, 15);
    seedGeometry = new THREE.BoxGeometry(3, 3, 3);
    

    /*///////////////////////////SETTING Scene Objects////////////*/ 

    fishGroup = new THREE.Group();
    fishGroup.position.set(300,0,0);//300,0,0

    camera.position.set( 0,0,0);

    camera.position.set( 40,0,-30);
    camera.rotation.y -= 1.5;


   ;
    //controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.update();

    centerGroup = new THREE.Group();
    centerGroup.position.set(0,0,0);

    faunaGroup = new THREE.Group();

    
    for (var i=0; i< FishQuantity;i++){
        cube = new THREE.Object3D();
        cube.name = "container_fish"+i;
        fishGroup.add(cube);              
    }


    var x= 150;
    var y =-100;
    var z =-250;
    //const color = THREE.MathUtils.randInt(0, 0xffffff);
    var color2 = 0x00ff00;
    var color3= 0x2e8b57;
    var color1= 0xffff55;
    cubeMaterial2 = new THREE.MeshLambertMaterial({color:color1});
    cubeMaterial2.opacity= 0.5;
    cubeMaterial2.transparent= false;
    cubeMaterial3= new THREE.MeshLambertMaterial({color:color2}); 
    cubeMaterial4= new THREE.MeshLambertMaterial({color:color3});

    var colorvar = 0;

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

    function vertexShader() {
    return `
        varying vec3 vUv; 

        void main() {
            vUv = position; 

        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition; 
        }
    `
    }
    function fragmentShader(){
      return `
      uniform vec3 colorA; 
      uniform vec3 colorB; 
      varying vec3 vUv;

      void main() {
        gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
      }
    `
    }
    let uniforms = {
        colorB: {type: 'vec3', value: new THREE.Color(0x000000)},
        colorA: {type: 'vec3', value: new THREE.Color(0x74ebd5)}
    }
    const DummyMaterial =   new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: fragmentShader(),
    vertexShader: vertexShader(),
  })



    var dummy = new THREE.Mesh(SphereGeometry , DummyMaterial);
    dummy.position.set(300, 0,0);

    console.log("color", document.getElementById('fishColor').value);
    var fishshi= document.getElementById('fishColor').value;
    console.log("type",  hexToRgb(fishshi));

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
        copy.children[0].material = lambertMaterial.clone();
        copy.children[0].material.color.r= hexToRgb(fishshi)[0];
        copy.children[0].material.color.g= hexToRgb(fishshi)[1];
        copy.children[0].material.color.b= hexToRgb(fishshi)[2];
        joya.push(copy.children[0]);
        console.log("copy fush",joya);
        

    //fishGroup.add( gltf.scene );
        //var box = fishGroup.getObjectByName('box'+i);
        fishGroup.getObjectByName('box'+i).add(copy);
      //  fishGroup.add( copy );        
    }

    }, undefined, function ( error ) {

    console.error( error );

    } );  

    /*///////////////LIGTHS///////////////*/
    //color = 0xffffff;//0xff3300;
    ambientLight = new THREE.AmbientLight(0xffffff);
    
    spotLight = new THREE.SpotLight(0x0000ff);
    spotLight.castShadow = true;
    spotLight.position.set(-10,50,700);
    spotLight.intensity =0.4;


    var spotlight2 = new THREE.SpotLight(0x0000ff);
    spotlight2.position.set(-100,50,-700);
    spotlight2.castShadow = true;

    var spotlight3 = new THREE.SpotLight(0xff0000);
    spotlight3.position.set(+700,50,100);
    spotlight3.castShadow = true;
    spotlight3.rotation.x -=1.5;
    
    var spotlight4 = new THREE.SpotLight(0x0000ff);
    spotlight4.position.set(-700,50,100);
    spotlight4.castShadow = true;
    spotlight4.rotation.x -=1.5;



    
   //const helper = new THREE.SpotLightHelper( spotLight, 0xffffff );
   // const helper2 = new THREE.SpotLightHelper( spotlight2, 0xff0000 );
    const helper3 = new THREE.SpotLightHelper( spotlight3, 0x00ffff );
    const helper4 = new THREE.SpotLightHelper( spotlight4, 0x0000ff );


    /*////////////////////ADDING TO SCENE///////////////////**/
    fishGroup.add(faunaGroup);
    centerGroup.add(fishGroup);
    scene.add(centerGroup);
    //scene.add(faunaGroup);
    scene.add(ambientLight);    
    //fishGroup.add(spotLight);
   // fishGroup.add(spotlight2 );
    fishGroup.add(spotlight3 );
  //  fishGroup.add(spotlight4 );
   // scene.add(dummy);
   /* fishGroup.add(helper);
    fishGroup.add(helper2);
    fishGroup.add(helper3);
    fishGroup.add(helper4);*/
    //scene.add(camera);
    //initialRender();
    render3();
    document.getElementById('out').appendChild(renderer.domElement);    

    function initialRender(){
        speed = document.getElementById('thespeedbar').value;
    
        audio.playbackRate = speed; 
        renderer.render(scene, camera);
    }

    function render3(){

    speed = document.getElementById('thespeedbar').value;    
    audio.playbackRate = speed;  

    analyser.getByteFrequencyData(frequencyArray);

    //*///////////////// MOVER PECES ///////////////////*/

    overallAvg = avg(frequencyArray);


    for(var i =0; i< fishFrequencyIndex.length -1; i++){        
        fishFrequency[i] = avg(frequencyArray.slice(fishFrequencyIndex[i], fishFrequencyIndex[i+1]));
    }

    for(var i =0; i< FishQuantity; i++){        
        box=fishGroup.getObjectByName("box"+i);
        box.position.z = -fishFrequency[i];       
        
    }

    if(frequencyArray[0]>0){
        centerGroup.rotation.y +=0.01;//*audio.playbackRate;
        camera.rotation.y +=0.01;
        fishGroup.rotation.z -= 0.005*speed;
    }

    /* /////////////////////Desaparecer cajas ///////////////////* */

    for(var i =0; i< 500; i++){        
        box=faunaGroup.getObjectByName("fauna"+i);
        //console.log(box.name);        
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



    /*///////////////Frequency AGG /////////////////*/
    
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

   /*////CHANGE LIGHTS ///////*/



   spotlight3.intensity = lowerMaxFr;

   console.log("fjslfjintensity", spotLight.intensity );


   // console.log("df",lowerAvgFr) ;


    ambientLight.intensity = frequencyArray[0]/100;
    if(frequencyArray>200){
    var h = 50;
    var s = 0.4;
    var l = 0.4;
    }else{
    var h = 0.4;
    var s = 50;
    var l = 50;

    }
    ambientLight.color.setHSL ( h, s, l );  

    renderer.render(scene, camera);
    window.requestAnimationFrame(render3);
    }  


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
