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
      const croppedImageUrl = URL.createObjectURL(blob);
      resolve(croppedImageUrl);
    }, "image/png");
  });
}
