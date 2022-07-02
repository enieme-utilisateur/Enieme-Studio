
import * as THREE from './fuckthisshit/three.module.js';

import { OBJLoader } from './fuckthisshit/OBJLoader.js';
import { MTLLoader } from './fuckthisshit/MTLLoader.js';
import { FlakesTexture } from './fuckthisshit/FlakesTexture.js';
import { RGBELoader } from './fuckthisshit/RGBELoader.js';
import { OrbitControls } from './fuckthisshit/OrbitControls.js';

var scene = new THREE.Scene(); 

var camera = new THREE.PerspectiveCamera( 5, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 200;

var renderer = new THREE.WebGLRenderer();
scene.background = null;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls = new OrbitControls( camera, renderer.domElement );
controls.autoRotate = true;
controls.autoRotateSpeed = 5;
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.enableZoom = true;

let envmaploader = new THREE.PMREMGenerator(renderer);

new RGBELoader().setPath('/textures/').load('blinds_1k.hdr', function(hdrmap) {

          let envmap = envmaploader.fromCubemap(hdrmap);
          let texture = new THREE.CanvasTexture(new FlakesTexture());
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.x = 10;
          texture.repeat.y = 6;

          const ballMaterial = {
            clearcoat: 0.2,
            cleacoatRoughness:0.7,
            metalness: 1,
            roughness:0.1,
            color: 0xDCDCDC,
            normalMap: texture,
            normalScale: new THREE.Vector2(0.2,0.2),
            envMap: envmap.texture
          };

          let ballMat = new THREE.MeshPhysicalMaterial(ballMaterial);


            var mtlLoader = new MTLLoader();
mtlLoader.setPath('/obj/');
mtlLoader.load('centiped.mtl', function (materials) {

    materials.preload();

    var objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('/obj/');
    objLoader.load('centiped.obj', function (object) {

        scene.add(object);
        object.position.y -= 1;

    });

});


});






//red
var keyLight = new THREE.PointLight(new THREE.Color('hsla(337, 100%, 57%, 1)'), 0.75);
keyLight.position.set(-100, 0, 100);

//turquoise
var fillLight = new THREE.PointLight(new THREE.Color('hsla(222, 96%, 53%, 1)'), 0.75);
fillLight.position.set(100, 0, 100);

//green
var fillLight3 = new THREE.PointLight(new THREE.Color('hsla(73, 100%, 50%, 1)'), 0.75);
fillLight.position.set(100, 200, -700);

//blue
var backLight = new THREE.PointLight(new THREE.Color('hsla(261, 77%, 55%, 1)'), 0.10);
backLight.position.set(100, -100, 0);


scene.add(backLight);






let animate = function () {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render(scene, camera);
};  

animate();

