import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onUpload(file);

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    multiple: false,
  });

  return (
    <div className="flex flex-col items-center">
      <div
        {...getRootProps()}
        className="text-center p-[20px] rounded-md border-[2px] border-dashed border-[#999] mb-[20px] cursor-pointer"
      >
        <input {...getInputProps()} />
        <p>将图片拖放到这里，或点击选择文件</p>
      </div>
      {previewUrl && (
        <div>
          <img className="w-[256px]" src={previewUrl} alt="Preview" />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
