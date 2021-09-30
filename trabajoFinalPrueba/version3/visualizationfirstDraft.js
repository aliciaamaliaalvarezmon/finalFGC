//initialise simplex noise instance
//var noise = new SimplexNoise();

// the main visualiser function
var file;
var fileLabel;
function LoadMusic (param){
    if ( param.files && param.files[0] ){
        //parami = param.files[0];
        console.log("param", param.files);
        console.log("param0", param.files[0]);
        fileLabel = document.querySelector("label.file");
        file = document.getElementById("thefile");
        console.log("file", file );
        console.log("thefile", fileLabel );
        fileLabel.classList.add('normal');
        audio.classList.add('active');
        //var files = this.files;
        var files = param.files;
        audio.src = URL.createObjectURL(files[0]);                
        audio.load();        
        audio.play();
        play();
    }
  }
/*
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
*/









var vizInit = function (){
  
  file = document.getElementById("thefile");
  var audio = document.getElementById("audio");
  fileLabel = document.querySelector("label.file");
  console.log("file", file, "audio", audio, "fileLabel", fileLabel);
  
  document.onload = function(e){
    console.log(e);
    audio.play();
    play();
  }



}

window.onload = vizInit();
//window.onclick = vizInit();
//document.body.addEventListener('touchend', function(ev) { context.resume(); });


function play() {

    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    

    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 512;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    //here comes the webgl
    var scene = new THREE.Scene();
    var group = new THREE.Group();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    camera.position.set(0,0,100);
    camera.lookAt(scene.position);
    scene.add(camera);



    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);


    var axes = new THREE.AxisHelper(0);
    scene.add(axes);

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
    var lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0xff00ee,
        wireframe: true
    });

    var ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    ball.position.set(0, 0, 0);
    group.add(ball);

    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.intensity = 0.9;
    spotLight.position.set(-10, 40, 20);
    spotLight.lookAt(ball);
    spotLight.castShadow = true;
    scene.add(spotLight);

    //var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    //orbitControls.autoRotate = true;
    
    scene.add(group);

    document.getElementById('out').appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    render();

    function render() {



      
      var speed = document.getElementById('thespeedbar').value;
      audio.playbackRate = speed;
      console.log("SPEED", speed,audio.playbackRate );

      analyser.getByteFrequencyData(dataArray);
      console.log("fata", analyser);

      var lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
      var upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);
      console.log("lowerfata", lowerHalfArray);
      console.log("upperfata", upperHalfArray);

      var overallAvg = avg(dataArray);
      var lowerMax = max(lowerHalfArray);
      var lowerAvg = avg(lowerHalfArray);
      var upperMax = max(upperHalfArray);
      var upperAvg = avg(upperHalfArray);

      var lowerMaxFr = lowerMax / lowerHalfArray.length;
      var lowerAvgFr = lowerAvg / lowerHalfArray.length;
      var upperMaxFr = upperMax / upperHalfArray.length;
      var upperAvgFr = upperAvg / upperHalfArray.length;

     // makeRoughGround(plane, modulate(upperAvgFr, 0, 1, 0.5, 4));
      //makeRoughGround(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));
      
      //makeRoughBall(ball, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));

      ball.position.x = lowerMaxFr;
      ball.position.y = upperMaxFr;
      ball.position.z = overallAvg ;

      //addTriangle(scene);

      

      console.log("CAMERA POS", camera.position);
      renderer.render(scene, camera);
      window.requestAnimationFrame(render);
    }



    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function makeRoughBall(mesh, bassFr, treFr) {
        mesh.geometry.vertices.forEach(function (vertex, i) {
            var offset = mesh.geometry.parameters.radius;
            var amp = 7;
            var time = window.performance.now();
            vertex.normalize();
            var rf = 0.00001;
           // var distance = (offset + bassFr ) + noise.noise3D(vertex.x + time *rf*7, vertex.y +  time*rf*8, vertex.z + time*rf*9) * amp * treFr;
            //vertex.multiplyScalar(distance);
            vertex.multiplyScalar(2);
        });
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeFaceNormals();
    }

    function makeRoughGround(mesh, distortionFr) {
        console.log("help",mesh.geometry.vertices);
        mesh.geometry.vertices.forEach(function (vertex, i) {

            var amp = 2;
            var time = Date.now();
          //  var distance = (noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) + 0) * distortionFr * amp;
            //vertex.z = distance;
            vertex.z = 2;
        });
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeFaceNormals();
    }

    audio.play();
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
    var tree_geometry2 = new THREE.ShapeGeometry(triangle);
    tree_geometry2.applyMatrix(matrix.makeRotationY(Math.PI / 2));


    //tree material
    var basic_material = new THREE.MeshBasicMaterial({color: 0x14190f});
    basic_material.color = new THREE.Color(0x14190f);
    basic_material.side = THREE.DoubleSide;


    //merge into giant geometry for max efficiency
    var forest_geometry = new THREE.BufferGeometry();;
    var dummy = new THREE.Mesh();
    for (var i = 0; i < 2; i++) 
    {
        dummy.position.x = Math.random() * 1000 - 500;
        dummy.position.z = Math.random() * 1000 - 500;
        dummy.position.y = 0;

        dummy.geometry = tree_geometry1;
        THREE.GeometryUtils.merge(forest_geometry, dummy);

        dummy.geometry = tree_geometry2;
        THREE.GeometryUtils.merge(forest_geometry, dummy);
    }


    //create mesh and add to scene
    var forest_mesh = new THREE.Mesh(forest_geometry, basic_material);
    scene.add(forest_mesh);
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