import React, { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImage from "./util/cropImage";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: Blob) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageSrc,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  // 控制放大比例
  const [zoom, setZoom] = useState(1);
  // 裁剪区域
  const [cropArea, setCropArea] = useState<Area | null>(null);

  // 裁剪完成
  const handleCropComplete = useCallback(async () => {
    if (cropArea) {
      const croppedImage = await getCroppedImage(imageSrc, cropArea);

      // Convert the base64 image to a Blob
      const response = await fetch(croppedImage);
      const croppedImageBlob = await response.blob();

      const maxSize = 4 * 1024 * 1024; // 4MB
      if (croppedImageBlob.size > maxSize) {
        alert("图片不能超过 4MB，请重新裁剪。");
        return;
      }

      onCropComplete(croppedImageBlob);
    }
  }, [imageSrc, cropArea, onCropComplete]);

  return (
    <div className="flex flex-col items-center mt-[20px]">
      <div className="max-w-[256px] h-[256px] w-[100%] relative bg-[#f0f0f0] overflow-hidden">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(croppedArea, croppedAreaPixels) =>
            setCropArea(croppedAreaPixels)
          }
        />
      </div>
      <button
        className="mt-[20px] text-white bg-[#6d28d9]"
        onClick={handleCropComplete}
      >
        完成裁剪
      </button>
    </div>
  );
};

export default ImageCropper;
