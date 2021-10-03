//initialise simplex noise instance
//var noise = new SimplexNoise();

// the main visualiser function
var file;
var fileLabel;
var context;
var visualizationScene;
var speed;
var scene, camera, renderer;


/*//////////////Data_medium variables/////////////////*/
var frequencyArray;
var lowerHalfArray; 
var upperHalfArray;    
var overallAvg; 
var normaloveAvg;
var high_average;
var points;
var mycube;

var analyser;
var controls, guiControls, datGUI;
var rmapped = 0;
var color;
var direction = 1;
var count = 0;
var dir = true;
var lastData;
var FishQuantity = 8;
var fishGroup;
var fishFrequencyIndex = [0,2,6,12,46,93,136,325,512];
var fishFrequency = new Uint8Array(FishQuantity);


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
    lastData = new Uint8Array(analyser.frequencyBinCount);
    speed = document.getElementById('thespeedbar').value;
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });    
    renderer.setSize(window.innerWidth, window.innerHeight); 

    /*/////////////////////CAMERA/**/////////////////////////

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);   
    
    //camera.rotation.y += Math.PI/2;
    //camera.lookAt(scene.position);
    
    
    /*/////////////////////GEOMETRY AND MATERIALS/**/////////////////////////
    var icosahedronGeometry = new THREE.IcosahedronGeometry(20, 6);
    var lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0xff00ee,
        wireframe: false
    }); 

    var SphereGeometry = new THREE.SphereBufferGeometry(30, 10);
    var MeshMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity:0.7, transparent:true, wireframe: true} );
    
    cubeGeometry = new THREE.BoxGeometry(10, 10, 15);
    seedGeometry = new THREE.BoxGeometry(3, 3, 3);
    cubeMaterial = new THREE.MeshLambertMaterial({color:0xffffff});

    var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0x6AFF33,
        side: THREE.DoubleSide,
        wireframe: false
    });



    

    

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
    //faunaGroup.position.set(0,0,-50);
    
    for (var i=0; i< FishQuantity;i++){
        cube = new THREE.Object3D();
        //cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        //cube.castShadow = true;
        //cube.receiveShadow = true;
        cube.name = "box"+i;
        //cube.position.set(50,-60+20*i,0);
        fishGroup.add(cube);      
        //console.log(cube.name);  
        
    }
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, -100, 0);

    var planeVert = new THREE.Mesh(planeGeometry, planeMaterial);
    planeVert.rotation.set(0,  Math.PI, 0);
    plane.position.set(0, -80, 0);

    var x= 150;
    var y =-100;
    var z =-250;
    const color = THREE.MathUtils.randInt(0, 0xffffff);
    cubeMaterial2 = new THREE.MeshLambertMaterial({color:0xffffff});

    //cubeMaterial2= cubeMaterial.clone();
    cubeMaterial2.opacity= 0.5;
    cubeMaterial2.transparent= false;
    
    console.log("materialo",cubeMaterial2);

    for (var i=0; i< 500;i++){
        cube = new THREE.Mesh(seedGeometry, cubeMaterial2);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.name = "fauna"+i;
        cube.position.z = z;
        cube.material.color.setHex(THREE.MathUtils.randInt(0, 0xffffff));
        //r = 0;// =   0x008000;
        /*cube.material.color.g = 128;
        cube.material.color.b = 0;*/
        //console.log(cube.material.color);
        z += 25;       
        
      
        /*if ( z == 100){
            x -= 50;
            z = -250;
        }
        else if (x == -100){
            x = 100;
            y += 27;
            z = -200;
        } */    
        if ( z == 100){
            y += 30;
            z = -250;
            //cube.material.color.r += 50;
            // =   0x008000;
            console.log("color", cube.material.color);

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

    var dummy = new THREE.Mesh(SphereGeometry , MeshMaterial);
    dummy.position.set(300, 0,0);

    /*/////////////////////////LOADING Scene Objects ////////////*/

    const loader = new THREE.GLTFLoader();

    loader.load( 'colorfish1.glb', function ( gltf ) {

    for(var i=0; i< FishQuantity; i++){
        let copy = gltf.scene.clone();
        copy.scale.set(7,7,7); 
        copy.name ='actual_fish_group'+i;
        copy.children[0].name = "actual_fish_mesh"+i;
        copy.position.set(50,-60+20*i,0);
        copy.rotation.y+= Math.PI/2;
        

    //fishGroup.add( gltf.scene );
        //var box = fishGroup.getObjectByName('box'+i);
        fishGroup.getObjectByName('box'+i).add(copy);
      //  fishGroup.add( copy );        
    }

    }, undefined, function ( error ) {

    console.error( error );

    } );


   /* fishGroup.name = "fishGroup";     
    var second_fish = fishGroup.getObjectByName('actual_fish').clone();
    second_fish.name ="second_fish";
    fishGroup.add(second_fish);*/


   
    console.log(fishGroup.children[6]);

    /*fishGroup.traverse(function(child){         
            console.log("kl", child);
    });*/





    

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
    
    var spotlight4 = new THREE.SpotLight(0xffffff);
    spotlight4.position.set(-700,50,100);
    spotlight4.castShadow = true;
    spotlight4.rotation.x -=1.5;

    directionalLight = new THREE.DirectionalLight(0x0000ff);
    directionalLight.position.set(-3000,-50,50);
    directionalLight.intensity =0.4;

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x000000, 0.25 );
    
    const helper = new THREE.SpotLightHelper( spotLight, 0xffffff );
    const helper2 = new THREE.SpotLightHelper( spotlight2, 0xff0000 );
    const helper3 = new THREE.SpotLightHelper( spotlight3, 0x00ffff );
    const helper4 = new THREE.SpotLightHelper( spotlight4, 0x0000ff );


    /*////////////////////ADDING TO SCENE///////////////////**/
   /* fishArray.forEach(function(e){
        scene.add(fishArray[e]);
    }    );*/
    fishGroup.add(faunaGroup);
    centerGroup.add(fishGroup);
    scene.add(centerGroup);          
    //scene.add(plane);
    //scene.add(planeVert);
    //scene.add(faunaGroup);
    scene.add(ambientLight);    
    fishGroup.add(spotLight);
    fishGroup.add(spotlight2 );
    fishGroup.add(spotlight3 );
    fishGroup.add(spotlight4 );
    scene.add(dummy);
   /* fishGroup.add(helper);
    fishGroup.add(helper2);
    fishGroup.add(helper3);
    fishGroup.add(helper4);*/
   // scene.add( hemiLight );
    //scene.add(camera); 
    //scene.add(directionalLight);
    console.log("SE ACT132131313UALIZA");
    console.log("fjhsl");
    //initialRender();
    render3();
    document.getElementById('out').appendChild(renderer.domElement);
    //camera.position.set( fishGroup.position.x,fishGroup.position.y,fishGroup.position.z);
    

    function initialRender(){
        speed = document.getElementById('thespeedbar').value;
    
        audio.playbackRate = speed; 
        renderer.render(scene, camera);
    }

    function render3(){
    speed = document.getElementById('thespeedbar').value;
    
    //console.log("camera.pos", camera.position);
    
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
        
        //box.material.color.set(Math.floor(fishFrequency[i]), 0,overallAvg);
    }

    if(frequencyArray[0]>0){
        centerGroup.rotation.y -=0.01;//*audio.playbackRate;
        camera.rotation.y -=0.01;
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
       // box.material.color.set(0,168,frequencyArray[i]);
        //console.log("fsf");

        }else{
            box.visible = false;
        }
        
    }



    /*/////////////MOVER PLANOS///////////////////*/
    
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

    noise.seed(Math.random());
   // console.log(cube.geometry.attributes.position);//vertex

    const negativeWidth = -4;
    const positiveWidth = 4;
    const positiveHeight = 4;
    const negativeHeight = -4;

    /**console.log(getPoints(plane)[0]);
    console.log(getPoints(plane)[1]);
    console.log(getPoints(plane)[2]);
    console.log(getPoints(plane)[3]);
    console.log(getPoints(plane)[4]);*
    console.log(getPoints(plane)[5]);*/

    var points2 = getPoints(plane);

    /*if(overallAvg > 0 && count == 50){
        //updatePositions(plane,direction); 
       // updatePositions();
       
        //advance();

        //plane.geometry.attributes.position.needsUpdate = true;

        console.log(getPoints(plane)[0]);
        direction*=-1;
        count = 0;
    }
    count ++;*/

    var x = 0;
    var y = 0;
    var z = 0;




    


   function advance(){
    if(cube.position.x< 400 && dir){
        cube.position.x += frequencyArray[0];

    }else{
        if(cube.position.x >=-400 &&dir){
            cube.position.x -= frequencyArray[0];
            dir = false;
        }else{
            if(cube.position.x <=-400 &&  !dir){
               cube.position.x += frequencyArray[0]; 
               dir = true;
            }else{
                 cube.position.x -= frequencyArray[0];

            }
        }

    }
    }

   // plane.position.x+=0.1;

   /*////CHANGE LIGHTS ///////*/


   spotLight.intensity = lowerMax;
   spotlight2.intensity = upperMax;
   spotlight3.intensity = lowerMax;
  if(upperMax>250){
   spotlight4.intensity = upperMax;   
   }else{
    spotlight4.intensity = 0;
   }
   console.log("fjslfjintensity", spotLight.intensity );


   // console.log("df",lowerAvgFr) ;

    ambientLight.intensity = frequencyArray[0];
    var h = upperAvg;
    var s = 0.4;
    var l = 0.4;
    ambientLight.color.setHSL ( h, s, l );  

    renderer.render(scene, camera);
    window.requestAnimationFrame(render3);
    }  


    lastData = frequencyArray;


}


