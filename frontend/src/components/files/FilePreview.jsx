import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useFileStore } from "../../store/useFileStore";

import ImagePreview from "../fileviewers/ImagePreview"
import PdfPreview from "../fileviewers/PdfPreview";
import CodePreview from "../fileviewers/CodePreview";
import VideoPreview from "../fileviewers/VideoPreview";
import AudioPreview from "../fileviewers/AudioPreview";

import { getPreviewType } from "../../utils/previewType";

export default function FilePreview() {

  const { id } = useParams();
  const navigate = useNavigate();

  const { previewFile } = useFileStore();

  const [url, setUrl] = useState(null);
  const [type, setType] = useState("");

  useEffect(() => {

    const load = async () => {

      const res = await previewFile(id);

      if (!res) return;

      setUrl(res.url);
      setType(getPreviewType(res.type));
    };

    load();

  }, [id]);

  if (!url)
    return (
      <div className="h-screen bg-black flex items-center justify-center text-neutral-400">
        Loading preview...
      </div>
    );

  return (

    <div className="h-screen w-screen bg-black">

      {type === "image" && <ImagePreview url={url} />}

      {type === "video" && <VideoPreview url={url} />}

      {type === "pdf" && <PdfPreview url={url} />}

      {type === "code" && <CodePreview url={url} />}

      {type === "audio" && (
        <div className="flex items-center justify-center h-full px-4">
          <AudioPreview url={url} />
        </div>
      )}

      {type === "unknown" && (
        <div className="flex items-center justify-center h-full text-neutral-400">
          Preview not supported
        </div>
      )}

    </div>

  );
}