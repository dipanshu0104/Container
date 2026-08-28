import { useRef, useState, useEffect } from "react";
import {
  Play,
  SkipBack,
  SkipForward,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  ChevronRight,
  ArrowLeft,
  Check,
  Gauge,
  Monitor,
  Keyboard,
  PictureInPicture2,
  Repeat,
} from "lucide-react";

export default function VideoPreview({ url }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideTimer = useRef(null);

  /* ---------------- STATE ---------------- */
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);

  const [showSettings, setShowSettings] = useState(false);
  const [menu, setMenu] = useState("main"); // main | speed
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const [keyboardEnabled, setKeyboardEnabled] = useState(true);

  const speeds = [0.5, 1, 1.25, 1.5, 2];

  /* ---------------- PLAY / PAUSE ---------------- */
  const togglePlay = async () => {
    const video = videoRef.current;
    if (video.paused) {
      await video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  /* ---------------- SKIP ---------------- */
  const skipForward = () => {
    videoRef.current.currentTime += 10;
  };

  const skipBackward = () => {
    videoRef.current.currentTime -= 10;
  };

  /* ---------------- SEEK ---------------- */
  const seek = (time) => {
    videoRef.current.currentTime = Number(time);
  };

  /* ---------------- TIME UPDATE ---------------- */
  const handleTimeUpdate = () => {
    setProgress(videoRef.current.currentTime);
  };

  /* ---------------- BUFFER ---------------- */
  const handleProgress = () => {
    const video = videoRef.current;
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      setBuffer(bufferedEnd);
    }
  };

  /* ---------------- VOLUME ---------------- */
  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  const handleVolume = (e) => {
    const value = Number(e.target.value);
    videoRef.current.volume = value;
    setVolume(value);
  };

  /* ---------------- FULLSCREEN ---------------- */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen();
    }
  };

  /* ---------------- PIP ---------------- */
  const togglePiP = async () => {
    const video = videoRef.current;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (err) {
      console.error("PiP not supported", err);
    }
  };

  /* ---------------- SPEED ---------------- */
  const changeSpeed = (s) => {
    videoRef.current.playbackRate = s;
    setSpeed(s);
    setMenu("main");
  };

  /* ---------------- LOOP ---------------- */
  const toggleLoop = () => {
    const newLoop = !loop;
    videoRef.current.loop = newLoop;
    setLoop(newLoop);
  };

  /* ---------------- THEATER MODE ---------------- */
  const toggleTheater = () => {
    setTheaterMode(!theaterMode);
  };

  /* ---------------- KEYBOARD ---------------- */
  useEffect(() => {
    if (!keyboardEnabled) return;

    const handleKey = (e) => {
      if (e.target.tagName === "INPUT") return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
      if (e.code === "ArrowRight") skipForward();
      if (e.code === "ArrowLeft") skipBackward();
      if (e.code === "KeyM") toggleMute();
      if (e.code === "KeyF") toggleFullscreen();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [keyboardEnabled]);

  /* ---------------- AUTO HIDE ---------------- */
  const showControls = () => {
    setControlsVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  };

  /* ---------------- FORMAT TIME ---------------- */
  const format = (t) => {
    if (!t) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={showControls}
      className={`relative w-full ${theaterMode ? "h-[80vh]" : "h-full"
        } bg-black flex items-center justify-center`}
    >
      <video
        ref={videoRef}
        src={url}
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleProgress}
        onLoadedMetadata={() => setDuration(videoRef.current.duration)}
        className="max-h-full max-w-full"
      />

      {controlsVisible && (
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/50 p-4">
          {/* Timeline */}
          <div className="relative w-full h-1 bg-gray-600 mb-3">
            <div
              className="absolute top-0 left-0 h-1 bg-gray-400"
              style={{ width: `${(buffer / duration) * 100}%` }}
            />
            <div
              className="absolute top-0 left-0 h-1 bg-blue-500"
              style={{ width: `${(progress / duration) * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max={duration}
              value={progress}
              onChange={(e) => seek(e.target.value)}
              className="absolute top-0 w-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-4">

              <button onClick={skipBackward} className="text-white text-sm">
                <SkipBack className="fill-white" size={20} />
              </button>

              <button onClick={togglePlay} className="text-white">
                {playing ? <Pause className="fill-white" size={20} /> : <Play className="fill-white" size={20} />}
              </button>

              <button onClick={skipForward} className="text-white text-sm">
                <SkipForward className="fill-white" size={20} />
              </button>

              <button onClick={toggleMute} className="text-white">
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolume}
                className="w-24 h-1"
              />

              <span className="text-white text-sm">
                {format(progress)} / {format(duration)}
              </span>
            </div>

            <div className="flex items-center gap-4 relative">
              <button
                onClick={() => {
                  setShowSettings(!showSettings);
                  setMenu("main");
                }}
                className="text-white"
              >
                <Settings size={20} />
              </button>

              <button onClick={toggleFullscreen} className="text-white">
                <Maximize size={20} />
              </button>

              {showSettings && (
                <div className="text-sm absolute bottom-12 right-0 w-56 bg-black/90 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden">
                  {menu === "main" && (
                    <>
                      {/* Playback Speed */}
                      <button
                        onClick={() => setMenu("speed")}
                        className="flex justify-between items-center w-full px-4 py-3 hover:bg-neutral-800 text-white"
                      >
                        <div className="flex items-center gap-3">
                          <Gauge size={18} />
                          <span>Playback Speed</span>
                        </div>
                        <ChevronRight size={18} />
                      </button>

                      {/* Theater Mode */}
                      <button
                        onClick={toggleTheater}
                        className="flex justify-between items-center w-full px-4 py-3 hover:bg-neutral-800 text-white"
                      >
                        <div className="flex items-center gap-3">
                          <Monitor size={18} />
                          <span>Theater Mode</span>
                        </div>
                        {theaterMode && <Check size={16} />}
                      </button>

                      {/* Keyboard Shortcuts */}
                      <button
                        onClick={() => setKeyboardEnabled(!keyboardEnabled)}
                        className="flex justify-between items-center w-full px-4 py-3 hover:bg-neutral-800 text-white"
                      >
                        <div className="flex items-center gap-3">
                          <Keyboard size={18} />
                          <span>Keyboard Shortcuts</span>
                        </div>
                        {keyboardEnabled && <Check size={16} />}
                      </button>

                      {/* Picture in Picture */}
                      <button
                        onClick={togglePiP}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-neutral-800 text-white"
                      >
                        <PictureInPicture2 size={18} />
                        <span>Picture in Picture</span>
                      </button>

                      {/* Loop */}
                      <button
                        onClick={toggleLoop}
                        className="flex justify-between items-center w-full px-4 py-3 hover:bg-neutral-800 text-white"
                      >
                        <div className="flex items-center gap-3">
                          <Repeat size={18} />
                          <span>Loop</span>
                        </div>
                        {loop && <Check size={16} />}
                      </button>
                    </>
                  )}

                  {menu === "speed" && (
                    <>
                      <button
                        onClick={() => setMenu("main")}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-800 text-white"
                      >
                        <ArrowLeft size={16} /> Back
                      </button>

                      {speeds.map((s) => (
                        <button
                          key={s}
                          onClick={() => changeSpeed(s)}
                          className="flex justify-between w-full px-4 py-3 hover:bg-neutral-800 text-white"
                        >
                          {s}x
                          {speed === s && <Check size={16} />}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}