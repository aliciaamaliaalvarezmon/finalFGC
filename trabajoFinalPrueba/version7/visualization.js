//initialise simplex noise instance
//var noise = new SimplexNoise();

// the main visualiser function
var file;
var fileLabel;
var context;
var visualizationScene;
var dataArray;
var analyser;
var controls;
var rmapped = 0;
var color;

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
        play2(1024);
    }
  }

function setAudioContext(){
    context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser(); 
    src.connect(analyser);
    analyser.connect(context.destination); 
    //FFTSize Deberia ser una potencia de 2
    analyser.fftSize = 1024;//512
     //frequencyBinCount son la cantidad de bins donde dividimos los rangos de frecuencia. Deberia ser la mitad de fftSize
    console.log(context);
     
    return analyser;
}

//asumimos window global


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

function play2(fftSize) {
    
    if (context == undefined) {
        analyser = setAudioContext();
    }else{
         analyser =  getAudioContext();

    }
    
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);    
    var visualBins = new Uint8Array(8);
    console.log("CONTEXT", context);
    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight); 
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);   
    camera.position.set(0,0,10);
    camera.lookAt(scene.position);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    

    var planeGeometry = new THREE.PlaneBufferGeometry(window.innerWidth /window.innerHeight);
    var icosahedronGeometry = new THREE.IcosahedronGeometry(20, 6);
    var lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0xff00ee,
        wireframe: false
    });
    var icosahedronGeometry2 = new THREE.SphereGeometry(5, 3);
    var lambertMaterial2 = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity:0.7, transparent:true, wireframe: false} );
    
    var parent = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    parent.position.set(0, 0, 0);

    var  smallball= new THREE.Mesh(icosahedronGeometry2, lambertMaterial2);
    smallball.position.set(0, 5, -25);

    var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0x6AFF33,
        side: THREE.DoubleSide,
        wireframe: false
    });

    
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, -30, 0);
    parent.add(plane);

    for(var i =0; i< 8; i++){
      cubeGeometry = new THREE.BoxGeometry(5, 5, 10);
      cubeMaterial = new THREE.MeshPhongMaterial({color:0xffffff});

      cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.castShadow = true;
      cube.receiveShadow = true;
      cube.name = "box"+i;
      cube.position.set(0,-60+i*20,+100);      
      console.log(cube.name);
      parent.add(cube);
      
    }
    scene.add(parent);
    color = 0xffffff;//0xff3300;
    ambientLight = new THREE.AmbientLight(color);

    scene.add(ambientLight); 
    ambientLight2 = new THREE.AmbientLight(0x000000);
    scene.add(ambientLight2);


    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.castShadow = true;
    spotLight.name = "spotLigth"+i;
    spotLight.position.set (20, 35, 40);       
    lightTarget = new THREE.Object3D();
    lightTarget.position.set(0,0,0);        
    spotLight.target=lightTarget;
    parent.add(lightTarget);
    parent.add(spotLight);
    

    var bandBuffer = new Uint8Array(8);
    for (var i =0; i <8;i++){
        bandBuffer[i] = 0;
    }
    var band_Decrease = 0.005;
    //camera.rotateY( THREE.MathUtils.degToRad(90) );

   

    //camera.lookAt(parent);
    render2();
    document.getElementById('out').appendChild(renderer.domElement);
    function render2(){

    var speed = document.getElementById('thespeedbar').value;
    audio.playbackRate = speed;
    console.log("SPEED", speed,audio.playbackRate );
    analyser.getByteFrequencyData(dataArray);
    console.log(dataArray);
    var lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
    var upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);
    
    var overallAvg = avg(dataArray);
    var normaloveAvg = avg(dataArray)/max(dataArray);
    var high_average = avg(upperHalfArray)/max(dataArray);
    dataArray0 = dataArray.slice(0, 2);
    dataArray1 = dataArray.slice(2, 6);
    dataArray2 = dataArray.slice(6, 12);
    dataArray3 = dataArray.slice(12, 46);
    dataArray4 = dataArray.slice(46, 93);
    dataArray5 = dataArray.slice(93, 136);
    dataArray6 = dataArray.slice(136, 325);
    dataArray7 = dataArray.slice(325, 512);
    //console.log("jjfñljlña", dataArray0);

    box0 =parent.getObjectByName("box"+0);
    box0.position.z =-avg(dataArray0)*2;

    box0.material.color.set(Math.floor(avg(dataArray0)), 0,overallAvg);

    box1 =parent.getObjectByName("box"+1);
    box1.position.z =-avg(dataArray1)*2;

    box1.material.color.set(Math.floor(avg(dataArray1)), overallAvg,0);

    box2 =parent.getObjectByName("box"+2);
    box2.position.z =-avg(dataArray2)*2;

    box2.material.color.set(Math.floor(avg(dataArray2)), 0,overallAvg);
    box3 =parent.getObjectByName("box"+3);
    box3.position.z =-avg(dataArray3)*2;
    box3.material.color.set(Math.floor(avg(dataArray3)), overallAvg,0);

    box4 =parent.getObjectByName("box"+4);
    box4.position.z =-avg(dataArray4)*2;
    box4.material.color.set(Math.floor(avg(dataArray4)), 0,overallAvg);

    box5 =parent.getObjectByName("box"+5);
    box5.position.z =-avg(dataArray5)*2;
    box5.material.color.set(Math.floor(avg(dataArray5)), overallAvg,0);

    box6 =parent.getObjectByName("box"+6);
    box6.position.z =-avg(dataArray6)*2;
    box6.material.color.set(Math.floor(avg(dataArray6)), 0,overallAvg);

    box7=parent.getObjectByName("box"+7);
    box7.position.z =-avg(dataArray7)*2;
    box7.material.color.set(Math.floor(avg(dataArray7)), overallAvg,0);
    var direction =1;
    const quaternion = new THREE.Quaternion();
    //quaternion.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), Math.PI / 200 );
