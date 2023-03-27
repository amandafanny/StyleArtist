// import StyleTransfer from "./StyleTransfer";

// function App() {
//   return (
//     <div className="container">
//       <StyleTransfer />
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import ImageUploader from "./ImageUploaderNew";
import ImageCropper from "./ImageCropper";
import StyleTransfer from "./StyleTransferNew";
import { tryCatch } from "./util/tryCatch";
import { getBlob, storeBlob } from "./util/blob";

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);

  // 处理谷歌扩展缓存 croppedImageBlob 和 selectedImage
  useEffect(() => {
    if (!chrome.storage) {
      return;
    }
    // 恢复预览
    const restore = async () => {
      const selectedImage = await getBlob("selectedImage");
      if (selectedImage) {
        setSelectedImage(selectedImage as File);
      } else {
        console.log("selectedImage not found");
      }
      const croppedImage = await getBlob("croppedImage");
      if (croppedImage) {
        setCroppedImageBlob(croppedImage);
      } else {
        console.log("croppedImage not found");
      }
    };
    restore();
  }, []);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      console.log(tab.title);
    });
  });

  const handleImageUpload = (file: File) => {
    setSelectedImage(file);
    tryCatch(async () => {
      await storeBlob("selectedImage", file);
    });
  };

  const handleImageCrop = (croppedImage: Blob) => {
    setCroppedImageBlob(croppedImage);
    tryCatch(async () => {
      await storeBlob("croppedImage", croppedImage);
    });
  };

  return (
    <div className="h-[100vh]">
      <h1 className="text-center">AI 风格转换</h1>
      <div className="flex">
        <div className="w-[49vw]">
          <ImageUploader onUpload={handleImageUpload} />
          {selectedImage && (
            <ImageCropper
              imageSrc={URL.createObjectURL(selectedImage)}
              onCropComplete={handleImageCrop}
            />
          )}
        </div>
        <div className="w-[49vw]">
          {croppedImageBlob && (
            <StyleTransfer croppedImageBlob={croppedImageBlob} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
