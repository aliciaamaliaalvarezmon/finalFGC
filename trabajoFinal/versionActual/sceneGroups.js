function setBubbleGroup(bubbleGroup){

    const texture = new THREE.TextureLoader().load( 'textures/particle_texture.jpeg' );      

    cubeMaterial2 = createCubeMaterial(0xffff55, texture);
    cubeMaterial3= createCubeMaterial(0x00ff00, texture);
    cubeMaterial4= createCubeMaterial(0x2e8b57, texture);   

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
        cube.name = "bubble"+i;
        
        cube.position.z = z;
        cube.position.y = y;
        cube.position.x = x;  
        
        z += 25;   

        if ( z == 100){
            y += 30;
            z = -250;
            colorvar += 1;
        }
        else if (y >= 90){
            y = -100;
            x -= 50;
            z = -250;            
        }  

        console.log("bubblepos", x, y, z);   


        cube.visible = false;   
        bubbleGroup.add(cube);      
        
        
    }
}



function setFishGroup(fishGroup){

    for (var i=0; i< FishQuantity;i++){
        cube = new THREE.Object3D();
        cube.name = "fish_container"+i;
        fishGroup.add(cube);              
    }

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
        fishGroup.getObjectByName('fish_container'+i).add(copy);      
    }
    }, undefined, function ( error ) {
    console.error( error );
    } );  
}