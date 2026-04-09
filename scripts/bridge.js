export function drawBridge(ctx, cssW, cssH, bridge) {
  const {
    image,
    y = cssH - 150,
    scale = 1.0,
    overlap = 0.2,
    text = null,
    txtsize = 60
  } = bridge;

  if (!bridge._img) {
    bridge._img = new Image();
    bridge._img.src = image;
  }

  if (bridge._img.complete) {
    const width = bridge._img.width * scale;
    const height = bridge._img.height * scale;
    const step = width * (1 - overlap);

    ctx.save();

    for (let x = 0; x < cssW + width; x += step) {
      ctx.drawImage(bridge._img, x, y - height / 2, width, height);
    }

    if (text) {
      ctx.font = `${txtsize}px 'Modak', sans-serif`;
      ctx.fillStyle = "#FFFFF0";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const lines = Array.isArray(text) ? text : text.split("\n");
      const lineHeight = txtsize * 1.2;

      lines.forEach((line, i) => {
        ctx.fillText(line, cssW / 2, y - height / 2 + 50 + i * lineHeight);
      });
    }

    ctx.restore();
  }
}
