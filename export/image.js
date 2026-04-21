export async function generateResultImage(data) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;

  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#0d0f14";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#0d0f14");
  gradient.addColorStop(1, "#1a1d24");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 48px Arial, sans-serif";
  ctx.fillText("TYPE TEST RESULT", 60, 100);

  // WPM - Large
  ctx.fillStyle = "#00ff88";
  ctx.font = "bold 140px Arial, sans-serif";
  ctx.fillText(`${data.wpm}`, 60, 280);

  ctx.fillStyle = "#888888";
  ctx.font = "36px Arial, sans-serif";
  ctx.fillText("WPM", 300, 280);

  // Stats
  ctx.fillStyle = "#ffffff";
  ctx.font = "32px Arial, sans-serif";
  ctx.fillText(`Accuracy: ${data.accuracy}%`, 60, 360);
  ctx.fillText(`Errors: ${data.errors}`, 60, 410);
  ctx.fillText(`Missed: ${data.missedChars}`, 60, 460);
  ctx.fillText(`Keys: ${data.keysPressed}`, 60, 510);

  // Decorative line
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 550);
  ctx.lineTo(1140, 550);
  ctx.stroke();

  // Watermark
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = "#666666";
  ctx.font = "20px Arial, sans-serif";
  ctx.fillText("Generated on github.io typing test", 60, 590);

  // Date
  const date = new Date().toLocaleDateString();
  ctx.fillText(date, 60, 615);

  ctx.globalAlpha = 1.0;

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}