/*
    for (var i=0; i<16; i++){
        spotLight = scene.getObjectByName("spotLigth"+i);
        spotLight.intensity = dataArray[16*3+i]/10;
        console.log(spotLight.intensity, "intensity" );


        backgrop
    }*/

 
    //parent.rotateOnAxis((0,1,0));

    
    
    var lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
    var upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);

    var overallAvg = avg(dataArray);
    var lowerMax = max(lowerHalfArray);
    var lowerAvg = avg(lowerHalfArray);
    var upperMax = max(upperHalfArray);
    var upperAvg = avg(upperHalfArray);

    var lowerMaxFr = lowerMax / lowerHalfArray.length;
    var lowerAvgFr = lowerAvg / lowerHalfArray.length;
    var upperMaxFr = upperMax / upperHalfArray.length;    
    var upperAvgFr = upperAvg / upperHalfArray.length;

    if(normaloveAvg>0){
        //parent.rotation.y +=0.01;
        //camera.rotation.y +=0.01;
        
        parent.rotation.y +=normaloveAvg/10;
        smallball.rotation.y += normaloveAvg/15;
        //camera.rotation.y +=normaloveAvg/10;
        console.log(camera.position.Z, "TRY");
    }
    console.log("average", normaloveAvg);


    var h = high_average;
    var s = 0.4;
    var l = 0.4;
    ambientLight.color.setHSL ( h, s, l );  




    /*ambientLight.intensity = normaloveAvg*2 ;
    ambientLight2.intensity =high_average*2;*/
    renderer.render(scene, camera);
    window.requestAnimationFrame(render2);
    }   


}







//some helper functions here
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








//CAN Become ADD FISH 
function addTriangle(scene){
    const material = new THREE.MeshNormalMaterial()
    let geometry = new THREE.BufferGeometry()
    const points = [
        new THREE.Vector3(-1, 1, -1),//c
        new THREE.Vector3(-1, -1, 1),//b
        new THREE.Vector3(1, 1, 1),//a   

        new THREE.Vector3(1, 1, 1),//a    
        new THREE.Vector3(1, -1, -1),//d  
        new THREE.Vector3(-1, 1, -1),//c

        new THREE.Vector3(-1, -1, 1),//b
        new THREE.Vector3(1, -1, -1),//d  
        new THREE.Vector3(1, 1, 1),//a

        new THREE.Vector3(-1, 1, -1),//c
        new THREE.Vector3(1, -1, -1),//d    
        new THREE.Vector3(-1, -1, 1),//b
    ]

    geometry.setFromPoints(points)
    geometry.computeVertexNormals()

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
}





var vizInit = function (){    
  
  var audio = document.getElementById("audio"); 
  document.onload = function(e){
    audio.play();
    play(1024);
  }
}



window.onload = vizInit();
