// 将 Blob 对象转换为 base64 编码的字符串
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

// 存储 base64 编码的字符串
export async function storeBlob(key: string, blob: Blob) {
  const base64 = await blobToBase64(blob);
  const item = { [key]: { base64, type: blob.type } };
  chrome.storage.local.set(item, () => {
    console.log(`${key} base64 saved`, base64);
  });
}

// 获取 base64 编码的字符串并转换为 Blob 对象
export function getBlob(key: string): Promise<Blob | undefined> {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, async (result) => {
      const item = result[key];
      if (item) {
        const { base64, type } = item;
        console.log(`${key}.${type}`, base64);
        const response = await fetch(base64);
        const blob = await response.blob();
        resolve(blob);
      } else {
        resolve(undefined);
      }
    });
  });
}
