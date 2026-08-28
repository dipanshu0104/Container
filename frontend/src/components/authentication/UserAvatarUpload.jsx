import { useRef, useState, useCallback, useMemo } from "react";
import Cropper from "react-easy-crop";
import {
  Camera,
  Upload,
  X,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import getCroppedImg from "../../utils/cropImageUtils";
import { useAuthStore } from "../../store/useAuthStore";

export default function UserAvatarUpload() {
  const fileInputRef = useRef(null);

  const { user, uploadAvatar } = useAuthStore();

  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState(null);

  const [cropModalOpen, setCropModalOpen] =
    useState(false);

  const [uploading, setUploading] = useState(false);

  const cropDiameter = useMemo(() => {
    if (window.innerWidth < 640) return 220;
    if (window.innerWidth < 1024) return 260;
    return 280;
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
      setCropModalOpen(true);
    };

    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback(
    (_, croppedPixels) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  const saveAvatar = useCallback(async () => {
    try {
      setUploading(true);

      const blob = await getCroppedImg(
        image,
        croppedAreaPixels
      );

      const file = new File([blob], "avatar.png", {
        type: "image/png",
      });

      await uploadAvatar(file);

      setCropModalOpen(false);
      setImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
    } finally {
      setUploading(false);
    }
  }, [image, croppedAreaPixels, uploadAvatar]);

  return (
    <>
      {/* Avatar */}
      <div className="relative group w-30 h-30 sm:w-30 sm:h-30">
        <div
          className="
            w-full h-full
            rounded-full
            overflow-hidden
            border border-neutral-800
          "
        >
          <img
            src={
              user?.avatar
                ? `${import.meta.env.VITE_API_BASE}${user.avatar}`
                : "https://i.pravatar.cc/40"
            }
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hover Overlay */}
        <div
          className="
            absolute inset-0
            rounded-full
            bg-black/50
            opacity-0
            group-hover:opacity-100
            transition-all duration-300
            flex items-center justify-center
          "
        >
          <div className="text-center">
            <Upload
              size={20}
              className="mx-auto text-white mb-1"
            />

            <p className="text-white text-xs sm:text-sm">
              Change
            </p>
          </div>
        </div>

        {/* Camera Button */}
        <button
          type="button"
          onClick={() =>
            fileInputRef.current?.click()
          }
          className="
            absolute bottom-1 right-1
            w-8 h-8
            sm:w-8 sm:h-8
            rounded-full
            bg-blue-600
            text-white
            flex items-center justify-center
            shadow-lg
            hover:scale-105
            transition
          "
        >
          <Camera size={18} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* Crop Modal */}
      <AnimatePresence>
        {cropModalOpen && (
          <motion.div
            className="
              fixed inset-0
              z-50
              bg-black/60 backdrop-blur-sm
              flex items-center justify-center
              p-4
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
              }}
              className="
                relative
                w-[95vw]
                max-w-125
                h-[75vh]
                max-h-125
                min-h-95
                bg-neutral-900
                rounded-xl
                overflow-hidden
                border border-neutral-800/50
              "
            >
              {/* Header */}
              <div
                className="
                  h-12
                  px-4
                  bg-neutral-950
                  border-b border-white/10
                  flex items-center justify-between
                "
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setCropModalOpen(false)
                    }
                    className="
                      text-gray-400
                      hover:text-white
                    "
                  >
                    <X size={20} />
                  </button>

                  <span
                    className="
                      text-white
                      text-sm
                      sm:text-base
                    "
                  >
                    Drag image to adjust
                  </span>
                </div>

                <button
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="
                    flex items-center gap-2
                    text-white
                    hover:text-[#25D366]
                    text-sm
                  "
                >
                  <Upload size={16} />
                  Upload
                </button>
              </div>

              {/* Crop Area */}
              <div className="relative h-[calc(100%-48px)]">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  cropSize={{
                    width: cropDiameter,
                    height: cropDiameter,
                  }}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />

                {/* Zoom Controls */}
                <div
                  className="
                    absolute
                    right-3 sm:right-5
                    top-1/2
                    -translate-y-1/2
                    flex flex-col
                    overflow-hidden
                    rounded-xl
                    bg-neutral-950/80
                    border border-white/10
                  "
                >
                  <button
                    onClick={() =>
                      setZoom((prev) =>
                        Math.min(prev + 0.1, 3)
                      )
                    }
                    className="
                      p-2
                      flex items-center justify-center
                      text-white
                      hover:bg-neutral-800/80
                    "
                  >
                    <Plus size={18} />
                  </button>

                  <div className="h-px bg-white/10" />

                  <button
                    onClick={() =>
                      setZoom((prev) =>
                        Math.max(prev - 0.1, 1)
                      )
                    }
                    className="
                      p-2
                      flex items-center justify-center
                      text-white
                      hover:bg-neutral-800
                    "
                  >
                    <Minus size={18} />
                  </button>
                </div>

                {/* Save Button */}
                <button
                  onClick={saveAvatar}
                  disabled={uploading}
                  className="
                    absolute
                    bottom-4
                    right-4
                    sm:bottom-5
                    sm:right-5
                    w-12 h-12
                    sm:w-14 sm:h-14
                    rounded-full
                    bg-blue-600
                    text-white
                    flex items-center justify-center
                    shadow-lg
                    hover:scale-105
                    transition
                    disabled:opacity-50
                  "
                >
                  {uploading ? (
                    <div
                      className="
                        w-5 h-5
                        border-2 border-white
                        border-t-transparent
                        rounded-full
                        animate-spin
                      "
                    />
                  ) : (
                    <Check size={24} />
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}