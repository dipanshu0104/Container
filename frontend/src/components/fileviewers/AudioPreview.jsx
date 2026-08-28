import { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  RotateCw,
  Repeat,
  Settings2,
} from "lucide-react";

export default function AudioPreview({ url, title = "Unknown Track" }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [loop, setLoop] = useState(false);
  const [speed, setSpeed] = useState(1);

  const togglePlay = () => {
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setProgress((current / total) * 100 || 0);
  };

  const handleSeek = (e) => {
    const value = e.target.value;
    audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    setProgress(value);
  };

  const toggleMute = () => {
    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  const skip = (sec) => {
    audioRef.current.currentTime += sec;
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-neutral-950 backdrop-blur-2xl rounded-4xl border border-white/10 shadow-2xl text-white font-sans selection:bg-indigo-500/30">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={() => setPlaying(false)}
      />

      {/* Header Info */}
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium text-white/90 truncate">{title}</h3>
        <p className="text-sm text-zinc-500 uppercase tracking-widest mt-1">Audio Preview</p>
      </div>

      {/* Progress Section */}
      <div className="group relative mb-8">
        <input
          type="range"
          value={progress}
          onChange={handleSeek}
          className="absolute w-full h-1.5 bg-transparent appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]"
        />
        <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-3 text-[10px] font-medium text-zinc-500 tabular-nums uppercase tracking-tighter">
          <span>{formatTime((progress / 100) * duration)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Primary Controls */}
      <div className="flex items-center justify-between mb-10">
        <button 
          onClick={() => skip(-10)} 
          className="p-3 text-zinc-400 hover:text-white transition-colors hover:bg-white/5 rounded-full"
        >
          <RotateCcw size={22} />
        </button>

        <button
          onClick={togglePlay}
          className="group relative flex items-center justify-center w-20 h-20 rounded-full bg-blue-500 text-white transition-all hover:scale-105 active:scale-95 "
        >
          {playing ? <Pause fill="currentColor" size={32} /> : <Play className="ml-1" fill="currentColor" size={32} />}
        </button>

        <button 
          onClick={() => skip(10)} 
          className="p-3 text-zinc-400 hover:text-white transition-colors hover:bg-white/5 rounded-full"
        >
          <RotateCw size={22} />
        </button>
      </div>

      {/* Bottom Toolbelt */}
      <div className="flex items-center justify-between px-2 pt-6 border-t border-white/5">
        
        {/* Volume Group */}
        <div className="flex items-center gap-3">
          <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition-colors">
            {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={(e) => {
              const val = Number(e.target.value);
              setVolume(val);
              audioRef.current.volume = val;
            }}
            className="w-16 h-1 bg-white/10 accent-white rounded-full appearance-none cursor-pointer"
          />
        </div>

        {/* Secondary Toggles */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              const rates = [1, 1.5, 2, 0.5];
              const next = rates[(rates.indexOf(speed) + 1) % rates.length];
              setSpeed(next);
              audioRef.current.playbackRate = next;
            }}
            className="text-[11px] font-bold text-zinc-400 hover:text-white transition-colors w-8"
          >
            {speed}x
          </button>
          
          <button
            onClick={() => {
              audioRef.current.loop = !loop;
              setLoop(!loop);
            }}
            className={`transition-colors ${loop ? "text-indigo-400" : "text-zinc-400 hover:text-white"}`}
          >
            <Repeat size={18} />
          </button>
        </div>
        
      </div>
    </div>
  );
}