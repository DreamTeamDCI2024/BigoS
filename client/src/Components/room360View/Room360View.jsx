import { useRef, useEffect } from 'react';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

function Room360Content({ imagePath, onBack }) {
  const { scene, camera } = useThree();
  const controlsRef = useRef();

  // Load the texture
  const texture = useLoader(TextureLoader, imagePath);

  useEffect(() => {
    // Create a sphere geometry
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    // Flip the geometry inside out
    geometry.scale(-1, 1, 1);

    // Create a material with the texture
    const material = new THREE.MeshBasicMaterial({ map: texture });

    // Create a mesh with the geometry and material
    const mesh = new THREE.Mesh(geometry, material);

    // Add the mesh to the scene
    scene.add(mesh);

    // Set initial camera position
    camera.position.set(0, 0, 0.1);

    return () => {
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
    };
  }, [scene, texture, camera]);

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.1}
        rotateSpeed={-0.5}
      />

      <Html position={[0, 0, -1]}>
        <button 
          onClick={onBack} 
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#ffffffaa',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Back
        </button>
      </Html>
    </>
  );
}

function Room360View({ imagePath, onBack }) {
  return (
    <Canvas >
      <Room360Content imagePath={imagePath} onBack={onBack} />
    </Canvas>
  );
}

export default Room360View;