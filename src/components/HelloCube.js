import React, { useState, useEffect } from 'react'
import * as THREE from 'three';


class Renderer {
    constructor (w, h) {
        this.w_         = w;
        this.h_         = h;
        this.renderer_  = undefined;

        this.createRenderer();
    }

    __destroy__ = () => {
        this.renderer_.dispose();
    }

    createRenderer = () => {
        this.renderer_  = new THREE.WebGLRenderer({ antialias: true });
        this.renderer_.onContextLost    = this.onContextLost;
        this.renderer_.onContextRestore = this.onContextRestore;

        this.setSize(this.w_, this.h_);
    }

    onContextLost = (event) => {
        event.preventDefault();
        this.renderer_.dispose();
    }

    onContextRestore = (event) => {
        this.createRenderer();
    }

    setSize = (size) => {
        this.w_ = size.x;
        this.h_ = size.y;

        this.renderer_.setSize(size.x, size.y);
        this.renderer_.setPixelRatio(window.devicePixelRatio);
    }

    setClearColor = (c) => {
        this.renderer_.setClearColor(c);
    }

    render = (scene, camera) => {
        this.renderer_?.render(scene, camera);
    }
}


class CubeScene {

    constructor (w, h) {
        this.w_ = w;
        this.h_ = h;

        this.scene_         = undefined;
        this.camera_        = undefined;
        this.cube_          = undefined;
        this.cubeMtl_       = undefined;
        this.cubeGeometry_  = undefined;
        this.light_         = undefined;

        this.createScene();
        this.createLights();
        this.createCube();

        this.scene_.add(this.cube_);
        this.cube_.position.set(0, 0, 0);

        this.scene_.add(this.light_);
        this.light_.position.set(0, 1.5, 2.0);

        this.camera_.position.z = 3.0;
    }

    __destroy__ = () => {
    }

    createScene = () => {
        this.scene_     = new THREE.Scene();
        this.camera_    = new THREE.PerspectiveCamera(75, this.w_/this.h_, 0.1, 1000);
    }

    onContextLost = (event) => {
        event.preventDefault();
    }

    onContextRestore = (event) => {
    }

    setSize = (size) => {
        this.w_ = size.x;
        this.h_ = size.y;
        this.camera_.aspect = size.x / size.y;
        this.camera_.updateProjectionMatrix();
    }

    createLights = () => {
        this.light_ = new THREE.PointLight(0xffffff, 1, 100);
    }

    createCube = () => {
        this.cubeGeometry_  = new THREE.BoxGeometry(1, 1, 1);
        this.cubeMtl_       = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        this.cube_          = new THREE.Mesh(this.cubeGeometry_, this.cubeMtl_);
    }

    animate = () => {
        this.cube_.rotation.x += 0.004;
        this.cube_.rotation.y += 0.0045;
    }
}



const HelloCube = () => {

    let surface = null;
    const [surfaceSize, setSurfaceSize] = useState({"x": 512, "y": 512});

    const sceneMgr  = new CubeScene(surfaceSize.x, surfaceSize.y);
    const renderMgr = new Renderer(surfaceSize.x, surfaceSize.y);


    const onWindowResize = () => {
        const size =
            {"x": window.innerWidth, "y": window.innerHeight};

        renderMgr.setSize(size);
        sceneMgr.setSize(size);
        setSurfaceSize(size);
    };

    const animate = () => {
        requestAnimationFrame(animate);
        sceneMgr.animate();
        renderMgr.render(sceneMgr.scene_, sceneMgr.camera_);
    };


    useEffect(() => {

        const size =
            {"x": window.innerWidth, "y": window.innerHeight};

        renderMgr.setSize(size);
        sceneMgr.setSize(size);

        renderMgr.setClearColor('#1a1a4a');

        if (surface.childNodes.length === 0)
            surface.appendChild(renderMgr.renderer_.domElement);

        onWindowResize();

        window.addEventListener('resize', onWindowResize, false);

        animate();

        return () => {
            window.removeEventListener('resize', onWindowResize, false);
        };
    }, [surface]);

  return (
    <div
        ref={(el) => (surface = el)}
        style={{ width: surfaceSize.x, height: surfaceSize.y }}
    />
  );
};

export default HelloCube;

