export function drawBridge(ctx, canvas, bridge) {
  const {
    image,
    y = canvas.height - 150, // vertical position
    scale = 1.0,
    overlap = 0.2, // fraction of width to overlap
    text = null,
    txtsize = 60
  } = bridge;

  if (!bridge._img) {
    bridge._img = new Image();
    bridge._img.src = image;
  }

  if (bridge._img.complete && bridge._img.naturalWidth > 0) {
    const width = bridge._img.width * scale;
    const height = bridge._img.height * scale;
    const step = width * (1 - overlap);

    ctx.save();

    // Draw bridge PNGs tiled horizontally
    for (let x = 0; x < canvas.width + width; x += step) {
      ctx.drawImage(bridge._img, x, y - height / 2, width, height);
    }

    // Draw text (change it click link?)
    if (text) {
      ctx.font = `${txtsize}px 'Modak', sans-serif`;
      ctx.fillStyle = "#FFFFF0";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const lines = Array.isArray(text) ? text : text.split("\n");
      const lineHeight = txtsize * 1.2;

      lines.forEach((line, i) => {
        ctx.fillText(
          line,
          canvas.width / 2, // centered horizontally
          y - height / 2 + 50 + i * lineHeight // a little above the bridge surface
        );
      });
    }

    ctx.restore();
  }
}
