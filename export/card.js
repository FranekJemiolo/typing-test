import { generateResultImage } from "./image.js";

export async function downloadResultImage(data) {
  try {
    const blob = await generateResultImage(data);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `typing-result-${data.wpm}-wpm.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to generate image:", error);
    alert("Failed to generate result image. Please try again.");
  }
}

export function copyResultText(data) {
  const text = `I scored ${data.wpm} WPM with ${data.accuracy}% accuracy on TypeRacer Lite!`;
  
  navigator.clipboard.writeText(text).then(() => {
    alert("Result copied to clipboard!");
  }).catch(err => {
    console.error("Failed to copy:", err);
  });
}
