import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingCom from "./loadingCom";
import { tryCatch } from "./util/tryCatch";
import { getBlob } from "./util/blob";

interface StyleTransferProps {
  croppedImageBlob: Blob;
}

const StyleTransfer: React.FC<StyleTransferProps> = ({ croppedImageBlob }) => {
  const [generatedImageList, setGeneratedImageList] = useState<
    { url: string }[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  // 裁剪之后的图片的预览
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (!chrome.storage) {
      return;
    }
    // 恢复预览
    const restore = async () => {
      chrome.storage.local.get(["generatedImageList"], (data) => {
        if (data.generatedImageList) {
          setGeneratedImageList(data.generatedImageList);
        }
      });
      const croppedImageBlob = await getBlob("croppedImageBlob");
      if (croppedImageBlob) {
        setPreviewUrl(URL.createObjectURL(croppedImageBlob));
      } else {
        console.log("selectedImage not found");
      }
    };
    restore();
  }, []);

  useEffect(() => {
    setPreviewUrl(URL.createObjectURL(croppedImageBlob));
  }, [croppedImageBlob]);

  const fetchStyleTransfer = async () => {
    setLoading(true);
    setGeneratedImageList([]);
    try {
      const formData = new FormData();
      formData.append("image", croppedImageBlob, "cropped_image.png");
      const response = await axios.post(
        "http://34.125.228.69:3001/openai",
        // "http://localhost:3001/openai",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.error) {
        console.error("Server error:", response.data.error);
      } else {
        const list = response.data.data;
        setGeneratedImageList(list); // 根据实际返回数据结构调整
        tryCatch(() => {
          chrome.storage.local.set({ generatedImageList: list }, () => {
            console.log("generatedImageList saved");
          });
        });
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
      <div className="grid grid-cols-3 gap-4">
        <img src={previewUrl} alt="uploaded preview" />
        {generatedImageList &&
          generatedImageList?.length > 0 &&
          generatedImageList.map((val, i) => {
            const img = <img src={val.url} alt="output image" />;
            return img;
          })}
      </div>
    </div>
  );
};

export default StyleTransfer;
