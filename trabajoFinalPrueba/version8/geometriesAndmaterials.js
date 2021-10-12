var TorusGeometry = new THREE.TorusGeometry(1200, 600, 100,100); 
var cubeGeometry = new THREE.BoxGeometry(10, 10, 15);
var seedGeometry = new THREE.IcosahedronGeometry(3.0);
var SphereGeometry = new THREE.SphereBufferGeometry(100, 50);



var lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0xff0000,
        wireframe: false
}); 
var MeshMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity:0.7, transparent:true, wireframe: true} );    



function createDataTexture(frequencyArray, musicAvg){
const width = 512;
const height = 512;
const size = width * height;
const data = new Uint8Array( 3 * size );
var frequencyClone = frequencyArray;
var j = 0.0;

for ( let i = 0; i < size; i ++ ) {
    const stride = i * 3;
    data[ stride ] = frequencyClone[i%256];
    data[ stride + 1 ] = j;
    data[ stride + 2 ] = 0.0;
    if(j <100.0){
        j++;
    }else{
        j=0.0;
    }
}
const texture = new THREE.DataTexture( data, width, height, THREE.RGBFormat );
return texture;
}

function createCubeMaterial(color, texture){
    var cubeMaterial= new THREE.MeshLambertMaterial({color:color}); 
    cubeMaterial.opacity= 1;
    cubeMaterial.blending = THREE.AdditiveBlending;
    cubeMaterial.transparent= true;
    cubeMaterial.map = texture;
    return cubeMaterial;

}