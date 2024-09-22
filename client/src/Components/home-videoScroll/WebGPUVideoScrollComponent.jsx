import { useRef, useEffect, useState } from 'react';
import {  useScroll, useTransform } from 'framer-motion';

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
   var texCoord = FragCoord.xy / vec2f(800.0, 600.0);
   var texColor = textureSampleBaseClampToEdge(myTexture, mySampler, texCoord);
   
   // Multiplicar el color RGB por el canal alfa
   var finalColor = vec4f(texColor.rgb * texColor.a, texColor.a);
   return finalColor;
}`;

const WebGPUVideoComponent = ({ children, progress }) => {
  // Referencias a elementos del DOM
  const canvasRef = useRef(null); 
  const videoRef = useRef(null);  
  const containerRef = useRef(null);  

  const [device, setDevice] = useState(null);  
  const [error, setError] = useState(null);  
  const [useWebGPU, setUseWebGPU] = useState(true);  // if fallback or scroll-video
  const [needsUpdate, setNeedsUpdate] = useState(true);  // if need to update the render
  const [isScrollMode, setIsScrollMode] = useState(true);  // defaoul mode or consecutive
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);  // index of consecutive vide0
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [newScrollStarted, setNewScrollStarted] = useState(false);
  const [preloadedVideos, setPreloadedVideos] = useState({});

  const animationFrameId = useRef(null);  // store  the id of the requestAnimationFrame

  // Hook de Framer Motion for scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start', 'end'],
  });

  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const scrollVideoSrc = "/videos/videoHome.mp4"; 
  const consecutiveVideos = [  
    "/videos/videoHome.mp4",
  ];

  // start WebGPU
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

        // if(videoRef.current){
        //   const video = videoRef.current;
        //   const handleCanPlay = () => {
        //     if(video.readyState >= 2) {
        //       try {
        //         setNeedsUpdate(true);
        //       } catch (err) {
        //         console.error("Error preparing video for WebGPU:", err);
        //         setError(err.message);
        //         setUseWebGPU(false); 
        //       }
        //     }
        //   }
        // }
        
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

        if(!canvas || !video) {
          throw new Error ("Canvas or Video not found");
        }

        const render = () => {
          if (needsUpdate && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
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
            setNeedsUpdate(false);
          }

          animationFrameId.current = requestAnimationFrame(render);
        };

        const handleVideoMetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          setNeedsUpdate(true);
          render();
        };

        // video.addEventListener('canplay', handleCanPlay);

        return () => {
          video.removeEventListener('loadedmetadata', handleVideoMetadata);
          if (animationFrameId.current !== null) {
            cancelAnimationFrame(animationFrameId.current);
          }
        };

      } catch (err) {
        setError(err.message);
        setUseWebGPU(false);
        console.error("WebGPU initialization failed:", err);
      }
    };

    initWebGPU();

  }, []);

  useEffect(() => {
    if (isScrollMode) return; 
  
    let prevProgress = 0;
    
    const handleScroll = () => {
      const currentProgress = progress.get();
      if (reachedEnd && currentProgress < prevProgress) {
        setNewScrollStarted(true);
        setReachedEnd(false);
        setCurrentVideoIndex(0);  // Reiniciar el índice del video aquí
      }
      prevProgress = currentProgress;
    };
    
    const unsubscribe = progress.on('change', handleScroll);
    
    return () => unsubscribe();
  }, [isScrollMode, progress, reachedEnd]);


  // Efecto para manejar el cambio de modo y la reproducción de video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isScrollMode) {
      // Configuración para el modo scroll
      video.src = scrollVideoSrc;
      video.load();
      
      const updateVideoTime = () => {
        if (video.duration) {
          const currentProgress = scrollProgress.get();
          video.currentTime = currentProgress * video.duration;
          setNeedsUpdate(true);
        }
      };

      const unsubscribe = scrollProgress.on('change', updateVideoTime);
      return () => unsubscribe();

    } else {
      // Configuration for consecutive videos
      video.src = consecutiveVideos[currentVideoIndex];
      video.load();
      video.playbackRate = playbackSpeed;
      // video.play();

      const handleEnded = () => {
        if (currentVideoIndex < consecutiveVideos.length - 1) {
          setCurrentVideoIndex(prevIndex => prevIndex + 1);
        } else {
          setReachedEnd(true);
        }
      };
      const handlePlay = () => {
        if (newScrollStarted) {
          setCurrentVideoIndex(0);
          setNewScrollStarted(false);
        }
      };

      video.addEventListener('ended', handleEnded);
      video.addEventListener('play', handlePlay);
      
      video.play().catch(error => console.error("Error playing video:", error));

      return () => {
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('play', handlePlay);
      };
    }
  }, [isScrollMode, scrollProgress, currentVideoIndex, playbackSpeed, newScrollStarted]);
  

  // to switch modes
  const toggleMode = () => {
    setIsScrollMode(!isScrollMode);
    setCurrentVideoIndex(0);
    setNeedsUpdate(true);
  };
  // const changeSpeed = (speed) => {
  //   setPlaybackSpeed(speed);
  //   if (videoRef.current && !isScrollMode) {
  //     videoRef.current.playbackRate = speed;
  //   }
  // };

  // Rendering the component
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
          // Render when is  WebGPU
          <>
            <video
              ref={videoRef}
              style={{ display: 'none' }}
              muted
              playsInline
              loop={!isScrollMode}
            />
            <canvas 
              ref={canvasRef} 
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'cover'
              }}
            />
          </>
        ) : (
          // Fallback when is not WebGPU
          <video
            ref={videoRef}
            src={isScrollMode ? scrollVideoSrc : consecutiveVideos[currentVideoIndex]}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            muted
            playsInline
            // loop={isScrollMode}
          />
        )}
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
      {/* <div style={{ position: 'fixed', top: 880, right: 40, zIndex: 2, color: 'white' }}>
        <button onClick={() => changeSpeed(0.5)}>0.5x</button>
        <button onClick={() => changeSpeed(1)}>1x</button>
        <button onClick={() => changeSpeed(2)}>2x</button>
      </div> */}
      <button 
        onClick={toggleMode} 
        style={{ position: 'fixed', top: 150, right: 40, zIndex: 2, color: 'white' }}
      >
        {isScrollMode ? "fallback" : "Scroll"}
      </button>
    </div>
  );
};

export default WebGPUVideoComponent;