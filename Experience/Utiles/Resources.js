import * as THREE from "three";
import {EventEmitter} from 'events';
import Experience from "../Experience";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";

export default class Resources extends EventEmitter{
    constructor(assets) {
        super();
        this.experience = new Experience();
        this.renderer = this.experience.renderer;

        this.assets = assets;

        this.items = {};
        this.queue = this.assets.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    setLoaders(){
        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.dracoLoader = new DRACOLoader();
        this.loaders.dracoLoader.setDecoderPath('/draco/');
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
    }

    startLoading(){
        for(const asset of this.assets){
            if(asset.type === "glbModel"){
                this.loaders.gltfLoader.load(asset.path,(file)=>{
                    this.singleAssetsLoade(asset,file);
                })
            }else if(asset.type === "videoTexture"){
                this.video = {};
                this.videoTexure = {};

                this.video[asset.name] = document.createElement("video");
                this.video[asset.name].src = asset.path;
                this.video[asset.name].muted = true;
                this.video[asset.name].loop = true;
                this.video[asset.name].play();

                this.videoTexure[asset.name] = new THREE.VideoTexture(
                    this.video[asset.name]
                );
                this.videoTexure[asset.name].flipY = true;
                this.videoTexure[asset.name].minFilter = THREE.NearestFilter;
                this.videoTexure[asset.name].magFilter = THREE.NearestFilter;
                this.videoTexure[asset.name].generateMipmaps = false;
                this.videoTexure[asset.name].encoding = THREE.sRGBEncoding;

                this.singleAssetsLoade(asset,this.videoTexure[asset.name]);
            }
        }
    }

    singleAssetsLoade(asset,file){
        this.items[asset.name] = file;
        this.loaded++;

        if(this.loaded === this.queue){
            console.log("all asset is loading");
            this.emit("ready");
        }
    }
}