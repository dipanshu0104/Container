import { useEffect, useRef, useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  Download,
  Loader2,
  FileText,
  ChevronUp,
} from "lucide-react";

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// ============================================================
// PDF PAGE COMPONENT
// ============================================================

function PDFPage({
  pdf,
  pageNumber,
  zoom,
  rotation,
  containerWidth,
}) {
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);

  const [rendering, setRendering] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const renderPage = async () => {
      if (!pdf || !canvasRef.current) {
        return;
      }

      try {
        setRendering(true);

        // Get PDF page
        const page = await pdf.getPage(pageNumber);

        if (cancelled) {
          return;
        }

        /*
         * Render PDF at 2x resolution.
         *
         * Zoom does NOT trigger PDF rendering again.
         * Zoom only changes the CSS/display width.
         */
        const baseScale = 2;

        const viewport = page.getViewport({
          scale: baseScale,
          rotation,
        });

        const canvas = canvasRef.current;

        const context = canvas.getContext("2d", {
          alpha: false,
        });

        // Cancel previous render if necessary
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {
            // Ignore cancellation errors
          }
        }

        // Set actual canvas resolution
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        // Render page
        renderTaskRef.current = page.render({
          canvasContext: context,
          viewport,
        });

        await renderTaskRef.current.promise;

        if (!cancelled) {
          setRendering(false);
        }
      } catch (error) {
        if (error?.name !== "RenderingCancelledException") {
          console.error(
            `Failed to render PDF page ${pageNumber}:`,
            error
          );
        }

        if (!cancelled) {
          setRendering(false);
        }
      }
    };

    renderPage();

    return () => {
      cancelled = true;

      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // Ignore
        }
      }
    };
  }, [pdf, pageNumber, rotation]);

  /*
   * Zoom only changes the displayed width.
   * PDF.js does NOT render the page again.
   */
  const displayWidth = containerWidth
    ? containerWidth * zoom
    : undefined;

  return (
    <div
      className="
        group
        relative
        flex
        justify-center
        transition-all
        duration-300
      "
      style={{
        width: displayWidth || "auto",
      }}
    >
      {/* Page Number */}
      <div
        className="
          pointer-events-none
          absolute
          -left-20
          top-4
          hidden
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
          xl:block
        "
      >
        <span
          className="
            text-[10px]
            font-black
            tracking-widest
            text-zinc-600
          "
        >
          PAGE {pageNumber}
        </span>
      </div>

      {/* Loading Overlay */}
      {rendering && (
        <div
          className="
            absolute
            inset-0
            z-10
            flex
            items-center
            justify-center
            bg-[#111]/40
          "
        >
          <Loader2
            size={22}
            className="animate-spin text-zinc-500"
          />
        </div>
      )}

      {/* PDF Canvas */}
      <canvas
        ref={canvasRef}
        title={`Page ${pageNumber}`}
        className="
          block
          h-auto
          max-w-none
          bg-white
          shadow-[0_30px_60px_-12px_rgba(0,0,0,0.7)]
        "
        style={{
          width: "100%",
        }}
      />
    </div>
  );
}

// ============================================================
// MAIN PDF VIEWER
// ============================================================

