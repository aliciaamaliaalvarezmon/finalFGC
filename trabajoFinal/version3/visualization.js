//initialise simplex noise instance
//var noise = new SimplexNoise();

// the main visualiser function
var file;
var fileLabel;
var binSize = 512;
function LoadMusic (param){
    if ( param.files && param.files[0] ){
        //parami = param.files[0];
        //console.log("param", param.files);
        //console.log("param0", param.files[0]);
        fileLabel = document.querySelector("label.file");
        file = document.getElementById("thefile");
        //console.log("file", file );
        //console.log("thefile", fileLabel );
        fileLabel.classList.add('normal');
        audio.classList.add('active');
        //var files = this.files;
        var files = param.files;
        audio.src = URL.createObjectURL(files[0]);                
        audio.load();        
        audio.play();
        play(binSize);
    }
  }



var vizInit = function (){
  
  file = document.getElementById("thefile");
  var audio = document.getElementById("audio");
  fileLabel = document.querySelector("label.file");
  console.log("file", file, "audio", audio, "fileLabel", fileLabel);
  
  document.onload = function(e){
    //console.log(e);
    audio.play();
    play(binSize);
  }



}

window.onload = vizInit();



function play(fftSize) {

    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    var visualBins = new Uint8Array
    

    src.connect(analyser);
    analyser.connect(context.destination);
    //fftSize son la cantidad de bins donde dividimos los rangos de frecuencia. Deberia ser una potencia de 2
    analyser.fftSize = fftSize;//512
    var bufferLength = analyser.frequencyBinCount;
    //Aqui vamos a guardar los datos del analiser
    var dataArray = new Uint8Array(bufferLength);

    var visualBins = new Uint8Array(bufferLength);





    //here comes the webgl
    var scene = new THREE.Scene();
    var group = new THREE.Group();
    var ringGroup = new THREE.Group();

    createRings(visualBins, ringGroup);
    

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);    
    camera.position.set(0,0,100);
    camera.lookAt(scene.position);
    //const controls = new OrbitControls(camera, renderer.domElement)
    scene.add(camera);

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0x6904ce,
        side: THREE.DoubleSide,
        wireframe: true
    });
    
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 30, 0);
    group.add(plane);
    
    var plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
    plane2.rotation.x = -0.5 * Math.PI;
    plane2.position.set(0, -30, 0);
    group.add(plane2);

    var icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
    var icosahedronGeometrySmall = new THREE.IcosahedronGeometry(8, 2);
    var lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0xff00ee,
        wireframe: true
    });

    var ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    ball.position.set(0, 0, 0);
    group.add(ball);

   // var ball2 = new THREE.Mesh(icosahedronGeometrySmall, lambertMaterial);
  //  ball2.position.set(0, 0, 0);
   // group.add(ball2);

    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.intensity = 0.9;
    spotLight.position.set(-10, 40, 20);
    spotLight.lookAt(ball);
    spotLight.castShadow = true;
    scene.add(spotLight);
  
    scene.add(group);
    scene.add( ringGroup);

    document.getElementById('out').appendChild(renderer.domElement);

    //window.addEventListener('resize', onWindowResize, false);    
    render();

    function render() {
      
      var speed = document.getElementById('thespeedbar').value;
      audio.playbackRate = speed;
      console.log("SPEED", speed,audio.playbackRate );

      analyser.getByteFrequencyData(dataArray);
      console.log("fata", analyser);

      var lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
      var upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);
      //console.log("lowerfata", lowerHalfArray);
      //console.log("upperfata", upperHalfArray);

      var overallAvg = avg(dataArray);
      var lowerMax = max(lowerHalfArray);
      var lowerAvg = avg(lowerHalfArray);
      var upperMax = max(upperHalfArray);
      var upperAvg = avg(upperHalfArray);

      var lowerMaxFr = lowerMax / lowerHalfArray.length;
      var lowerAvgFr = lowerAvg / lowerHalfArray.length;
      var upperMaxFr = upperMax / upperHalfArray.length;
      var upperAvgFr = upperAvg / upperHalfArray.length; 

      ball.position.x = lowerMaxFr;
      ball.position.y = upperMaxFr;
      ball.position.z = overallAvg ;

      ball.position.x = lowerMaxFr;
      ball.position.y = upperMaxFr;
      ball.position.z = overallAvg ;

      //console.log("CAMERA POS", camera.position);
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