function updatePositions(mesh, direction) {

    const positions = mesh.geometry.attributes.position.array;

    let x, y, z, index;
    x = y = z = index = 0;
    x = 400;
    y = 405;
    count = 0;
    for ( let i = 441, l = 441*2 ; i < l; i ++ ) {

        positions[ index ++ ] = x;
        positions[ index ++ ] = y;
        //positions[ index ++ ] = z;
        if(count <20){
            x-=40;
            count ++;
        }else{
            x = 400;
            count = 0;
        }

        /*x += ( 0.5 )* 10;
        y += (0.5 )* 10;
        z += (  0.5 ) * 10;*/
        //console.log("ahihoho", x,y, z);

    }

}

function getPoints( mesh ) {

    let pointsArray = mesh.geometry.attributes.position.array;
    let itemSize = mesh.geometry.attributes.position.itemSize;

    let points = [];

    for (let i = 0; i < pointsArray.length; i += itemSize ) {

        points.push( new THREE.Vector3( pointsArray[i], pointsArray[i+1], pointsArray[i+2]));

    }

    return points;

}





function pointsChangeAttributesPosition( mesh, points ) {
    
    let positions = [];

    points.map( (item) => {

        positions.push( item.x);
        positions.push( item.y);
        positions.push( item.z);

    } )

    let arrayAttr = mesh.geometry.attributes.position.array;

    arrayAttr.map( (item, index) => { 

        mesh.geometry.attributes.position.array[index] = positions[index]

    })

}





































