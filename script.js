
import * as THREE from './fuckthisshit/three.module.js';

import { OBJLoader } from './fuckthisshit/OBJLoader.js';
import { MTLLoader } from './fuckthisshit/MTLLoader.js';
import { FlakesTexture } from './fuckthisshit/FlakesTexture.js';
import { RGBELoader } from './fuckthisshit/RGBELoader.js';
import { OrbitControls } from './fuckthisshit/OrbitControls.js';
import { ObjectControls } from './fuckthisshit/ObjectControls.js';

import { RenderPass } from "./fuckthisshit/postprocessing/RenderPass.js";
import { EffectComposer } from "./fuckthisshit/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "./fuckthisshit/postprocessing/UnrealBloomPass.js";


//SCENE/RENDERER/////////////////////////////////////

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
camera.position.x = 0;
camera.position.y = 5;


var renderer = new THREE.WebGLRenderer( { alpha: false } );
scene.background = null;
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
// ACESFilmic Linear Reinhard
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 0.8;

document.body.appendChild( renderer.domElement );

//CONTROLS/////////////////////////////////////


var controls = new OrbitControls( camera, renderer.domElement );
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
controls.enableDamping = true;
controls.dampingFactor = 0.8;
controls.enableZoom = false;






//OBJECTLOADER/////////////////////////////////////

let envmaploader = new THREE.PMREMGenerator(renderer);

new RGBELoader().setPath('/textures/').load('pouet.hdr', function(hdrmap) {

          let envmap = envmaploader.fromCubemap(hdrmap);
          
          let texture = new THREE.CanvasTexture(new FlakesTexture());
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.x = 10;
          texture.repeat.y = 6;
          
          

          const ballMaterial = {
            clearcoat: 1,
            cleacoatRoughness:1,
            metalness: 0.8,
            roughness:0,
            color: 0x242526,
            normalMap: texture,
            normalScale: new THREE.Vector2(0.1,0.1),
            envMap: envmap.texture
          };

          let ballMat = new THREE.MeshPhysicalMaterial(ballMaterial);


          var mtlLoader = new MTLLoader();
            mtlLoader.setPath('/obj/');
            mtlLoader.load('centiped.mtl', function (materials) {

            materials.preload();

            
        
            let objLoader = new OBJLoader();
                objLoader.setPath('/obj/');
                objLoader.load('centiped.obj', 


                function( obj ){
                    obj.traverse( function( child ) {
                    
                if  ( child instanceof THREE.Mesh ) {
                     child.material = ballMat;
                     
                    }
                    });

 ///           var controls2 = new ObjectControls( camera, renderer.domElement );
 ///           controls2.setObjectToMove(obj); // changes the object to interact with
 ///           controls2.setRotationSpeed(0.05);

                scene.add( obj );
            });

          });

});

//LIGHTS/////////////////////////////////////

let light1 = new THREE.PointLight(0x7B68EE, );
        light1.position.set(0,300,500);
        scene.add(light1);

let light2 = new THREE.PointLight(0x7B68EE, );
        light2.position.set(500,100,0);
        scene.add(light2);

let light3 = new THREE.PointLight(0x7B68EE, );
        light3.position.set(0,100,-500);
        scene.add(light3);

let light4 = new THREE.PointLight(0x7B68EE, );
        light4.position.set(-500,300,0);
        scene.add(light4);

//POSTPROCESSING/////////////////////////////////////

let composer = new EffectComposer(renderer);

let renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

let bloom = new UnrealBloomPass();
    composer.addPass(bloom);
    bloom.renderToScreen = true;


//ANIMATE/////////////////////////////////////


let animate = function () {
    requestAnimationFrame( animate );
    controls.update();
    composer.render(scene, camera);
};  

animate();


