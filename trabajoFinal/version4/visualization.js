//initialise simplex noise instance
//var noise = new SimplexNoise();

// the main visualiser function
var file;
var fileLabel;
var context;
var visualizationScene;

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
        play(1024);
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

    return analyser;
}

//asumimos window global


function getAudioContext(){
      
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser(); 
    src.connect(analyser);
    analyser.connect(context.destination); 
    //FFTSize Deberia ser una potencia de 2
    analyser.fftSize = 1024;//512
     //frequencyBinCount son la cantidad de bins donde dividimos los rangos de frecuencia. Deberia ser la mitad de fftSize

    return analyser;
}




function play(fftSize) {
    var analyser;
    if (context == undefined) {
        var analyser = setAudioContext();
    }else{
        var analyser =  getAudioContext();

    }
    var bufferLength = analyser.frequencyBinCount;  
    console.log(bufferLength);
    //Aqui vamos a guardar los datos del analiser
    var dataArray = new Uint8Array(bufferLength);
    var visualBins = new Uint8Array(8);
    console.log("CONTEXT", context);



    //here comes the webgl
    var scene = new THREE.Scene();
    var group = new THREE.Group();
    var group2 = new THREE.Group();
    var group3 = new THREE.Group();
    group.position.set(0,0,0);
    group2.position.set(-80,0,0);
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);   
    camera.position.set(0,0,450);
    camera.lookAt(scene.position);
    //const controls = new OrbitControls(camera, renderer.domElement)
    scene.add(camera);

    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);
 //   const loader = new THREE.TextureLoader();
   // const bgTexture = loader.load('hokusai_painting.jpg');   
   // scene.background= bgTexture;

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight); 

    
    var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    var BasicMaterial = new THREE.MeshBasicMaterial({
        color: 0xff00ee,
        wireframe: true
    });
    var radius = 150;
    var fraction_angle= 0.703125;//360/512





    for (var i = 0; i < bufferLength; i++){
        console.log(bufferLength);
        var box = new THREE.Mesh(boxGeometry, BasicMaterial);
        if(i< bufferLength/2){ 
            box.position.set(1*radius*Math.sin(Math.PI/256*i), 1*radius*Math.cos(Math.PI/256*i), 0);
        }else{
            box.position.set(1*radius*Math.sin(Math.PI/256*i), 1*radius*Math.cos(Math.PI/256*i), 0);

        }
        //box.position.set(Math.sin( i* 50), 50, Math.cos( i* 50));
        box.name = "box"+ i;
        //console.log(box.name);
        group.add(box);
        //box.position.set(0,50,0);
        //box.transform.applyEuler();
    }


    var distance = window.innerWidth / 12;
    var start = window.innerWidth/2;

    for (var i = 0; i < 9; i++){        
        var box = new THREE.Mesh(boxGeometry, BasicMaterial); 
        box.position.set(-start +distance+distance+distance+ distance*(i), 50, 0);
        box.scale.set(10,10,1);
        //box.position.set(Math.sin( i* 50), 50, Math.cos( i* 50));
        box.name = "box"+ i;
        console.log(box.name);
        group2.add(box);       
        //box.position.set(0,50,0);
        //box.transform.applyEuler();
    }



    for(var i = 0; i < 9; i++){ 
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.intensity = 0.9;
        spotLight.position.set(-start + distance*i, 40, 20);
        //spotLight.lookAt(ball);
        spotLight.castShadow = true;
        group3.add(spotLight);
    }

    //var box1 = group.getChildByName("box1");

   // group.add(visualBins);
    //box.position.set(0, 20, 0);
    //group.add(box);  
    var icosahedronGeometry = new THREE.IcosahedronGeometry(20, 6);
    var lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0xff00ee,
        wireframe: false
    });
    var ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    ball.position.set(0, 0, 0);
    scene.add(ball);
    scene.add(group);
    //scene.add(group2);
    //scene.add(group3);
    //console.log(group);
    /*nst loader = new GLTFLoader();

    loader.load( 'path/to/model.glb', function ( gltf ) {

    scene.add( gltf.scene );

    }, undefined, function ( error ) {

    console.error( error );

    } );*/




    //document.getElementById('out').appendChild(renderer.domElement);

    //window.addEventListener('resize', onWindowResize, false);    
    var dataSeparation = new Uint8Array(9);
    var bandBuffer = new Uint8Array(9);
    var band_Decrease = 0.005;
    render();

    document.getElementById('out').appendChild(renderer.domElement);
    //document.addEventListener('')
    
    function render(){
       // scene.background= bgTexture;
        
        
        var speed = document.getElementById('thespeedbar').value;
        audio.playbackRate = speed;
        console.log("SPEED", speed,audio.playbackRate );
        analyser.getByteFrequencyData(dataArray);
        console.log(dataArray);

        scale512(dataArray, group, bufferLength);
        

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

      

       // set9Bands(dataSeparation, dataArray, bandBuffer, band_Decrease, lowerMaxFr,group2);       


        
        renderer.render(scene, camera);
        window.requestAnimationFrame(render);

    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
  };




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
/*
window.addEventListener("wheel", function(e) {
    var dir = Math.sign(e.deltaY);

    console.log(dir);
});*/


