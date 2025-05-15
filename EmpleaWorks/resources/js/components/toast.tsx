import React, { useEffect, useRef, memo } from 'react';
import toast, { Toast as ToastType, Toaster as HotToaster } from 'react-hot-toast';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

type ToastProps = {
  t: ToastType;
  message: string;
  type: 'success' | 'error' | 'default';
};

// Enhanced Particle class for more sophisticated animations
class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  velocity: number;
  acceleration: number;
  maxSize: number;
  minSize: number;
  growthSpeed: number;
  growing: boolean;

  constructor(canvas: HTMLCanvasElement, colors: string[]) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.minSize = Math.random() * 1.5 + 0.3;
    this.maxSize = this.minSize + Math.random() * 2;
    this.size = this.minSize;
    this.growing = true;
    this.growthSpeed = Math.random() * 0.03 + 0.01;

    this.speedX = (Math.random() - 0.5) * 0.7;
    this.speedY = (Math.random() - 0.5) * 0.7;
    this.alpha = Math.random() * 0.6 + 0.2;
    this.velocity = Math.random() * 0.4 + 0.1;
    this.acceleration = Math.random() * 0.001 + 0.0001;

    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(canvas: HTMLCanvasElement) {
    if (this.growing) {
      this.size += this.growthSpeed;
      if (this.size >= this.maxSize) this.growing = false;
    } else {
      this.size -= this.growthSpeed;
      if (this.size <= this.minSize) this.growing = true;
    }

    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width + 10) this.x = -10;
    else if (this.x < -10) this.x = canvas.width + 10;

    if (this.y > canvas.height + 10) this.y = -10;
    else if (this.y < -10) this.y = canvas.height + 10;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    if (this.size > 1) {
      ctx.globalAlpha = this.alpha * 0.3;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.size * 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }
}

// Create completely separate toast components for each type
// This ensures no component will ever "switch" icons

const SuccessToast = memo(({ t, message }: Omit<ToastProps, 'type'>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const duration = t.duration ? t.duration / 1000 : 4;

  // Particle colors for success
  const particleColors = [
    'rgba(126, 34, 206, 0.6)',
    'rgba(147, 51, 234, 0.7)',
    'rgba(107, 33, 168, 0.4)',
    'rgba(139, 92, 246, 0.5)',
    'rgba(52, 211, 153, 0.5)',
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particleCount = Math.max(15, Math.min(25, canvas.width / 20));
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas, particleColors));
    }
    particlesRef.current = particles;

    let animationFrameId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update(canvas);
        particle.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const containerAnimation = {
    initial: { opacity: 0, y: 20, scale: 0.9, rotateX: -10 },
    animate: { opacity: 1, y: 0, scale: 1, rotateX: 0 },
    exit: { opacity: 0, y: -20, scale: 0.9, rotateX: 10 }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={containerAnimation}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        mass: 1,
      }}
      className="relative overflow-hidden min-w-[320px] rounded-xl shadow-lg border backdrop-blur-sm border-green-300/40 shadow-emerald-500/10"
      style={{
        boxShadow: `0 4px 20px -2px rgba(0, 0, 0, 0.2),
                    0 0 10px rgba(0, 0, 0, 0.1), 
                    0 0 15px rgba(16, 185, 129, 0.15)`,
        willChange: 'transform, opacity',
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-emerald-600 to-purple-400 opacity-95"></div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative flex items-center p-4 z-10">
        <div 
          className="flex-shrink-0 mr-4 rounded-full"
          style={{ 
            width: '34px', 
            height: '34px', 
            backgroundColor: 'rgba(255, 255, 255, 0.15)', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{
                filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4))',
                width: '20px',
                height: '20px',
                minWidth: '20px',
                minHeight: '20px',
                flexShrink: 0
              }}
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>

        <div className="flex-1 pr-8">
          <p className="text-white font-medium text-[15px] drop-shadow-sm">
            {typeof message === 'string' ? message : 'Notification'}
          </p>
        </div>

        <button
          onClick={() => toast.dismiss(t.id)}
          className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/20 transition-all duration-200 active:scale-90"
          aria-label="Dismiss"
          style={{ touchAction: 'manipulation' }}
        >
          <X className="h-4 w-4 text-white/90 hover:text-white" strokeWidth={2} />
        </button>
      </div>

      <div className="relative h-1.5 w-full bg-black/10">
        <motion.div
          className="h-full bg-white/90 relative overflow-hidden"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{
            duration: duration,
            ease: "linear",
            repeat: 0,
          }}
          onAnimationComplete={() => toast.dismiss(t.id)}
          style={{
            willChange: 'width',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
            WebkitFontSmoothing: 'subpixel-antialiased',
          }}
        >
          <motion.span
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 0,
            }}
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
});
SuccessToast.displayName = 'SuccessToast';

