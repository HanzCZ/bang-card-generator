import type { CardParams } from "./types";

const DPI = 300;
const CARD_W = Math.round(56 * DPI / 25.4); // 661
const CARD_H = Math.round(87 * DPI / 25.4); // 1028

const FONT_SIZES = { title: 77, subtitle: 32, body: 36, value: 50, author: 20 };
const VALUE_OUTLINE = 3;

const TEMPLATES: Record<number, string> = {
  0: "./resources/templates/0_action.png",
  1: "./resources/templates/1_blue_item.png",
  2: "./resources/templates/2_green_item.png",
  3: "./resources/templates/3_character3.png",
  4: "./resources/templates/4_character4.png",
  5: "./resources/templates/5_character5.png",
  6: "./resources/templates/6_character6.png",
};

const SUITS: Record<number, string> = {
  0: "./resources/suits/hearts.png",
  1: "./resources/suits/clubs.png",
  2: "./resources/suits/diamonds.png",
  3: "./resources/suits/spades.png",
};

const CARD_VALUES = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];

// --- Image cache (static URLs only) ---
const imgCache = new Map<string, HTMLImageElement>();

function loadStaticImg(src: string): Promise<HTMLImageElement> {
  if (imgCache.has(src)) return Promise.resolve(imgCache.get(src)!);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => { imgCache.set(src, img); resolve(img); };
    img.onerror = reject;
    img.src = src;
  });
}

function loadFileImg(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(); };
    img.src = url;
  });
}

// --- Font loading ---
let fontsReady = false;

async function ensureFonts() {
  if (fontsReady) return;
  const defs = [
    ["BangTitle",    "./resources/fonts/title.ttf"],
    ["BangSubtitle", "./resources/fonts/subtitle.ttf"],
    ["BangBody",     "./resources/fonts/body.ttf"],
  ] as const;
  await Promise.all(
    defs.map(([name, url]) => new FontFace(name, `url(${url})`).load().then(f => document.fonts.add(f)))
  );
  fontsReady = true;
}

// --- Text wrap ---
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    if (!para.trim()) { lines.push(""); continue; }
    let line = "";
    for (const word of para.split(" ")) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

