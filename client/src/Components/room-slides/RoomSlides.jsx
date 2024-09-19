import * as THREE from 'three';
import { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload, Image as ImageImpl, ScrollControls, Scroll, useScroll } from '@react-three/drei';

function Image(props) {
  const ref = useRef();
  const group = useRef();
  const data = useScroll();
  useFrame((state, delta) => {
    group.current.position.z = THREE.MathUtils.damp(
      group.current.position.z,
      Math.max(0, data.delta * 50),
      4,
      delta
    );
    ref.current.material.grayscale = THREE.MathUtils.damp(
      ref.current.material.grayscale,
      Math.max(0, 1 - data.delta * 1000),
      4,
      delta
    );
  });
  return (
    <group ref={group}>
      <ImageImpl 
         ref={ref} 
         {...props}
         transparent
         alphaTest={0.5}
         deepWrite={false}
         toneMapped={false}
        />
    </group>
  );
}

function Page({ m = 0.2, urls, ...props }) {
  const { width } = useThree((state) => state.viewport);
  const w = width < 10 ? 1.5 / 3 : 1 / 3;
  return (
    <group {...props}>
      {urls.map((url, index) => (
        <Image
          key={index}
          position={[(-1 + index) * width * w, 0, index - 1]}
          scale={[width * w - m * 2, 5, 1]}
          url={url}
        />
      ))}
    </group>
  );
}

function Pages({ images }) {
  const { width } = useThree((state) => state.viewport);
  return (
    <>
      {images.map((urls, index) => (
        <Page
          key={index}
          position={[width * (index - 1), 0, 0]}
          urls={urls}
        />
      ))}
    </>
  );
}

function RoomSlides({ images }) {
  return (
    <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} >
      
      <Suspense fallback={null}>
          <ScrollControls infinite horizontal damping={2} pages={images.length} distance={1}>
            <Scroll>
              <Pages images={images}  />
                <Scroll html>
                 <div className='text'>
                   <h1 style={{ position: 'absolute', top: '70vh', left: '-75vw', fontSize: '15rem' }}>place</h1>
                   <h1 style={{ position: 'absolute', top: '70vh', left: '25vw', fontSize: '15rem' }}>to</h1>
                   <h1 style={{ position: 'absolute', top: '70vh', left: '125vw', fontSize: '15rem' }}>be</h1>
                   <h1 style={{ position: 'absolute', top: '20vh', left: '165vw', fontSize: '25rem' }}>home</h1>
                   <h1 style={{ position: 'absolute', top: '70vh', left: '325vw', fontSize: '15rem' }}>a</h1>
                   <h1 style={{ position: 'absolute', top: '70vh', left: '425vw', fontSize: '15rem' }}>place</h1>
                 </div>             
              </Scroll>
            </Scroll>
          </ScrollControls>
        <Preload />
      </Suspense>
    </Canvas>
  );
}

export default RoomSlides;
