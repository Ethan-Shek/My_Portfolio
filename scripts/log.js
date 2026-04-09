export function drawLog(ctx, log, time) {
  const { x, y, width = 200, height = 80, image, rotationSpeed = 0.0004, text, txtsize} = log;
  if (log.rotation === undefined) log.rotation = 0;

  log.rotation += rotationSpeed * time * 0.5;

  // Floating motion
  const floatX = x + Math.sin(time / 4000 + x) * 6;
  const floatY = y + Math.cos(time / 5000 + y) * 5;

  ctx.save();
  ctx.translate(floatX, floatY);
  ctx.rotate(log.rotation);

  // Draw the log image (guard against image not loaded or missing)
  if (!image || !image.complete || !image.naturalWidth) {
    ctx.restore();
    return;
  }
  ctx.drawImage(image, -width / 2, -height / 2, width, height);

  // Draw multi-line text
  if (text) {
    const paddingX = log.textOffsetX !== undefined ? log.textOffsetX : 80;
    const paddingY = log.textOffsetY !== undefined ? log.textOffsetY : 15;
    const lineHeight = log.textLineHeight !== undefined ? log.textLineHeight : 110;

    
    ctx.font = `${txtsize}px 'Modak', sans-serif`;
    ctx.fillStyle = "#F1E9D6";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    // Split text by newlines if text is a string, or use array
    const lines = Array.isArray(text) ? text : text.split("\n");
    lines.forEach((line, i) => {
      ctx.fillText(line, -width / 2 + paddingX, -height / 2 + paddingY + i * lineHeight);
    });
  }

  ctx.restore();
}
