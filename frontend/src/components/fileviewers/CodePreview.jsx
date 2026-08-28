import Editor from "@monaco-editor/react";
import { useEffect, useState, useRef } from "react";
import {
  Copy,
  Download,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  List,
  FileCode,
  Check,
  Terminal,
} from "lucide-react";

const EXTENSION_MAP = {
  js: "javascript", jsx: "javascript", ts: "typescript", tsx: "typescript",
  json: "json", html: "html", css: "css", scss: "scss", py: "python",
  java: "java", cpp: "cpp", c: "c", go: "go", rs: "rust", php: "php",
  md: "markdown", yml: "yaml", yaml: "yaml", sh: "shell",
};

export default function CodePreview({ url }) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("plaintext");
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState("vs-dark");
  const [lineNumbers, setLineNumbers] = useState(true);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const fileName = url?.split("/").pop() || "file.txt";
  const isDark = theme === "vs-dark";

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        setCode(text);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const ext = url.split(".").pop()?.toLowerCase();
    setLanguage(EXTENSION_MAP[ext] || "plaintext");
  }, [url]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([code]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  return (
    <div className={`flex flex-col h-full min-h-100 w-full overflow-hidden border transition-colors duration-200 ${
      isDark ? "bg-[#1e1e1e] border-neutral-800" : "bg-white border-neutral-200"
    } shadow-xl`}>
      
      {/* Header - Responsive Wrap */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 py-2 sm:px-4 sm:py-3 gap-3 ${
        isDark ? "bg-[#252526] border-neutral-800" : "bg-neutral-50 border-neutral-200"
      } border-b`}>
        
        {/* Left: Window Controls & Title */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="hidden md:flex gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border ${
            isDark 
              ? "bg-[#1e1e1e] border-neutral-700 text-neutral-300" 
              : "bg-white border-neutral-300 text-neutral-600"
          } truncate max-w-50 sm:max-w-xs`}>
            <FileCode size={14} className="text-blue-400 shrink-0" />
            <span className="truncate">{fileName}</span>
          </div>
        </div>

        {/* Right: Action Buttons Group */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-1">
          {/* Zoom Controls (Hidden on very small screens to save space) */}
          <div className={`hidden xs:flex items-center gap-1 px-1 border-r mr-1 ${isDark ? "border-neutral-700" : "border-neutral-300"}`}>
            <button onClick={() => setFontSize(s => Math.max(s - 2, 10))} className={`p-2 rounded hover:bg-black/10 dark:hover:bg-white/10 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              <ZoomOut size={16} />
            </button>
            <button onClick={() => setFontSize(s => Math.min(s + 2, 30))} className={`p-2 rounded hover:bg-black/10 dark:hover:bg-white/10 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              <ZoomIn size={16} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setLineNumbers(!lineNumbers)}
              className={`p-2 rounded transition-colors ${
                lineNumbers ? "text-blue-500" : (isDark ? "text-neutral-400" : "text-neutral-600")
              } hover:bg-black/10 dark:hover:bg-white/10`}
            >
              <List size={18} />
            </button>

            <button
              onClick={() => setTheme(isDark ? "vs-light" : "vs-dark")}
              className={`p-2 rounded hover:bg-black/10 dark:hover:bg-white/10 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              onClick={copyCode} 
              className={`p-2 rounded hover:bg-black/10 dark:hover:bg-white/10 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>

            <button
              onClick={downloadFile}
              className={`p-2 rounded hover:bg-black/10 dark:hover:bg-white/10 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}
            >
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Editor Container - Flex Grow handles the height */}
      <div className="flex-1 relative overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-inherit z-20">
             <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
             <span className="text-sm font-medium animate-pulse">Loading Source...</span>
          </div>
        ) : (
          <Editor
            height="100%"
            language={language}
            value={code}
            theme={theme}
            options={{
              readOnly: true,
              fontSize,
              lineNumbers: lineNumbers ? "on" : "off",
              minimap: { enabled: window.innerWidth > 768 }, // Disable minimap on mobile
              wordWrap: "on",
              padding: { top: 16, bottom: 16 },
              smoothScrolling: true,
              scrollBeyondLastLine: false,
              automaticLayout: true, // Crucial for responsiveness
              bracketPairColorization: { enabled: true },
              fontFamily: "'Fira Code', monospace",
            }}
          />
        )}
      </div>

      {/* Responsive Footer */}
      <div className={`px-4 py-1.5 text-[10px] sm:text-xs font-mono flex justify-between items-center transition-colors ${
        isDark ? "bg-[#007acc] text-white" : "bg-neutral-100 text-neutral-500 border-t border-neutral-200"
      }`}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><Terminal size={12}/> {language}</span>
          <span className="hidden xs:inline">UTF-8</span>
        </div>
        <div className="flex gap-3">
          <span>{code.split('\n').length} Lines</span>
        </div>
      </div>
    </div>
  );
}