export function drawLilyPad(ctx, pad, time, mouse) {
  const {
    x, y,
    radius = 100,
    notchStart = 290,
    notchEnd = 335,
    innerRadius = 20,
    color = '#4CAF50',
    image = null,
    crop = null,
    lotusImage = null,
    text = null,
    txtsize = 40
  } = pad;

  const startAngle = notchStart * Math.PI / 180;
  const endAngle = notchEnd * Math.PI / 180;
  const midAngle = (startAngle + endAngle) / 2;

  // Gentle floating motion
  const floatX = x + Math.sin(time / 2000 + x) * 18;
  const floatY = y + Math.cos(time / 2500 + y) * 16;

  // Initialize scale properties
  pad.currentScale ??= 1;
  pad.targetScale ??= 1;

  // Detect hover
  const dx = mouse.x - floatX;
  const dy = mouse.y - floatY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const scaledRadius = radius * pad.currentScale;
  pad.targetScale = distance < scaledRadius ? 1.1 : 1;

  // Smooth easing
  pad.currentScale += (pad.targetScale - pad.currentScale) * 0.08;
  const scale = pad.currentScale;

  const scaledInner = innerRadius * scale;
  const drawRadius = radius * scale;

  // Draw pad shape
  ctx.beginPath();
  ctx.moveTo(
    floatX + Math.cos(midAngle) * scaledInner,
    floatY + Math.sin(midAngle) * scaledInner
  );
  ctx.arc(floatX, floatY, drawRadius, endAngle, 2 * Math.PI + startAngle, false);
  ctx.closePath();

  // Draw lily pad image or color
  if (image) {
    if (!pad._img) {
      pad._img = new Image();
      pad._img.src = image;
    }
    if (pad._img.complete && pad._img.naturalWidth > 0) {
      ctx.save();
      ctx.clip();

      const sx = crop?.sx ?? 0;
      const sy = crop?.sy ?? 0;
      const sWidth = crop?.sw ?? pad._img.width;
      const sHeight = crop?.sh ?? pad._img.height;

      ctx.drawImage(
        pad._img,
        sx, sy, sWidth, sHeight,
        floatX - drawRadius,
        floatY - drawRadius,
        drawRadius * 2,
        drawRadius * 2
      );

      ctx.restore();
    } else {
      ctx.fillStyle = color;
      ctx.fill();
    }
  } else {
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 10;
    ctx.fill();
  }

  // Draw text on lily pad if defined
  if (text) {
    ctx.save();
    ctx.font = `${txtsize}px 'Modak', sans-serif`;
    ctx.fillStyle = "#F1E9D6";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const lines = Array.isArray(text) ? text : text.split("\n");
    const lineHeight = txtsize * 1.2;

    ctx.lineWidth = 7; // outline thickness
    ctx.strokeStyle = "#D1232A"; // outline color (red accent)

    lines.forEach((line, i) => {
      const y = floatY + (i - (lines.length - 1) / 2) * lineHeight;
      ctx.strokeText(line, floatX, y); // outline
      ctx.fillText(line, floatX, y);   // fill
    });

    ctx.restore();
  }



  // Draw lotus flower on top if defined
  if (lotusImage) {
    if (!pad._lotusImg) {
      pad._lotusImg = new Image();
      pad._lotusImg.src = lotusImage;
    }

    // Use naturalWidth to check if image is loaded
    if (pad._lotusImg.complete && pad._lotusImg.naturalWidth > 0) {
      const lotusSize = drawRadius * 1.50; // scale relative to lily pad
      ctx.drawImage(
        pad._lotusImg,
        floatX - lotusSize / 2,
        floatY - lotusSize / 2,
        lotusSize,
        lotusSize
      );
    }

  }
}
