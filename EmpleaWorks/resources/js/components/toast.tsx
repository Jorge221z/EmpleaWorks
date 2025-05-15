import React, { useEffect, useRef } from 'react';
import toast, { Toast as ToastType, Toaster as HotToaster } from 'react-hot-toast';
import { CheckCircle2, XCircle, X, Info, AlertTriangle } from 'lucide-react';
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

const Toast = ({ t, message, type }: ToastProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Enhanced color schemes with more distinct error styling
  const bgColors = {
    success: 'from-purple-700 via-emerald-600 to-purple-400',
    error: 'from-red-700 via-purple-600 to-red-500', // More distinct red for errors
    default: 'from-purple-800 via-indigo-600 to-purple-400',
  };

  // Particle colors with more distinct error particles
  const particleColors = {
    success: [
      'rgba(126, 34, 206, 0.6)',
      'rgba(147, 51, 234, 0.7)',
      'rgba(107, 33, 168, 0.4)',
      'rgba(139, 92, 246, 0.5)',
      'rgba(52, 211, 153, 0.5)',
    ],
    error: [
      'rgba(220, 38, 38, 0.6)', // Red particles for errors
      'rgba(239, 68, 68, 0.7)',
      'rgba(185, 28, 28, 0.5)',
      'rgba(252, 165, 165, 0.4)',
      'rgba(126, 34, 206, 0.3)', // A bit of purple for brand consistency
    ],
    default: [
      'rgba(126, 34, 206, 0.6)',
      'rgba(147, 51, 234, 0.7)',
      'rgba(107, 33, 168, 0.4)',
      'rgba(139, 92, 246, 0.5)',
      'rgba(192, 132, 252, 0.6)',
    ],
  };

  const duration = t.duration ? t.duration / 1000 : 4;

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
      particles.push(new Particle(canvas, particleColors[type]));
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
  }, [type]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-6 w-6 text-white drop-shadow-md" />;
      case 'error':
        return <AlertTriangle className="h-6 w-6 text-white drop-shadow-md" />; // Using AlertTriangle for errors
      default:
        return <Info className="h-6 w-6 text-white drop-shadow-md" />;
    }
  };

  // Different animations based on toast type - removing the shake animation for error toasts
  const containerAnimation = {
    initial: { opacity: 0, y: 20, scale: 0.9, rotateX: -10 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      rotateX: 0,
    },
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
      className={`relative overflow-hidden min-w-[320px] rounded-xl shadow-lg border backdrop-blur-sm
        ${type === 'success'
          ? 'border-green-300/40 shadow-emerald-500/10'
          : type === 'error'
          ? 'border-red-300/40 shadow-red-500/20' 
          : 'border-purple-300/40 shadow-purple-500/10'
        }`}
      style={{
        boxShadow: `0 4px 20px -2px rgba(0, 0, 0, 0.2),
                    0 0 10px rgba(0, 0, 0, 0.1), 
                    0 0 15px rgba(${type === 'success'
          ? '16, 185, 129'
          : type === 'error'
          ? '239, 68, 68'
          : '79, 70, 229'}, ${type === 'error' ? '0.25' : '0.15'})`,
        willChange: 'transform, opacity',
        transformStyle: 'preserve-3d',
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${bgColors[type]} opacity-95`}></div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative flex items-center p-4 z-10">
        <div className={`flex-shrink-0 mr-4 p-1.5 rounded-full ${
          type === 'error' ? 'bg-red-500/20' : 'bg-white/10'
        } backdrop-blur-sm`}>
          {getIcon()}
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
        >
          <X className="h-4 w-4 text-white/90 hover:text-white" />
        </button>
      </div>

      <div className={`relative h-1.5 w-full ${type === 'error' ? 'bg-black/20' : 'bg-black/10'}`}>
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

      {type === 'error' && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500/50"></div>
      )}
    </motion.div>
  );
};

const DefaultToast = ({ t }: { t: ToastType }) => {
  const message = typeof t.message === 'string' ? t.message : 'Notification';
  return <Toast t={t} message={message} type="default" />;
};

export const Toaster = () => {
  return (
    <HotToaster position="bottom-center">
      {(t) => {
        if (t.type === 'success') {
          return <Toast t={t} message={t.message as string} type="success" />;
        }

        if (t.type === 'error') {
          return <Toast t={t} message={t.message as string} type="error" />;
        }

        return <DefaultToast t={t} />;
      }}
    </HotToaster>
  );
};

export const showToast = {
  success: (message: string, options = {}) =>
    toast.success(message, { duration: 4000, ...options }),
  error: (message: string, options = {}) =>
    toast.error(message, { 
      duration: 4000, // Standardize duration with success toasts
      id: `error-${Date.now()}`, // Add unique ID to prevent duplicate toasts
      ...options 
    }),
  custom: (message: string, options = {}) =>
    toast(message, { duration: 4000, ...options }),
};

export default { Toaster, showToast };
