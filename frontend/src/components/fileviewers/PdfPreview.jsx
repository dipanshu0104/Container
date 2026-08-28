import { Document, Page, pdfjs } from "react-pdf";
import { useState, useRef, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  Download,
  Loader2,
  FileText,
  ChevronUp
} from "lucide-react";

// 1. PDF Worker Setup
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

// 2. CSS Reset - This is the "Magic" that kills the white space gaps
const styles = `
  .react-pdf__Page__canvas {
    display: block !important;
    margin: 0 auto;
    max-width: 100% !important;
    height: auto !important;
    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.7);
  }
  .react-pdf__Page {
    background-color: transparent !important;
    line-height: 0 !important;
    display: block !important;
  }
  .react-pdf__Document {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px; /* Space between pages */
    padding-bottom: 120px;
  }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .custom-grid {
    background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0);
    background-size: 30px 30px;
  }
`;

export default function PremiumFullScrollPdf({ url }) {
  const containerRef = useRef(null);
  const scrollAreaRef = useRef(null);

  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);

  // Responsive Width Logic
  useEffect(() => {
    const updateWidth = () => {
      if (scrollAreaRef.current) {
        // Leave horizontal breathing room (Mobile: 16px, Desktop: 64px)
        const padding = window.innerWidth < 768 ? 16 : 64;
        setContainerWidth(scrollAreaRef.current.clientWidth - padding);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  const scrollToTop = () => {
    scrollAreaRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="flex flex-col h-screen w-full bg-[#080808] text-zinc-300 antialiased">
      <style>{styles}</style>
      
      {/* HUD Header (Floating Pill) */}
      <header className="z-50 fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl">
        <div className="flex items-center justify-between px-3 py-2 bg-[#121212]/70 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl">
          
          {/* Brand/File Info */}
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-blue-500 rounded-xl text-white hidden sm:block">
              <FileText size={16} strokeWidth={3} />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-black leading-tight">Viewer</p>
              <p className="text-[11px] font-bold text-zinc-100 truncate max-w-20 sm:max-w-37.5">Document.pdf</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/5">
            <button 
              onClick={() => setScale(s => Math.max(s - 0.1, 0.4))} 
              className="p-2 hover:bg-white/10 rounded-lg transition-all active:scale-90"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-[10px] font-mono w-10 text-center text-zinc-400">
              {Math.round(scale * 100)}%
            </span>
            <button 
              onClick={() => setScale(s => Math.min(s + 0.1, 3))} 
              className="p-2 hover:bg-white/10 rounded-lg transition-all active:scale-90"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button onClick={() => setRotation(r => (r + 90) % 360)} className="hidden sm:flex p-2.5 hover:bg-white/5 rounded-xl text-zinc-400 transition-colors">
              <RotateCcw size={16} />
            </button>
            <button onClick={toggleFullscreen} className="p-2.5 hover:bg-white/5 rounded-xl text-zinc-400 transition-colors">
              <Maximize size={16} />
            </button>
            <a 
              href={url} 
              download 
              className="ml-1 p-2.5 bg-blue-500 text-white hover:bg-blue-600 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <Download size={16} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Scroll Content */}
      <main 
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto custom-grid pt-32 no-scrollbar"
      >
        <div className="flex flex-col items-center">
          {loading && (
            <div className="flex flex-col items-center gap-4 py-40">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
              <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Rendering</span>
            </div>
          )}

          <Document 
            file={url} 
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
              setLoading(false);
            }}
            className="w-full"
            loading={null}
          >
            {numPages && Array.from(new Array(numPages), (_, i) => (
              <div 
                key={`page_${i + 1}`} 
                className="group relative transition-all duration-500"
                style={{ 
                  width: containerWidth ? (containerWidth * scale) : 'auto',
                  lineHeight: 0 // Triple check for bottom gaps
                }}
              >
                {/* Floating Page Number (Visible on hover) */}
                <div className="absolute -left-16 top-4 opacity-0 group-hover:opacity-100 transition-opacity hidden xl:block">
                  <span className="text-[10px] font-black text-zinc-600 tracking-tighter">PAGE {i + 1}</span>
                </div>

                <Page
                  pageNumber={i + 1}
                  scale={scale}
                  width={containerWidth}
                  rotate={rotation}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={<div className="h-150 w-full bg-white/5 animate-pulse rounded-sm" />}
                />
              </div>
            ))}
          </Document>
        </div>
      </main>

      {/* Footer Meta */}
      {!loading && (
        <div className="fixed bottom-8 left-8 hidden md:flex items-center gap-4 z-40">
          <button 
            onClick={scrollToTop}
            className="p-3 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-full hover:bg-white/10 transition-colors pointer-events-auto"
          >
            <ChevronUp size={16} />
          </button>
          <div className="px-4 py-2 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl">
            <p className="text-[10px] font-black tracking-widest text-zinc-500">
              TOTAL <span className="text-zinc-100 ml-1">{numPages} PAGES</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}