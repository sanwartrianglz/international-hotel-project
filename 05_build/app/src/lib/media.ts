/** Shrink a camera photo so it fits the offline queue (localStorage). */
export function compressPhoto(file: File, max = 480): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = reject;
    img.src = url;
  });
}

/** Hold-to-record voice note. Falls back to a simulated note if the mic is unavailable. */
export async function startRecording(): Promise<() => Promise<string | null>> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => chunks.push(e.data);
    rec.start();
    return () =>
      new Promise((resolve) => {
        rec.onstop = () => {
          stream.getTracks().forEach((tr) => tr.stop());
          resolve(URL.createObjectURL(new Blob(chunks, { type: rec.mimeType })));
        };
        rec.stop();
      });
  } catch {
    return async () => null;
  }
}
