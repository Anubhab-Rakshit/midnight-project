import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const VS = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FS = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D u_image;
  uniform float u_hover;
  uniform float u_time;

  // Simple noise for displacement
  float random (in vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  float noise (in vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
      vec2 p = vUv;
      
      // Calculate displacement based on noise and hover state
      float n = noise(p * 10.0 + u_time * 0.5);
      vec2 displacement = vec2(n, noise(p * 10.0 - u_time * 0.5)) * 0.1 * u_hover;
      
      // Sample the image with displacement
      vec4 texColor = texture2D(u_image, p + displacement);
      
      // Add a slight chromatic aberration / color tint based on hover
      float r = texture2D(u_image, p + displacement * 1.5).r;
      float b = texture2D(u_image, p + displacement * 0.5).b;
      
      vec3 finalColor = mix(texColor.rgb, vec3(r, texColor.g, b), u_hover);
      
      // Make it slightly darker when not fully hovered
      finalColor *= mix(0.3, 1.0, u_hover);

      gl_FragColor = vec4(finalColor, texColor.a * u_hover);
  }
`;

interface LiquidImageProps {
  src: string;
}

export const LiquidImage: React.FC<LiquidImageProps> = ({ src }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Use framer-motion spring for smooth uniform interpolation
  const hoverSpring = useSpring(0, { damping: 20, stiffness: 100 });

  useEffect(() => {
    hoverSpring.set(isHovered ? 1 : 0);
  }, [isHovered, hoverSpring]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Compile Shaders
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
      return shader;
    };

    const vertexShader = compileShader(VS, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(FS, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Geometry
    const positions = new Float32Array([
      -1.0, -1.0,  1.0, -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0, -1.0,  1.0,  1.0
    ]);
    const uvs = new Float32Array([
      0.0, 1.0,  1.0, 1.0,  0.0, 0.0,
      0.0, 0.0,  1.0, 1.0,  1.0, 0.0
    ]);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    const uvLoc = gl.getAttribLocation(program, "uv");
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

    // Texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Initial 1x1 black pixel until image loads
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    };
    img.src = src;

    // Uniforms
    const uHover = gl.getUniformLocation(program, "u_hover");
    const uTime = gl.getUniformLocation(program, "u_time");

    let animationFrame: number;
    const startTime = performance.now();

    const render = () => {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(uTime, (performance.now() - startTime) * 0.001);
      gl.uniform1f(uHover, hoverSpring.get());

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrame = requestAnimationFrame(render);
    };
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [src, hoverSpring]);

  return (
    <div 
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} width={800} height={600} />
      
      {!isHovered && (
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-muted)' }}
        >
          HOVER TO DECRYPT
        </motion.div>
      )}
    </div>
  );
};
