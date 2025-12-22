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

  // Draw the log image
  ctx.drawImage(image, -width / 2, -height / 2, width, height);

  // Draw multi-line text
  if (text) {
    const paddingX = 80;  // horizontal padding from log edge
    const paddingY = 15;  // vertical padding from top of log
    const lineHeight = 110; // space between lines

    
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