const ErrorToast = memo(({ t, message }: Omit<ToastProps, 'type'>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const duration = t.duration ? t.duration / 1000 : 4;

  // Particle colors for error
  const particleColors = [
    'rgba(220, 38, 38, 0.6)', // Red particles for errors
    'rgba(239, 68, 68, 0.7)',
    'rgba(185, 28, 28, 0.5)',
    'rgba(252, 165, 165, 0.4)',
    'rgba(126, 34, 206, 0.3)', // A bit of purple for brand consistency
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particleCount = Math.max(15, Math.min(25, canvas.width / 20));
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas, particleColors));
    }
    particlesRef.current = particles;

    let animationFrameId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update(canvas);
        particle.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const containerAnimation = {
    initial: { opacity: 0, y: 20, scale: 0.9, rotateX: -10 },
    animate: { opacity: 1, y: 0, scale: 1, rotateX: 0 },
    exit: { opacity: 0, y: -20, scale: 0.9, rotateX: 10 }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={containerAnimation}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        mass: 1,
      }}
      className="relative overflow-hidden min-w-[320px] rounded-xl shadow-lg border backdrop-blur-sm border-red-300/40 shadow-red-500/20"
      style={{
        boxShadow: `0 4px 20px -2px rgba(0, 0, 0, 0.2),
                    0 0 10px rgba(0, 0, 0, 0.1), 
                    0 0 15px rgba(239, 68, 68, 0.25)`,
        willChange: 'transform, opacity',
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-purple-600 to-red-500 opacity-95"></div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative flex items-center p-4 z-10">
        <div 
          className="flex-shrink-0 mr-4 rounded-full"
          style={{ 
            width: '34px', 
            height: '34px', 
            backgroundColor: 'rgba(220, 38, 38, 0.25)', // Color rojo sólido con baja opacidad
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{
                filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4))',
                width: '20px',
                height: '20px',
                minWidth: '20px',
                minHeight: '20px',
                flexShrink: 0
              }}
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        </div>

        <div className="flex-1 pr-8">
          <p className="text-white font-medium text-[15px] drop-shadow-sm">
            {typeof message === 'string' ? message : 'Notification'}
          </p>
        </div>

        <button
          onClick={() => toast.dismiss(t.id)}
          className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/20 transition-all duration-200 active:scale-90"
          aria-label="Dismiss"
          style={{ touchAction: 'manipulation' }}
        >
          <X className="h-4 w-4 text-white/90 hover:text-white" strokeWidth={2} />
        </button>
      </div>

      <div className="relative h-1.5 w-full bg-black/20">
        <motion.div
          className="h-full bg-white/90 relative overflow-hidden"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{
            duration: duration,
            ease: "linear",
            repeat: 0,
          }}
          onAnimationComplete={() => toast.dismiss(t.id)}
          style={{
            willChange: 'width',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
            WebkitFontSmoothing: 'subpixel-antialiased',
          }}
        >
          <motion.span
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 0,
            }}
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500/50"></div>
    </motion.div>
  );
});
ErrorToast.displayName = 'ErrorToast';

