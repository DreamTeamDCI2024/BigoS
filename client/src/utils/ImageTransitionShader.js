import { extend } from '@react-three/fiber';
import * as THREE from 'three';

class ImageTransitionShader extends THREE.ShaderMaterial{
    constructor(){
      super({
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uTexture1: { value: null },
          uTexture2: { value: null },
          uPixels: { value: new THREE.Vector2(1, 1) },
          uUvRate1: { value: new THREE.Vector2(1, 1) },
          uAccel: { value: new THREE.Vector2(0.5, 2) },
          uIsClickTransition: { value: 0.0 },
          uBubbleCenter: { value: new THREE.Vector2(0.9, 0.0) },
          uAspectRatio: {value: 1},
          uCircle: { value: new THREE.Vector4(0.9, 0.5, 0.03, 0.5)},
        },

        vertexShader:`
        uniform float uTime;
        varying vec2 vUv;
        varying vec2 vUv1;
        varying vec4 vPosition;
        uniform vec2 uUvRate1;
        
      void main() {
          vUv = uv;
          vec2 _uv = uv - 0.5;
          vUv1 = _uv;
          vUv1 *= uUvRate1;
          vUv1 += 0.5;
          
          vPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * vPosition;
      }`,

        fragmentShader:`
          uniform float uTime;
          uniform float uProgress;
          uniform sampler2D uTexture1;
          uniform sampler2D uTexture2;
          uniform vec2 uPixels;
          uniform vec2 uAccel;
          uniform float uIsClickTransition;
          uniform vec2 uBubbleCenter;
          uniform float uAspectRatio;
          uniform vec4 uCircle;
          
          varying vec2 vUv;
          varying vec2 vUv1;
          varying vec4 vPosition;
          
          vec2 mirrored(vec2 v) {
               vec2 m = mod(v, 2.0);
               return mix(m, 2.0 - m, step(1.0, m));
         }

         float tri(float p) {
               return mix(p, 1.0 - p, step(0.5, p)) * 2.0;
         }

    void main() {
        vec2 uv = gl_FragCoord.xy / uPixels.xy;
        float p = fract(uProgress);
      
        vec4 texture1 = texture2D(uTexture1, vUv);
        vec4 texture2 = texture2D(uTexture2, vUv);
      
        vec4 finalColor;
        
      // Bubble effect for click transition

      if(uIsClickTransition > 0.5){
        
        vec2 center = uBubbleCenter;
        float dist = distance(vUv, center);
        float radius = p * 1.4;
        float edgeSmoothing = 0.2;
        float delayValue = smoothstep(radius - edgeSmoothing, radius, dist);
        delayValue = 1.0 - clamp(delayValue, 0.0, 1.0);
    
        vec2 direction = normalize(vUv - center);
        vec2 bubbleOffset = direction * (1.0 - delayValue) * 0.05;
        vec2 w = sin(sin(uTime) * vec2(0.1, 0.3) + vUv * vec2(0.1, 0.8)) * vec2(0.08, 0.08);
        vec2 xy = w * (tri(p) * 0.5 + tri(delayValue) * 0.5) / 2.0;
    
        vec2 uv1 = vUv + bubbleOffset + xy;
        vec2 uv2 = vUv - bubbleOffset + xy;
    
        vec4 rgba1 = texture2D(uTexture1, mirrored(uv1));
        vec4 rgba2 = texture2D(uTexture2, mirrored(uv2));
    
        finalColor = mix(rgba1, rgba2, delayValue);
      } else {
        // Scroll transition
        // float delayValue = p * 7.0 - uv.y * 2.0 + uv.x - 2.0;
        // delayValue = clamp(delayValue, 0.0, 1.0);
    
        // vec2 translateValue = vec2(uProgress) + delayValue * uAccel;
        // vec2 translateValue1 = vec2(-0.5, 1.0) * translateValue;
        // vec2 translateValue2 = vec2(-0.5, 1.0) * (translateValue - 1.0 - uAccel);
        
        // vec2 w = sin(sin(uTime) * vec2(0.7, 0.9) + vUv * vec2(0.0, 4.0)) * vec2(0.3, 0.7);
        // vec2 xy = w * (tri(p) * 0.5 + tri(delayValue) * 0.5);
        
        // vec2 uv1 = vUv1 + translateValue1 + xy;
        // vec2 uv2 = vUv1 + translateValue2 + xy;
        
        // vec4 rgba1 = texture2D(uTexture1, mirrored(uv1));
        // vec4 rgba2 = texture2D(uTexture2, mirrored(uv2));
        
        // finalColor = mix(rgba1, rgba2, delayValue);
           finalColor = texture1;
      }

         // Circle drawing
         vec2 circleCenter = uCircle.xy;
         float circleRadius = uCircle.z;
         float circleOpacity = uCircle.w;
       
         vec2 adjustedUV = vUv;
         adjustedUV.x = (adjustedUV.x - 0.5) * uAspectRatio + 0.5;
         circleCenter.x = (circleCenter.x - 0.5) * uAspectRatio + 0.5;
         float dist = distance(adjustedUV, circleCenter);
         float outerRadius = circleRadius + 0.003; 
         float innerRadius = circleRadius - 0.003;
         float edgeWidth = 0.002;
         float edgeSmoothness = 0.0005;
         float fillMask = 1.0 - smoothstep(circleRadius - edgeSmoothness, circleRadius, dist);
         float borderMask = smoothstep(innerRadius, innerRadius + edgeWidth, dist) * (1.0 - smoothstep(outerRadius - edgeWidth, outerRadius, dist));
         vec3 borderColor = vec3(1.0, 1.0, 1.0);
         vec3 fillColor = vec3(0.8, 0.8, 0.8);

         //  circle over the transition effect
         finalColor.rgb = mix(finalColor.rgb, borderColor, borderMask * circleOpacity);
         finalColor.rgb = mix(finalColor.rgb, fillColor, fillMask * circleOpacity);
       
         gl_FragColor = finalColor;
      }`
   })
 } 
}
extend({ ImageTransitionShader });
export default ImageTransitionShader;