// --- Main generator ---
export async function generateCard(params: CardParams, forExport = false): Promise<string> {
  await ensureFonts();

  const { card_type, card_value, card_suit, title, subtitle, author, description, back_card, art, expansion_art } = params;

  const hasValueSuit = card_type <= 2;
  const hasSubtitle  = subtitle.trim().length > 0;
  const hasAuthor    = author.trim().length > 0;

  const art_x = hasValueSuit ? Math.round(0.17 * CARD_W) : Math.round(0.2 * CARD_W);
  const art_y = hasSubtitle  ? Math.round(0.20 * CARD_H) : Math.round(0.175 * CARD_H);
  const artSize     = CARD_W - 2 * art_x;
  const textStart_y = art_y + artSize + Math.round(0.02 * CARD_H);
  const textWidth   = CARD_W - 2 * art_x;

  // Load images in parallel
  const [template, border, artImg] = await Promise.all([
    loadStaticImg(TEMPLATES[card_type]),
    loadStaticImg("./resources/misc/border.png"),
    art ? loadFileImg(art) : loadStaticImg("./resources/misc/default-art.png"),
  ]);
  const expImg = expansion_art ? await loadFileImg(expansion_art) : null;

  // --- Draw face ---
  const faceCanvas = document.createElement("canvas");
  faceCanvas.width  = CARD_W;
  faceCanvas.height = CARD_H;
  const ctx = faceCanvas.getContext("2d")!;

  ctx.drawImage(template, 0, 0, CARD_W, CARD_H);

  // Title
  ctx.font = `${FONT_SIZES.title}px BangTitle`;
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(title, CARD_W / 2, Math.round(0.12 * CARD_H));

  // Subtitle
  if (hasSubtitle) {
    ctx.font = `${FONT_SIZES.subtitle}px BangSubtitle`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(subtitle.toUpperCase(), CARD_W / 2, Math.round(0.175 * CARD_H));
  }

  // Author
  if (hasAuthor) {
    ctx.font = `${FONT_SIZES.author}px BangSubtitle`;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(author.toUpperCase(), Math.round(0.87 * CARD_W), Math.round(0.92 * CARD_H));
  }

  // Artwork
  ctx.drawImage(artImg, art_x, art_y, artSize, artSize);

  // Vignette
  const vignette = ctx.createRadialGradient(
    art_x + artSize / 2, art_y + artSize / 2, artSize * 0.25,
    art_x + artSize / 2, art_y + artSize / 2, artSize * 0.72,
  );
  vignette.addColorStop(0, "rgba(255,255,255,0)");
  vignette.addColorStop(1, "rgba(255,255,255,1)");
  ctx.fillStyle = vignette;
  ctx.fillRect(art_x, art_y, artSize, artSize);

  // Expansion art
  if (expImg) {
    const expSize = Math.round(0.15 * CARD_W);
    ctx.drawImage(expImg, Math.round(0.79 * CARD_W), Math.round(0.021 * CARD_H), expSize, expSize);
  }

  // Value + suit
  if (hasValueSuit) {
    const val = card_value === "Random"
      ? CARD_VALUES[Math.floor(Math.random() * CARD_VALUES.length)]
      : card_value;

    ctx.font = `${FONT_SIZES.value}px BangSubtitle`;
    const valW = ctx.measureText(val).width;
    const mod  = val === "10" ? 14 : 8;
    const suitSize = Math.round(FONT_SIZES.value / 1.3);
    const vx = Math.round(0.11 * CARD_W);
    const vy = Math.round(0.94 * CARD_H);

    const suitImg = await loadStaticImg(SUITS[card_suit]);
    ctx.drawImage(suitImg, Math.round(vx + valW / 2 + mod), Math.round(vy - FONT_SIZES.value / 2), suitSize, suitSize);

    ctx.font = `${FONT_SIZES.value}px BangSubtitle`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "white";
    ctx.lineWidth = VALUE_OUTLINE * 2;
    ctx.lineJoin = "round";
    ctx.strokeText(val.toUpperCase(), vx, vy);
    ctx.fillStyle = "#000";
    ctx.fillText(val.toUpperCase(), vx, vy);
  }

  // Border
  ctx.drawImage(border, 0, 0, CARD_W, CARD_H);

  // Description
  ctx.font = `${FONT_SIZES.body}px BangBody`;
  ctx.fillStyle = "#000";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const lineH = FONT_SIZES.body + 3;
  let curY = textStart_y;
  for (const line of wrapText(ctx, description, textWidth)) {
    if (!line) { curY += lineH; continue; }
    ctx.fillText(line, (CARD_W - ctx.measureText(line).width) / 2, curY);
    curY += lineH;
  }

  // --- Combine with back ---
  const out = document.createElement("canvas");
  if (back_card) {
    const backSrc = hasValueSuit ? "./resources/misc/back-playing.png" : "./resources/misc/back-character.png";
    const backImg = await loadStaticImg(backSrc);
    out.width  = CARD_W * 2;
    out.height = CARD_H;
    const c = out.getContext("2d")!;
    c.fillStyle = "white";
    c.fillRect(0, 0, out.width, out.height);
    c.drawImage(faceCanvas, 0, 0);
    c.drawImage(backImg, CARD_W, 0, CARD_W, CARD_H);
    c.drawImage(border, CARD_W, 0, CARD_W, CARD_H);
  } else {
    out.width  = CARD_W;
    out.height = CARD_H;
    const c = out.getContext("2d")!;
    c.fillStyle = "white";
    c.fillRect(0, 0, CARD_W, CARD_H);
    c.drawImage(faceCanvas, 0, 0);
  }

  return forExport
    ? out.toDataURL("image/png")
    : out.toDataURL("image/jpeg", 0.85);
}

export async function downloadCard(params: CardParams): Promise<void> {
  const dataUrl = await generateCard(params, true);
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `${params.title || "card"}.png`;
  a.click();
}
