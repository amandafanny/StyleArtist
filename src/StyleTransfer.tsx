import React, { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";
import axios from "axios";
import { tryCatch } from "./util/tryCatch";

const loadingCom = () => {
  return (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

const StyleTransfer: React.FC = () => {
  const [outputImageList, setOutputImageList] = useState<
    { url: string }[] | null
  >(null);
  const [inputImg, setInputImg] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!chrome.storage) {
      return;
    }
    // 恢复预览状态
    chrome.storage.local.get(["previewUrl", "outputImageList"], (data) => {
      console.log(data);
      if (data.previewUrl) {
        setPreview(data.previewUrl);
      }
      if (data.outputImageList) {
        setOutputImageList(data.outputImageList);
      }
    });
  }, []);

  const handleUpload = async (file: File) => {
    // 调用 OpenAI API 的逻辑将在这里实现
    // 然后将处理后的图片 URL 设置为 imageURL 的值
    setInputImg(file);
  };

  const generate = async () => {
    setOutputImageList([]);
    setLoading(true);
    tryCatch(() => {
      chrome.storage.local.set({ outputImageList: [] }, () => {
        console.log("outputImageList saved");
      });
    });
    if (inputImg) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageUrl = reader.result as string;
        setPreview(imageUrl);
      };
      reader.readAsDataURL(inputImg);
      const formData = new FormData();
      formData.append("image", inputImg);
      try {
        const response = await axios.post(
          // "http://34.125.228.69:3001/openai",
          "http://localhost:3001/openai",
          formData
        );
        console.log(response);
        if (response.data.error) {
          console.error("Server error:", response.data.error);
        } else {
          setOutputImageList(response.data.data); // 根据实际返回数据结构调整
          tryCatch(() => {
            chrome.storage.local.set(
              { outputImageList: response.data.data },
              () => {
                console.log("outputImageList saved");
              }
            );
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h6 className="mb-[20px] font-semibold">Image Style Transfer</h6>
      <ImageUploader onUpload={handleUpload} />
      <button
        className="flex items-center justify-center text-white h-[32px] py-0 my-[20px] bg-[#6d28d9]"
        onClick={generate}
        disabled={loading}
      >
        {loading && loadingCom()}
        生成图片
      </button>
      <div className="grid grid-cols-4 gap-4">
        {outputImageList &&
          outputImageList?.length > 0 &&
          outputImageList.map((val, i) => {
            const img = <img src={val.url} alt="output image" />;
            if (i === 0) {
              return (
                <>
                  <img src={preview} alt="uploaded preview" />
                  {img}
                </>
              );
            }
            return img;
          })}
      </div>
    </div>
  );
};

export default StyleTransfer;
