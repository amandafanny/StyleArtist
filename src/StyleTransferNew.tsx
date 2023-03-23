import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingCom from "./loadingCom";

interface StyleTransferProps {
  croppedImageBlob: Blob;
}

const StyleTransfer: React.FC<StyleTransferProps> = ({ croppedImageBlob }) => {
  const [generatedImage, setGeneratedImage] = useState<
    { url: string }[] | null
  >(null);
  const [loading, setLoading] = useState(false);

  const fetchStyleTransfer = async () => {
    setLoading(true);
    setGeneratedImage([]);
    try {
      const formData = new FormData();
      formData.append("image", croppedImageBlob, "cropped_image.png");
      const response = await axios.post(
        // "http://34.125.228.69:3001/openai",
        "http://localhost:3001/openai",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      if (response.data.error) {
        console.error("Server error:", response.data.error);
      } else {
        setGeneratedImage(response.data.data); // 根据实际返回数据结构调整
        // tryCatch(() => {
        //   chrome.storage.local.set(
        //     { outputImageList: response.data.data },
        //     () => {
        //       console.log("outputImageList saved");
        //     }
        //   );
        // });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="text-white mb-[20px] bg-[#6d28d9]"
        onClick={fetchStyleTransfer}
        disabled={loading}
      >
        {loading && <LoadingCom />}
        生成图片
      </button>
      <div className="grid grid-cols-4 gap-4">
        <img
          src={URL.createObjectURL(croppedImageBlob)}
          alt="uploaded preview"
        />
        {generatedImage &&
          generatedImage?.length > 0 &&
          generatedImage.map((val, i) => {
            const img = <img src={val.url} alt="output image" />;
            return img;
          })}
      </div>
    </div>
  );
};

export default StyleTransfer;
