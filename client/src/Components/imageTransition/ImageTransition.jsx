import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import ImageTransitionShader from '../../utils/ImageTransitionShader';

function ImageTransition({ images, onTransitionComplete}) {
    const meshRef = useRef();
    const { size, viewport, gl } = useThree();
    const textures = useTexture(images);
    const [clickSpeed, setClickSpeed] = useState(0);
    const [clickPosition, setClickPosition] = useState(0);
    const [bubbleCenter, setBubbleCenter] = useState([0.5, 0.5]);
    const [isClickTransition, setIsClickTransition] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(1);

    const material = useMemo(() => {
        return new ImageTransitionShader({
            uTime: { value: 0 },
            uProgress: { value: 0 },
            uTexture1: { value: null },
            uTexture2: { value: null },
            uPixels: { value: new THREE.Vector2(1, 1) },
            uUvRate1: { value: new THREE.Vector2(1, 1) },
            uAccel: { value: new THREE.Vector2(0.5, 2) },
            uBubbleCenter: { value: new THREE.Vector2(0.9, 0.0) },
            uIsClickTransition: { value: 0 },
            uAspectRatio: { value: 1 },
        });
    }, []);

    const handleClick = useCallback((event) => {
        event.stopPropagation();
        
        const canvas = gl.domElement;
        const rect = canvas.getBoundingClientRect();
        
        // Calcular la posición normalizada del clic
        const x = (event.clientX - rect.left) / rect.width;
        const y = 1 - ((event.clientY - rect.top) / rect.height);

        console.log('Click position:', x, y);  // Para depuración

        setBubbleCenter([x, y]);
        setClickPosition(0);
        setClickSpeed(0.02);
        setIsClickTransition(true);
        setNextIndex((currentIndex + 1) % textures.length);
    }, [currentIndex, textures.length, gl]);

    useEffect(() => {
        if (meshRef.current) {
            const material = meshRef.current.material;
            material.uniforms.uPixels.value = [size.width, size.height];
            material.uniforms.uBubbleCenter.value = bubbleCenter;
            material.uniforms.uAspectRatio.value = size.width / size.height;

            const imageAspect = textures[currentIndex].image.width / textures[currentIndex].image.height;
            const planeAspect = size.width / size.height;
            const uvRate1 = [1, 1];
            if (planeAspect > imageAspect) {
                uvRate1[0] = planeAspect / imageAspect;
            } else {
                uvRate1[1] = imageAspect / planeAspect;
            }
            material.uniforms.uUvRate1.value = uvRate1;
        }
    }, [size, bubbleCenter, textures, currentIndex]);

    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material;
            material.uniforms.uTime.value = state.clock.elapsedTime;

            if (isClickTransition) {
                setClickPosition((prevPosition) => {
                    let newPosition = prevPosition + clickSpeed;
                    if (newPosition >= 1) {
                        setIsClickTransition(false);
                        setCurrentIndex(nextIndex);
                        setNextIndex((nextIndex + 1) % textures.length);
                        onTransitionComplete(nextIndex);
                        // console.log('Transition completed:', { newIndex: nextIndex });
                        return 0;
                    }
                    return newPosition;
                });
                setClickSpeed((prevSpeed) => Math.max(prevSpeed * 0.95, 0.01));
            }

            material.uniforms.uTexture1.value = textures[currentIndex];
            material.uniforms.uTexture2.value = textures[nextIndex];
            material.uniforms.uProgress.value = isClickTransition ? clickPosition : 0;
            material.uniforms.uIsClickTransition.value = isClickTransition ? 1.0 : 0.0;
            material.uniforms.uBubbleCenter.value = bubbleCenter;

        }
    });

    return (
        <mesh ref={meshRef} onClick={handleClick}>
            <planeGeometry args={[viewport.width, viewport.height]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
}

export default ImageTransition;