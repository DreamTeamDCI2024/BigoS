import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const vertexShader = `
@vertex
fn main(@builtin(vertex_index) VertexIndex : u32) -> @builtin(position) vec4f {
  var pos = array<vec2f, 6>(
    vec2f( 1.0,  1.0),
    vec2f( 1.0, -1.0),
    vec2f(-1.0, -1.0),
    vec2f( 1.0,  1.0),
    vec2f(-1.0, -1.0),
    vec2f(-1.0,  1.0)
  );
  return vec4f(pos[VertexIndex], 0.0, 1.0);
}`;

const fragmentShader = `
@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var myTexture: texture_external;

@fragment
fn main(@builtin(position) FragCoord: vec4f) -> @location(0) vec4f {
  var texColor = textureSampleBaseClampToEdge(myTexture, mySampler, FragCoord.xy / vec2f(800.0, 600.0));
  texColor = vec4f(texColor.rgb * texColor.a, texColor.a);
  return texColor;
}`;

const WebGPUVideoScrollComponent = ({ children }) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [device, setDevice] = useState(null);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState('');
  const [useWebGPU, setUseWebGPU] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start', 'end'],
  });

  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const initWebGPU = async () => {
      try {
        if (!navigator.gpu) {
          throw new Error("WebGPU not supported");
        }

        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
          throw new Error("Couldn't request WebGPU adapter");
        }

        const device = await adapter.requestDevice();
        setDevice(device);
        setDebug(prev => prev + "WebGPU device initialized.\n");
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('webgpu');
        const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

        context.configure({
          device,
          format: presentationFormat,
          alphaMode: 'premultiplied',
        });

        const pipeline = device.createRenderPipeline({
          layout: 'auto',
          vertex: {
            module: device.createShaderModule({ code: vertexShader }),
            entryPoint: 'main',
          },
          fragment: {
            module: device.createShaderModule({ code: fragmentShader }),
            entryPoint: 'main',
            targets: [{
                format: presentationFormat,
                blend: {
                  color: {
                    srcFactor: 'src-alpha',
                    dstFactor: 'one-minus-src-alpha',
                    operation: 'add',
                  },
                  alpha: {
                    srcFactor: 'one',
                    dstFactor: 'one-minus-src-alpha',
                    operation: 'add',
                  },
                },
              }],
          },
          primitive: {
            topology: 'triangle-list',
          },
        });

        const sampler = device.createSampler({
          magFilter: 'linear',
          minFilter: 'linear',
        });

        const video = videoRef.current;
        let textureSource;

        const render = () => {
          if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            textureSource = device.importExternalTexture({ source: video });

            const bindGroup = device.createBindGroup({
              layout: pipeline.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: sampler },
                { binding: 1, resource: textureSource },
              ],
            });

            const commandEncoder = device.createCommandEncoder();
            const textureView = context.getCurrentTexture().createView();

            const renderPass = commandEncoder.beginRenderPass({
              colorAttachments: [{
                view: textureView,
                clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
                loadOp: 'clear',
                storeOp: 'store',
              }],
            });

            renderPass.setPipeline(pipeline);
            renderPass.setBindGroup(0, bindGroup);
            renderPass.draw(6);
            renderPass.end();

            device.queue.submit([commandEncoder.finish()]);
            setDebug(prev => prev + "Frame rendered.\n");
          }

          requestAnimationFrame(render);
        };

        video.addEventListener('loadedmetadata', () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
         // setDebug(prev => prev + `Video metadata loaded. Size: ${video.videoWidth}x${video.videoHeight}\n`);
          render();
        });

      } catch (err) {
        setError(err.message);
        setUseWebGPU(false);
        console.error("WebGPU initialization failed:", err);
      }
    };

    initWebGPU();
  }, []);

  useEffect(() => {
    const updateVideoTime = () => {
      if (videoRef.current && videoRef.current.duration) {
        const currentProgress = scrollProgress.get();
        videoRef.current.currentTime = currentProgress * videoRef.current.duration;
       // setDebug(prev => prev + `Video time updated: ${videoRef.current.currentTime}\n`);
      }
    };

    const unsubscribe = scrollProgress.on( 'change', updateVideoTime);
    return () => unsubscribe();
  }, [scrollProgress]);

  return (
    <div ref={containerRef} style={{position: 'relative', height: '600vh' }}>
      <div style={{ 
        position: 'fixed',
        top: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: 'white',
        zIndex: 0
       }}>
        {useWebGPU ? (
          <canvas 
            ref={canvasRef} 
            style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover'

         }}
        />
        ) : (
          <video
            ref={videoRef}
           src="/videos/BigOs.mp4"
            //src="/videos/slide.webm"
            style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
            muted
            playsInline
            loop
          />
        )}
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
      {error }
      {/* <div style={{ position: 'fixed', bottom: 10, left: 10, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '5px' }}>
        Scroll Progress: {Math.round(scrollProgress.get() * 100)}%
      </div> */}
      {/* <pre style={{ position: 'fixed', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '5px', maxHeight: '80vh', overflow: 'auto' }}>
        {debug}
      </pre> */}
    </div>
  );
};

export default WebGPUVideoScrollComponent;