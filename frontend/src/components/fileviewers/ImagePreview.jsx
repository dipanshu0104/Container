import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Maximize, Minus, Plus, RefreshCw } from "lucide-react";
import { useRef } from "react";

export default function ImagePreview({ url }) {
  const containerRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full bg-[#0a0a0a] bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000_100%)] group overflow-hidden"
    >
      <TransformWrapper
        wheel={{ step: 0.2 }}
        pinch={{ step: 5 }}
        minScale={0.5}
        maxScale={8}
        centerOnInit
      >
        {({ zoomIn, zoomOut, resetTransform, instance }) => {
          const scale = instance?.transformState?.scale || 1;

          return (
            <>
              <TransformComponent
                wrapperClass="!w-full !h-full"
                contentClass="!w-full !h-full flex items-center justify-center"
              >
                <img
                  src={url}
                  alt="preview"
                  className="max-h-[85%] max-w-[85%] object-contain select-none transition-shadow duration-500 shadow-2xl"
                  style={{
                    filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.5))",
                  }}
                  draggable={false}
                />
              </TransformComponent>

              {/* --- Glassmorphic Floating Toolbar (Top Positioned) --- */}
              <div
                className="
                  absolute top-8 left-1/2 -translate-x-1/2
                  flex items-center gap-2
                  z-50
                  /* Glass Core */
                  bg-black/40 backdrop-blur-xl
                  px-5 py-3 rounded-2xl
                  /* High-end borders */
                  border border-white/10 border-b-white/5
                  shadow-[0_20px_50px_rgba(0,0,0,0.3)]
                  /* Animation & Visibility Logic */
                  transition-all duration-500 ease-out
                  /* Mobile: Initially visible and positioned */
                  opacity-100 translate-y-0
                  /* Desktop: Hide initially, slide down on hover */
                  md:opacity-0 md:-translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0
                "
              >
                <div className="flex items-center gap-1 pr-3 border-r border-white/10">
                  <button
                    onClick={() => zoomOut()}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-90"
                  >
                    <Minus size={18} strokeWidth={2.5} />
                  </button>
                  
                  <span className="text-xs font-bold text-white/90 min-w-11.25 text-center tracking-tight">
                    {Math.round(scale * 100)}%
                  </span>

                  <button
                    onClick={() => zoomIn()}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-90"
                  >
                    <Plus size={18} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="flex items-center gap-1 pl-2">
                  <button
                    onClick={() => resetTransform()}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-90"
                    title="Reset"
                  >
                    <RefreshCw size={18} />
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-90"
                    title="Fullscreen"
                  >
                    <Maximize size={18} />
                  </button>
                </div>
              </div>

              {/* Subtle mesh overlay for texture */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </>
          );
        }}
      </TransformWrapper>
    </div>
  );
}