export default function PremiumFullScrollPdf({
  url,
  fileName = "Document.pdf",
}) {
  const containerRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const pdfRef = useRef(null);

  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);

  const [zoom, setZoom] = useState(1);

  const [containerWidth, setContainerWidth] = useState(0);

  const [rotation, setRotation] = useState(0);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================================
  // LOAD PDF
  // ==========================================================

  useEffect(() => {
    let cancelled = false;
    let loadingTask = null;

    const loadPDF = async () => {
      if (!url) {
        setError("No PDF URL provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        loadingTask = pdfjsLib.getDocument({
          url,
        });

        const loadedPdf = await loadingTask.promise;

        if (cancelled) {
          await loadedPdf.destroy();
          return;
        }

        console.log(
          "PDF loaded:",
          loadedPdf.numPages,
          "pages"
        );

        pdfRef.current = loadedPdf;

        setPdf(loadedPdf);
        setNumPages(loadedPdf.numPages);
        setLoading(false);
      } catch (error) {
        console.error("PDF loading error:", error);

        if (!cancelled) {
          setError("Unable to load this PDF.");
          setLoading(false);
        }
      }
    };

    loadPDF();

    return () => {
      cancelled = true;

      if (loadingTask) {
        try {
          loadingTask.destroy();
        } catch {
          // Ignore
        }
      }

      if (pdfRef.current) {
        try {
          pdfRef.current.destroy();
        } catch {
          // Ignore
        }

        pdfRef.current = null;
      }
    };
  }, [url]);

  // ==========================================================
  // RESPONSIVE WIDTH
  // ==========================================================

  useEffect(() => {
    const updateWidth = () => {
      if (!scrollAreaRef.current) {
        return;
      }

      const width = scrollAreaRef.current.clientWidth;

      const horizontalPadding =
        window.innerWidth < 768 ? 32 : 128;

      setContainerWidth(
        Math.max(width - horizontalPadding, 300)
      );
    };

    updateWidth();

    window.addEventListener(
      "resize",
      updateWidth
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateWidth
      );
    };
  }, []);

  // ==========================================================
  // ZOOM
  // ==========================================================

  const zoomIn = () => {
    setZoom((current) =>
      Math.min(
        Number((current + 0.1).toFixed(2)),
        2
      )
    );
  };

  const zoomOut = () => {
    setZoom((current) =>
      Math.max(
        Number((current - 0.1).toFixed(2)),
        0.4
      )
    );
  };

  const resetZoom = () => {
    setZoom(1);
  };

  // ==========================================================
  // ROTATION
  // ==========================================================

  const rotate = () => {
    setRotation(
      (current) => (current + 90) % 360
    );
  };

  // ==========================================================
  // FULLSCREEN
  // ==========================================================

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error(
        "Fullscreen error:",
        error
      );
    }
  };

  // ==========================================================
  // SCROLL TO TOP
  // ==========================================================

  const scrollToTop = () => {
    scrollAreaRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================================
  // KEYBOARD SHORTCUTS
  // ==========================================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Zoom in
      if (
        event.code === "Equal" ||
        event.code === "NumpadAdd"
      ) {
        event.preventDefault();
        zoomIn();
      }

      // Zoom out
      if (
        event.code === "Minus" ||
        event.code === "NumpadSubtract"
      ) {
        event.preventDefault();
        zoomOut();
      }

      // Reset zoom
      if (event.code === "Digit0") {
        event.preventDefault();
        resetZoom();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      ref={containerRef}
      className="
        flex
        h-screen
        w-full
        flex-col
        overflow-hidden
        bg-[#080808]
        text-zinc-300
        antialiased
      "
    >
      {/* ======================================================
          HUD HEADER
      ======================================================= */}

      <header
        className="
          fixed
          left-1/2
          top-6
          z-50
          w-[92%]
          max-w-3xl
          -translate-x-1/2
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-white/10
            bg-[#121212]/70
            px-3
            py-2
            shadow-2xl
            backdrop-blur-3xl
          "
        >
          {/* ==================================================
              FILE INFO
          =================================================== */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
              px-2
            "
          >
            <div
              className="
                hidden
                rounded-xl
                bg-blue-500
                p-2
                text-white
                sm:block
              "
            >
              <FileText
                size={16}
                strokeWidth={3}
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  leading-tight
                  tracking-[0.2em]
                  text-zinc-500
                "
              >
                Viewer
              </p>

              <p
                className="
                  max-w-32
                  truncate
                  text-[11px]
                  font-bold
                  text-zinc-100
                  sm:max-w-52
                "
              >
                {fileName}
              </p>
            </div>
          </div>

          {/* ==================================================
              ZOOM CONTROLS
          =================================================== */}

          <div
            className="
              flex
              items-center
              gap-1
              rounded-xl
              border
              border-white/5
              bg-black/40
              p-1
            "
          >
            <button
              onClick={zoomOut}
              disabled={zoom <= 0.4}
              className="
                rounded-lg
                p-2
                transition-all
                hover:bg-white/10
                active:scale-90
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
              title="Zoom out"
            >
              <ZoomOut size={16} />
            </button>

            <button
              onClick={resetZoom}
              className="
                w-11
                text-center
                font-mono
                text-[10px]
                text-zinc-400
                transition-colors
                hover:text-white
              "
              title="Reset zoom"
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              onClick={zoomIn}
              disabled={zoom >= 2}
              className="
                rounded-lg
                p-2
                transition-all
                hover:bg-white/10
                active:scale-90
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
              title="Zoom in"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* ==================================================
              ACTIONS
          =================================================== */}

          <div className="flex items-center gap-1">
            {/* Rotate */}

            <button
              onClick={rotate}
              className="
                hidden
                rounded-xl
                p-2.5
                text-zinc-400
                transition-colors
                hover:bg-white/5
                hover:text-white
                sm:flex
              "
              title="Rotate"
            >
              <RotateCcw size={16} />
            </button>

            {/* Fullscreen */}

            <button
              onClick={toggleFullscreen}
              className="
                rounded-xl
                p-2.5
                text-zinc-400
                transition-colors
                hover:bg-white/5
                hover:text-white
              "
              title="Fullscreen"
            >
              <Maximize size={16} />
            </button>

            {/* Download */}

            <a
              href={url}
              download={fileName}
              className="
                ml-1
                rounded-xl
                bg-blue-500
                p-2.5
                text-white
                shadow-[0_0_20px_rgba(255,255,255,0.1)]
                transition-all
                hover:bg-blue-600
                active:scale-95
              "
              title="Download"
            >
              <Download
                size={16}
                strokeWidth={2.5}
              />
            </a>
          </div>
        </div>
      </header>

      {/* ======================================================
          MAIN SCROLL AREA
      ======================================================= */}

      <main
        ref={scrollAreaRef}
        className="
          custom-grid
          no-scrollbar
          flex-1
          overflow-y-auto
          overflow-x-auto
          pt-32
        "
      >
        {/* ====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div
            className="
              mx-auto
              mt-20
              max-w-md
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/5
              px-6
              py-5
              text-center
            "
          >
            <FileText
              className="mx-auto mb-3 text-red-400"
              size={28}
            />

            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* ====================================================
            LOADING
        ===================================================== */}

        {loading && (
          <div
            className="
              flex
              min-h-[60vh]
              flex-col
              items-center
              justify-center
              gap-4
            "
          >
            <Loader2
              className="
                h-8
                w-8
                animate-spin
                text-zinc-500
              "
            />

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-widest
                text-zinc-600
              "
            >
              Loading PDF
            </span>
          </div>
        )}

        {/* ====================================================
            PDF PAGES
        ===================================================== */}

        {!loading && pdf && (
          <div
            className="
              flex
              min-w-full
              flex-col
              items-center
              gap-10
              pb-32
            "
          >
            {Array.from(
              { length: numPages },
              (_, index) => (
                <PDFPage
                  key={`pdf-page-${index + 1}`}
                  pdf={pdf}
                  pageNumber={index + 1}
                  zoom={zoom}
                  rotation={rotation}
                  containerWidth={containerWidth}
                />
              )
            )}
          </div>
        )}
      </main>

      {/* ======================================================
          FOOTER
      ======================================================= */}

      {!loading && pdf && (
        <div
          className="
            fixed
            bottom-8
            left-8
            z-40
            hidden
            items-center
            gap-4
            md:flex
          "
        >
          {/* Scroll Top */}

          <button
            onClick={scrollToTop}
            className="
              pointer-events-auto
              rounded-full
              border
              border-white/5
              bg-zinc-900/50
              p-3
              backdrop-blur-xl
              transition-colors
              hover:bg-white/10
            "
            title="Scroll to top"
          >
            <ChevronUp size={16} />
          </button>

          {/* Page Count */}

          <div
            className="
              rounded-2xl
              border
              border-white/5
              bg-zinc-900/50
              px-4
              py-2
              backdrop-blur-xl
            "
          >
            <p
              className="
                text-[10px]
                font-black
                tracking-widest
                text-zinc-500
              "
            >
              TOTAL

              <span className="ml-1 text-zinc-100">
                {numPages} PAGES
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}