import React, { ChangeEvent, useEffect, useState } from "react";
import { tryCatch } from "./util/tryCatch";

const isValidPNG = (file: File) => {
  return file.type === "image/png";
};

interface ImageUploaderProps {
  onUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [lastSelectedFile, setLastSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    if (!chrome.storage) {
      return;
    }
    // 恢复预览和文件路径状态
    chrome.storage.local.get(["filePath", "previewUrl"], (data) => {
      if (data.filePath) {
        setLastSelectedFile(data.filePath);
      }
      if (data.previewUrl) {
        setPreview(data.previewUrl);
      }
    });
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!isValidPNG(file)) {
      alert("Please upload a valid PNG image.");
      return;
    }

    setLastSelectedFile(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setPreview(previewUrl);
      tryCatch(() => {
        // 保存预览和文件路径状态
        chrome.storage.local.set({ filePath: file.name, previewUrl }, () => {
          console.log("File path and preview URL saved");
        });
      });
    };
    reader.readAsDataURL(file);
    onUpload(file);
  };

  return (
    <div>
      {lastSelectedFile && <div>Last selected file: {lastSelectedFile}</div>}
      <input
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {preview && (
        <img
          className="object-contain"
          style={{ width: 128, height: 128 }}
          src={preview}
          alt="uploaded preview"
        />
      )}
    </div>
  );
};

export default ImageUploader;
