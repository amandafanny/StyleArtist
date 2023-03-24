import { Area } from "react-easy-crop";

const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

export default async function getCroppedImg(
  imageSrc: string,
  cropArea: Area
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context is not available.");
  }

  const { x, y, width, height } = cropArea;

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty."));
        return;
      }
      // URL.revokeObjectURL() 是一个浏览器提供的方法，用于释放通过 URL.createObjectURL() 创建的对象 URL。当您使用 URL.createObjectURL() 为一个 Blob 或 File 对象创建一个临时 URL 时，该 URL 会占用浏览器的内存，因为浏览器需要保持对底层资源的引用。这意味着，即使您不再需要这个 URL，浏览器仍然会保持对资源的引用，直到页面卸载。
      const croppedImageUrl = URL.createObjectURL(blob);
      resolve(croppedImageUrl);
    }, "image/png");
  });
}