function play2(fftSize) {
    
    if (context == undefined) {
        analyser = setAudioContext();
    }else{
         analyser =  getAudioContext();

    }
    /*/////////////////////////VARIABLES//////////////////**/
    frequencyArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyArray);      
    var x = 0;
    var y = 0;
    var z = 0;

    var speed = document.getElementById('thespeedbar').value;

    var scene = new THREE.Scene();

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });    
    renderer.setSize(window.innerWidth, window.innerHeight); 
    /*/////////////////////CAMERA/**/////////////////////////
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);   
    camera.position.set(0,0,0);
    camera.lookAt(scene.position);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    /*/////////////////////GEOMETRY AND MATERIALS/**/////////////////////////
    var icosahedronGeometry = new THREE.IcosahedronGeometry(20, 6);
    var lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0xff00ee,
        wireframe: false
    });

    var icosahedronGeometry2 = new THREE.SphereGeometry(30, 10);
    var lambertMaterial2 = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity:0.7, transparent:true, wireframe: true} );
    
    /*///////////////////////////SETTING Scene Objects////////////*/
    var parent = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    parent.position.set(0, 0, 0);
    var  background= new THREE.Mesh(icosahedronGeometry2, lambertMaterial2);
    background.position.set(0, 0, -200);


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

    for(var i =0; i< 8; i++){
      cubeGeometry = new THREE.BoxGeometry(5, 5, 10);
      cubeMaterial = new THREE.MeshPhongMaterial({color:0xffff00});

      cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.castShadow = true;
      cube.receiveShadow = true;
      cube.name = "box2"+i;
      cube.position.set(-70,-60+i*20,+100);      
      console.log(cube.name);
      parent.add(cube);
      
    }
    scene.add(parent);

    /*///////////////LIGTHS///////////////*/
    color = 0xffffff;//0xff3300;
    ambientLight = new THREE.AmbientLight(color);
    scene.add(ambientLight); 

    ambientLight2 = new THREE.AmbientLight(0x000000);    
    scene.add(ambientLight2);  

    
    render2();

    document.getElementById('out').appendChild(renderer.domElement);
    function render2(){

    
    audio.playbackRate = speed;
    console.log("SPEED", speed,audio.playbackRate );
    analyser.getByteFrequencyData(frequencyArray);
    



    frequencyArray0 = frequencyArray.slice(0, 2);
    frequencyArray1 = frequencyArray.slice(2, 6);
    frequencyArray2 = frequencyArray.slice(6, 12);
    frequencyArray3 = frequencyArray.slice(12, 46);
    frequencyArray4 = frequencyArray.slice(46, 93);
    frequencyArray5 = frequencyArray.slice(93, 136);
    frequencyArray6 = frequencyArray.slice(136, 325);
    frequencyArray7 = frequencyArray.slice(325, 512);
    //console.log("jjfñljlña", frequencyArray0);

    box0 =parent.getObjectByName("box"+0);
    box0.position.z =-avg(frequencyArray0)*2;
    box1 =parent.getObjectByName("box"+1);
    box1.position.z =-avg(frequencyArray1)*2;
    box2 =parent.getObjectByName("box"+2);
    box2.position.z =-avg(frequencyArray2)*2;
    box3 =parent.getObjectByName("box"+3);
    box3.position.z =-avg(frequencyArray3)*2;
    box4 =parent.getObjectByName("box"+4);
    box4.position.z =-avg(frequencyArray4)*2;
    box5 =parent.getObjectByName("box"+5);
    box5.position.z =-avg(frequencyArray5)*2;
    box6 =parent.getObjectByName("box"+6);
    box6.position.z =-avg(frequencyArray6)*2;
    box7=parent.getObjectByName("box"+7);
    box7.position.z =-avg(frequencyArray7)*2;
    
    
    
    for(var i =0; i<8; i++){
        box=parent.getObjectByName("box2"+i);
        box.position.z =-frequencyArray[i]-frequencyArray[i+8];


    }    
    
    lowerHalfArray = frequencyArray.slice(0, (frequencyArray.length/2) - 1);
    upperHalfArray = frequencyArray.slice((frequencyArray.length/2) - 1, frequencyArray.length - 1);

    overallAvg = avg(frequencyArray);
    lowerMax = max(lowerHalfArray);
    lowerAvg = avg(lowerHalfArray);
    upperMax = max(upperHalfArray);
    upperAvg = avg(upperHalfArray);

    lowerMaxFr = lowerMax / lowerHalfArray.length;
    lowerAvgFr = lowerAvg / lowerHalfArray.length;
    upperMaxFr = upperMax / upperHalfArray.length;    
    upperAvgFr = upperAvg / upperHalfArray.length;

    var Avg = avg(frequencyArray);
    noise.seed(Math.random());
    parent.geometry.attributes.position.array.forEach(function(i){
    var noisy = noise.simplex3(i.x,i.y,i.z)*0.0002;
                        i.x+=noisy*Avg;
                        i.y+=noisy*Avg;
                        i.z+=noisy*Avg;
    });


    if(normaloveAvg>0){
        parent.rotation.y +=normaloveAvg/10;
        camera.rotation.y +=normaloveAvg/10;
    }
    var h = high_average;
    var s = 0.4;
    var l = 0.4;
    //ambientLight.color.setHSL ( h, s, l );
    /*if( lowerMaxFr< 0.25){
        ambientLight.intensity =0;
        spotLight.intensity = 0;
        spotlight2.intensity = 0;
        spotlight3.intensity = 0;
        spotlight4.intensity = 0;

    }  
    if( lowerMaxFr >0.3){
        ambientLight.intensity =1;
        spotLight.intensity =1;
        spotlight2.intensity = 1;
        spotlight3.intensity = 1;
        spotlight4.intensity = 1;

    }  */
    renderer.render(scene, camera);
    window.requestAnimationFrame(render2);
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



/*//////////////////////////////INICIO/////////////////*/




var vizInit = function (){    
  
  var audio = document.getElementById("audio"); 
  document.onload = function(e){
    audio.play();
    play(1024);
  }
}



window.onload = vizInit();