const DefaultToast = memo(({ t }: { t: ToastType }) => {
  const message = typeof t.message === 'string' ? t.message : 'Notification';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const duration = t.duration ? t.duration / 1000 : 4;

  // Particle colors for default
  const particleColors = [
    'rgba(126, 34, 206, 0.6)',
    'rgba(147, 51, 234, 0.7)',
    'rgba(107, 33, 168, 0.4)',
    'rgba(139, 92, 246, 0.5)',
    'rgba(192, 132, 252, 0.6)',
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particleCount = Math.max(15, Math.min(25, canvas.width / 20));
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas, particleColors));
    }
    particlesRef.current = particles;

    let animationFrameId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update(canvas);
        particle.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const containerAnimation = {
    initial: { opacity: 0, y: 20, scale: 0.9, rotateX: -10 },
    animate: { opacity: 1, y: 0, scale: 1, rotateX: 0 },
    exit: { opacity: 0, y: -20, scale: 0.9, rotateX: 10 }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={containerAnimation}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        mass: 1,
      }}
      className="relative overflow-hidden min-w-[320px] rounded-xl shadow-lg border backdrop-blur-sm border-purple-300/40 shadow-purple-500/10"
      style={{
        boxShadow: `0 4px 20px -2px rgba(0, 0, 0, 0.2),
                    0 0 10px rgba(0, 0, 0, 0.1), 
                    0 0 15px rgba(79, 70, 229, 0.15)`,
        willChange: 'transform, opacity',
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-indigo-600 to-purple-400 opacity-95"></div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative flex items-center p-4 z-10">
        <div 
          className="flex-shrink-0 mr-4 rounded-full"
          style={{ 
            width: '34px', 
            height: '34px', 
            backgroundColor: 'rgba(255, 255, 255, 0.15)', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{
                filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4))',
                width: '20px',
                height: '20px',
                minWidth: '20px',
                minHeight: '20px',
                flexShrink: 0
              }}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
        </div>

        <div className="flex-1 pr-8">
          <p className="text-white font-medium text-[15px] drop-shadow-sm">
            {message}
          </p>
        </div>

        <button
          onClick={() => toast.dismiss(t.id)}
          className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/20 transition-all duration-200 active:scale-90"
          aria-label="Dismiss"
          style={{ touchAction: 'manipulation' }}
        >
          <X className="h-4 w-4 text-white/90 hover:text-white" strokeWidth={2} />
        </button>
      </div>

      <div className="relative h-1.5 w-full bg-black/10">
        <motion.div
          className="h-full bg-white/90 relative overflow-hidden"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{
            duration: duration,
            ease: "linear",
            repeat: 0,
          }}
          onAnimationComplete={() => toast.dismiss(t.id)}
          style={{
            willChange: 'width',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
            WebkitFontSmoothing: 'subpixel-antialiased',
          }}
        >
          <motion.span
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 0,
            }}
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
});
DefaultToast.displayName = 'DefaultToast';

export const Toaster = () => {
  return (
    <HotToaster position="bottom-center">
      {(t) => {
        // Use completely separate components with no shared logic
        if (t.type === 'success') {
          return <SuccessToast t={t} message={t.message as string} />;
        }

        if (t.type === 'error') {
          return <ErrorToast t={t} message={t.message as string} />;
        }

        return <DefaultToast t={t} />;
      }}
    </HotToaster>
  );
};

export const showToast = {
  success: (message: string, options = {}) =>
    toast.success(message, { 
      duration: 4000, 
      id: `success-${Date.now()}`, // Add unique ID to prevent conflicts
      ...options 
    }),
  error: (message: string, options = {}) =>
    toast.error(message, { 
      duration: 4000,
      id: `error-${Date.now()}`,
      ...options 
    }),
  custom: (message: string, options = {}) =>
    toast(message, { 
      duration: 4000,
      id: `info-${Date.now()}`,
      ...options 
    }),
};

export default { Toaster, showToast };