function scale512(dataArray,group, bufferLength){
    for(var i =0; i < bufferLength; i++ ){
        childbox= group.getObjectByName("box"+i);
        //console.log("child",childbox);
        childbox.scale.y =  dataArray[i];

    }     
}





function set9Bands(dataSeparation, dataArray, bandBuffer, band_Decrease,lowerMaxFr, group){
    let last = 0;
    for(var i=0; i<9; i++){            
        dataSeparation[i] = avg(dataArray.slice(last, (2**i)*2));          
        last = (2**i)*2;   
        console.log(last);          
    }
    //var maxIndVal = maxIndx(dataSeparation);
    //ball.position.set(10*i,0,0);
    for(var i =0; i < 9; i++ ){
        if( dataSeparation[i]> bandBuffer[i]){
            bandBuffer[i] = dataSeparation[i];
            band_Decrease[i] = 0.0005 ;
        }else{
            bandBuffer[i] = dataSeparation[i];
            band_Decrease[i] -= band_Decrease[i]; 
            band_Decrease[i]*= 1.2;
        }
        childbox= group.getObjectByName("box"+i);
        console.log(childbox.position.z)
        if(childbox.position.z > -70){
            childbox.translateZ(-lowerMaxFr);
        }else{
            childbox.translateZ(100);
        }
        //childbox.translateZ(-lowerMaxFr);
        //console.log("child",childbox);
        //childbox.scale.y =  dataSeparation[i]+5;
        //childbox.intensity= bandBuffer[i];
        //childbox.scale.y =  bandBuffer[i]+5;

    }
}










function addThrees(scene){
    //tree geometry (two intersecting y-perpendicular triangles)
    var triangle = new THREE.Shape();
    triangle.moveTo(5, 0);
    triangle.lineTo(0, 12);
    triangle.lineTo(-5, 0);
    triangle.lineTo(5, 0);
    var tree_geometry1 = new THREE.ShapeGeometry(triangle);

    var matrix = new THREE.Matrix4();
    //console.log("MATRIZ", matrix );
    var tree_geometry2 = new THREE.ShapeGeometry(triangle);
    tree_geometry2.applyMatrix4(matrix.makeRotationY(Math.PI / 2));


    //tree material
    var basic_material = new THREE.MeshBasicMaterial({color: 0x14190f});
    basic_material.color = new THREE.Color(0x14190f);
    basic_material.side = THREE.DoubleSide;


    var xDistance = 50;
    var zDistance = 30;
    //initial offset so does not start in middle.
    var xOffset = -80;
    var tree_quantity= document.getElementById('treequantity').value;
    for(var i = 0; i < tree_quantity; i++){
        for(var j = 0; j < tree_quantity-1; j++){
            var forest_mesh1 = new THREE.Mesh(tree_geometry1, basic_material);
            forest_mesh1.position.x = (xDistance * i) + xOffset;
            forest_mesh1.position.z = (zDistance * j);
            scene.add(forest_mesh1);            
            var forest_mesh2 = new THREE.Mesh(tree_geometry2, basic_material);
            forest_mesh2.position.x = forest_mesh1.position.x
            forest_mesh2.position.z = forest_mesh1.position.z 
            forest_mesh2.position.y = forest_mesh1.position.y-10; 
            scene.add(forest_mesh2);
        }
    }

    //create mesh and add to scene
    //var forest_mesh = new THREE.Mesh(forest_geometry, basic_material);
    //var forest_mesh = new THREE.Mesh(tree_geometry1, basic_material);
    
    //var forest_mesh2 = new THREE.Mesh(tree_geometry2, basic_material);
    //console.log("for_pos", forest_mesh.position);    
    //scene.add(forest_mesh);
    //forest_mesh.position.set(0, 0, 70);
    //scene.add(forest_mesh2);
    //forest_mesh2.position.set(-50, -10, -50);
}

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

function createRings(bufferForRings, ringGroup){
    for(var i = 0; i < bufferForRings.length; i++){
        geometry = new THREE.RingGeometry(0, 1, 1, 1);
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
        const mesh = new THREE.Mesh( geometry, material );
        bufferForRings[i] = mesh;
        ringGroup.add(mesh);
    }

}



var vizInit = function (){    
  
  var audio = document.getElementById("audio"); 
  document.onload = function(e){
    audio.play();
    play(1024);
  }
}



window.onload = vizInit();
