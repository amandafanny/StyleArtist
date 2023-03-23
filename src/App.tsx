// import "./index.css";
// import StyleTransfer from "./StyleTransfer";

// function App() {
//   return (
//     <div className="container">
//       <StyleTransfer />
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import ImageUploader from "./ImageUploaderNew";
import ImageCropper from "./ImageCropper";
import StyleTransfer from "./StyleTransferNew";

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);

  const handleImageUpload = (file: File) => {
    setSelectedImage(file);
  };

  const handleImageCrop = (croppedImage: Blob) => {
    setCroppedImageBlob(croppedImage);
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
