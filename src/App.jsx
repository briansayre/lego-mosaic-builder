import React, { useState, useRef, useCallback, useEffect } from 'react';

const SETS = {
  'Any': {
    1: { name: 'white', rgb: [255, 255, 255], count: 2304, bricklinkColor: 1 },
    2: { name: 'light_grey', rgb: [180, 180, 180], count: 2304, bricklinkColor: 86 },
    3: { name: 'grey', rgb: [128, 128, 128], count: 2304, bricklinkColor: 9 },
    4: { name: 'dark_grey', rgb: [70, 70, 70], count: 2304, bricklinkColor: 85 },
    5: { name: 'black', rgb: [10, 10, 10], count: 2304, bricklinkColor: 11 },
    6: { name: 'light_red', rgb: [255, 130, 130], count: 2304, bricklinkColor: 26 },
    7: { name: 'red', rgb: [215, 0, 8], count: 2304, bricklinkColor: 5 },
    8: { name: 'dark_red', rgb: [130, 0, 0], count: 2304, bricklinkColor: 59 },
    9: { name: 'light_orange', rgb: [255, 190, 125], count: 2304, bricklinkColor: 31 },
    10: { name: 'orange', rgb: [238, 117, 0], count: 2304, bricklinkColor: 4 },
    11: { name: 'dark_orange', rgb: [165, 70, 0], count: 2304, bricklinkColor: 68 },
    12: { name: 'light_yellow', rgb: [255, 250, 180], count: 2304, bricklinkColor: 33 },
    13: { name: 'yellow', rgb: [254, 196, 0], count: 2304, bricklinkColor: 3 },
    14: { name: 'dark_yellow', rgb: [180, 140, 0], count: 2304, bricklinkColor: 161 },
    15: { name: 'light_green', rgb: [150, 220, 150], count: 2304, bricklinkColor: 38 },
    16: { name: 'green', rgb: [0, 150, 50], count: 2304, bricklinkColor: 6 },
    17: { name: 'dark_green', rgb: [0, 90, 30], count: 2304, bricklinkColor: 80 },
    18: { name: 'light_blue', rgb: [150, 200, 255], count: 2304, bricklinkColor: 62 },
    19: { name: 'blue', rgb: [0, 87, 166], count: 2304, bricklinkColor: 7 },
    20: { name: 'navy', rgb: [0, 40, 90], count: 2304, bricklinkColor: 63 },
    21: { name: 'light_purple', rgb: [200, 160, 220], count: 2304, bricklinkColor: 44 },
    22: { name: 'purple', rgb: [130, 50, 180], count: 2304, bricklinkColor: 24 },
    23: { name: 'dark_purple', rgb: [70, 20, 100], count: 2304, bricklinkColor: 89 },
    24: { name: 'light_pink', rgb: [255, 200, 220], count: 2304, bricklinkColor: 56 },
    25: { name: 'pink', rgb: [230, 100, 150], count: 2304, bricklinkColor: 104 },
    26: { name: 'dark_pink', rgb: [170, 50, 100], count: 2304, bricklinkColor: 47 },
    27: { name: 'light_brown', rgb: [180, 130, 90], count: 2304, bricklinkColor: 150 },
    28: { name: 'brown', rgb: [130, 80, 50], count: 2304, bricklinkColor: 88 },
    29: { name: 'dark_brown', rgb: [70, 40, 20], count: 2304, bricklinkColor: 120 }
  },
  'The Sith': {
    1: { name: 'black', rgb: [10, 10, 10], count: 877 },
    2: { name: 'titanium', rgb: [168, 63, 58], count: 271 },
    3: { name: 'dark_grey', rgb: [102, 101, 97], count: 151 },
    4: { name: 'stone_grey', rgb: [167, 166, 163], count: 110 },
    5: { name: 'sand_blue', rgb: [108, 134, 157], count: 139 },
    6: { name: 'earth_blue', rgb: [1, 53, 91], count: 447 },
    7: { name: 'white', rgb: [255, 255, 255], count: 187 },
    8: { name: 'cool_yellow', rgb: [255, 243, 115], count: 92 },
    9: { name: 'bright_orange', rgb: [238, 117, 0], count: 125 },
    10: { name: 'bright_red', rgb: [215, 0, 8], count: 286 },
    11: { name: 'dark_maroon', rgb: [131, 15, 16], count: 328 },
    12: { name: 'dark_brown', rgb: [63, 27, 13], count: 200 }
  }
};

let COLOR_PALETTE = SETS['The Sith'];

const colorDistance = (c1, c2) => Math.sqrt((c1[0]-c2[0])**2 + (c1[1]-c2[1])**2 + (c1[2]-c2[2])**2);

const rgbToLab = (r, g, b) => {
  let rr = r/255, gg = g/255, bb = b/255;
  rr = rr > 0.04045 ? Math.pow((rr+0.055)/1.055, 2.4) : rr/12.92;
  gg = gg > 0.04045 ? Math.pow((gg+0.055)/1.055, 2.4) : gg/12.92;
  bb = bb > 0.04045 ? Math.pow((bb+0.055)/1.055, 2.4) : bb/12.92;
  let x = (rr*0.4124+gg*0.3576+bb*0.1805)/0.95047;
  let y = (rr*0.2126+gg*0.7152+bb*0.0722)/1.00000;
  let z = (rr*0.0193+gg*0.1192+bb*0.9505)/1.08883;
  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787*x)+16/116;
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787*y)+16/116;
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787*z)+16/116;
  return [(116*y)-16, 500*(x-y), 200*(y-z)];
};

const shuffle = (arr, seed) => {
  const result = [...arr];
  let m = result.length, t, i;
  const random = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  while (m) { i = Math.floor(random() * m--); t = result[m]; result[m] = result[i]; result[i] = t; }
  return result;
};

const strategies = {
  color_matching: (pixels, seed) => {
    const remaining = {};
    Object.entries(COLOR_PALETTE).forEach(([k, v]) => remaining[k] = v.count);
    const result = new Array(pixels.length);
    const indices = shuffle([...Array(pixels.length).keys()], seed);
    for (const idx of indices) {
      const p = pixels[idx];
      let bestKey = null, bestDist = Infinity;
      Object.entries(COLOR_PALETTE).forEach(([k, v]) => {
        if (remaining[k] > 0) {
          const d = colorDistance(p, v.rgb);
          if (d < bestDist) { bestDist = d; bestKey = k; }
        }
      });
      if (bestKey) { result[idx] = parseInt(bestKey); remaining[bestKey]--; }
      else { result[idx] = 1; }
    }
    return result;
  },
  floyd_steinberg: (pixels, _, width) => {
    const remaining = {};
    Object.entries(COLOR_PALETTE).forEach(([k, v]) => remaining[k] = v.count);
    const result = new Array(pixels.length);
    const working = pixels.map(p => [...p]);
    for (let i = 0; i < pixels.length; i++) {
      const p = working[i];
      let bestKey = null, bestDist = Infinity;
      Object.entries(COLOR_PALETTE).forEach(([k, v]) => {
        const d = colorDistance(p, v.rgb);
        if (remaining[k] > 0 && d < bestDist) { bestDist = d; bestKey = k; }
      });
      if (!bestKey) bestKey = '1';
      result[i] = parseInt(bestKey);
      remaining[bestKey]--;
      const newC = COLOR_PALETTE[bestKey].rgb;
      const err = [p[0]-newC[0], p[1]-newC[1], p[2]-newC[2]];
      const x = i % width, y = Math.floor(i / width);
      if (x + 1 < width) for (let c = 0; c < 3; c++) working[i+1][c] += err[c] * 7/16;
      if (y + 1 < 48) {
        if (x > 0) for (let c = 0; c < 3; c++) working[i+width-1][c] += err[c] * 3/16;
        for (let c = 0; c < 3; c++) working[i+width][c] += err[c] * 5/16;
        if (x + 1 < width) for (let c = 0; c < 3; c++) working[i+width+1][c] += err[c] * 1/16;
      }
    }
    return result;
  },
  perceptual_lab: (pixels, seed) => {
    const remaining = {};
    Object.entries(COLOR_PALETTE).forEach(([k, v]) => remaining[k] = v.count);
    const result = new Array(pixels.length);
    const pixelsLab = pixels.map(p => rgbToLab(...p));
    const paletteLab = {};
    Object.entries(COLOR_PALETTE).forEach(([k, v]) => paletteLab[k] = rgbToLab(...v.rgb));
    const indices = shuffle([...Array(pixels.length).keys()], seed);
    for (const idx of indices) {
      const pLab = pixelsLab[idx];
      let bestKey = null, bestDist = Infinity;
      Object.entries(paletteLab).forEach(([k, lab]) => {
        if (remaining[k] > 0) {
          const d = colorDistance(pLab, lab);
          if (d < bestDist) { bestDist = d; bestKey = k; }
        }
      });
      if (bestKey) { result[idx] = parseInt(bestKey); remaining[bestKey]--; }
      else { result[idx] = 1; }
    }
    return result;
  },
  brightness_priority: (pixels, seed) => {
    const remaining = {};
    Object.entries(COLOR_PALETTE).forEach(([k, v]) => remaining[k] = v.count);
    const result = new Array(pixels.length);
    const brightness = p => 0.299*p[0] + 0.587*p[1] + 0.114*p[2];
    const paletteBright = {};
    Object.entries(COLOR_PALETTE).forEach(([k, v]) => paletteBright[k] = brightness(v.rgb));
    const indices = shuffle([...Array(pixels.length).keys()], seed);
    for (const idx of indices) {
      const pBright = brightness(pixels[idx]);
      let bestKey = null, bestScore = Infinity;
      Object.entries(COLOR_PALETTE).forEach(([k, v]) => {
        if (remaining[k] > 0) {
          const bDiff = Math.abs(paletteBright[k] - pBright);
          const cDiff = colorDistance(pixels[idx], v.rgb);
          const score = 0.7 * bDiff + 0.3 * cDiff;
          if (score < bestScore) { bestScore = score; bestKey = k; }
        }
      });
      if (bestKey) { result[idx] = parseInt(bestKey); remaining[bestKey]--; }
      else { result[idx] = 1; }
    }
    return result;
  },
  ordered_dithering: (pixels) => {
    const bayer = [[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(r => r.map(v => v/16));
    const remaining = {};
    Object.entries(COLOR_PALETTE).forEach(([k, v]) => remaining[k] = v.count);
    const result = new Array(pixels.length);
    for (let i = 0; i < pixels.length; i++) {
      const x = i % 48, y = Math.floor(i / 48);
      const thresh = bayer[y % 4][x % 4];
      const dithered = pixels[i].map(c => Math.max(0, Math.min(255, c + (thresh - 0.5) * 20)));
      let bestKey = null, bestDist = Infinity;
      Object.entries(COLOR_PALETTE).forEach(([k, v]) => {
        if (remaining[k] > 0) {
          const d = colorDistance(dithered, v.rgb);
          if (d < bestDist) { bestDist = d; bestKey = k; }
        }
      });
      if (bestKey) { result[i] = parseInt(bestKey); remaining[bestKey]--; }
      else { result[i] = 1; }
    }
    return result;
  },
  smart_adaptive: (pixels, seed) => {
    const remaining = {};
    Object.entries(COLOR_PALETTE).forEach(([k, v]) => remaining[k] = v.count);
    const result = new Array(pixels.length);
    const brightness = p => 0.299*p[0] + 0.587*p[1] + 0.114*p[2];
    const gray = pixels.map(brightness);
    const colorGroups = { dark: ['1', '11', '12', '6'], medium: ['3', '2', '5', '4'], bright: ['10', '9', '8', '7'] };
    const indices = shuffle([...Array(pixels.length).keys()], seed);
    for (const idx of indices) {
      const p = pixels[idx], g = gray[idx];
      const preferredGroup = g < 85 ? 'dark' : g < 170 ? 'medium' : 'bright';
      const groupColors = colorGroups[preferredGroup];
      let bestKey = null, bestDist = Infinity;
      for (const k of groupColors) {
        if (remaining[k] > 0) {
          const d = colorDistance(p, COLOR_PALETTE[k].rgb);
          if (d < bestDist) { bestDist = d; bestKey = k; }
        }
      }
      if (!bestKey) {
        Object.keys(COLOR_PALETTE).forEach(k => {
          if (remaining[k] > 0) {
            const d = colorDistance(p, COLOR_PALETTE[k].rgb);
            if (d < bestDist) { bestDist = d; bestKey = k; }
          }
        });
      }
      if (bestKey) { result[idx] = parseInt(bestKey); remaining[bestKey]--; }
      else { result[idx] = 1; }
    }
    return result;
  },
  weighted_depletion: (pixels, seed) => {
    const target = {}, remaining = {};
    Object.entries(COLOR_PALETTE).forEach(([k, v]) => { target[k] = v.count; remaining[k] = v.count; });
    const result = new Array(pixels.length);
    const totalPx = pixels.length;
    const indices = shuffle([...Array(pixels.length).keys()], seed);
    indices.forEach((idx, i) => {
      const p = pixels[idx];
      const pxRemaining = totalPx - i;
      let bestKey = null, bestScore = Infinity;
      Object.entries(COLOR_PALETTE).forEach(([k, v]) => {
        const dist = colorDistance(p, v.rgb);
        const expected = target[k] * (pxRemaining / totalPx);
        let penalty = remaining[k] > 0 ? Math.max(0, expected - remaining[k]) * 50 : 1000000;
        const score = dist + penalty;
        if (score < bestScore) { bestScore = score; bestKey = k; }
      });
      if (bestKey && remaining[bestKey] > 0) {
        result[idx] = parseInt(bestKey);
        remaining[bestKey]--;
      } else {
        let fallback = null, fallbackDist = Infinity;
        Object.entries(COLOR_PALETTE).forEach(([k, v]) => {
          if (remaining[k] > 0) {
            const d = colorDistance(p, v.rgb);
            if (d < fallbackDist) { fallbackDist = d; fallback = k; }
          }
        });
        result[idx] = parseInt(fallback || '1');
        if (fallback) remaining[fallback]--;
      }
    });
    return result;
  }
};

const STRATEGY_INFO = {
  color_matching: 'Closest color match in RGB space',
  floyd_steinberg: 'Error diffusion for smooth gradients',
  perceptual_lab: 'LAB color space for accuracy',
  brightness_priority: 'Prioritizes luminance over hue',
  ordered_dithering: 'Bayer matrix pattern',
  smart_adaptive: 'Brightness-grouped color selection',
  weighted_depletion: 'Balances distance with inventory'
};

function ImageCropper({ image, onCrop, onCancel }) {
  const containerRef = useRef(null);
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, size: 100 });
  const [dragging, setDragging] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cropX: 0, cropY: 0, cropSize: 0 });

  useEffect(() => {
    if (!containerRef.current || !image) return;
    const maxW = Math.min(containerRef.current.offsetWidth - 32, 500);
    const maxH = window.innerHeight * 0.5;
    const scale = Math.min(maxW / image.width, maxH / image.height, 1);
    const w = image.width * scale;
    const h = image.height * scale;
    setDisplaySize({ width: w, height: h });
    const size = Math.min(w, h) * 0.8;
    setCropBox({ x: (w - size) / 2, y: (h - size) / 2, size });
  }, [image]);

  const getPos = (e) => {
    const rect = containerRef.current.querySelector('img').getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handleStart = (e, type) => {
    e.preventDefault();
    const pos = getPos(e);
    setDragging(type);
    setDragStart({ x: pos.x, y: pos.y, cropX: cropBox.x, cropY: cropBox.y, cropSize: cropBox.size });
  };

  const handleMove = useCallback((e) => {
    if (!dragging) return;
    e.preventDefault();
    const pos = getPos(e);
    const dx = pos.x - dragStart.x;
    const dy = pos.y - dragStart.y;

    setCropBox(prev => {
      if (dragging === 'move') {
        const newX = Math.max(0, Math.min(displaySize.width - prev.size, dragStart.cropX + dx));
        const newY = Math.max(0, Math.min(displaySize.height - prev.size, dragStart.cropY + dy));
        return { ...prev, x: newX, y: newY };
      } else {
        const delta = Math.max(dx, dy);
        const newSize = Math.max(50, Math.min(
          dragStart.cropSize + delta,
          displaySize.width - dragStart.cropX,
          displaySize.height - dragStart.cropY
        ));
        return { ...prev, size: newSize };
      }
    });
  }, [dragging, dragStart, displaySize]);

  const handleEnd = useCallback(() => setDragging(null), []);

  useEffect(() => {
    if (!dragging) return;
    const opts = { passive: false };
    window.addEventListener('mousemove', handleMove, opts);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, opts);
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [dragging, handleMove, handleEnd]);

  const handleCrop = () => {
    const scale = image.width / displaySize.width;
    onCrop({ x: cropBox.x * scale, y: cropBox.y * scale, size: cropBox.size * scale });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-zinc-400 text-center mb-4">Drag to position, drag corner to resize</p>
      <div ref={containerRef} className="flex justify-center">
        <div className="relative select-none touch-none" style={{ width: displaySize.width, height: displaySize.height }}>
          <img src={image.src} alt="Crop" className="w-full h-full" draggable={false} />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bg-black/60" style={{ top: 0, left: 0, right: 0, height: cropBox.y }} />
            <div className="absolute bg-black/60" style={{ top: cropBox.y + cropBox.size, left: 0, right: 0, bottom: 0 }} />
            <div className="absolute bg-black/60" style={{ top: cropBox.y, left: 0, width: cropBox.x, height: cropBox.size }} />
            <div className="absolute bg-black/60" style={{ top: cropBox.y, left: cropBox.x + cropBox.size, right: 0, height: cropBox.size }} />
          </div>
          <div
            className="absolute border-2 border-white cursor-move"
            style={{ left: cropBox.x, top: cropBox.y, width: cropBox.size, height: cropBox.size }}
            onMouseDown={(e) => handleStart(e, 'move')}
            onTouchStart={(e) => handleStart(e, 'move')}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/3 left-0 right-0 border-t border-white/40" />
              <div className="absolute top-2/3 left-0 right-0 border-t border-white/40" />
              <div className="absolute left-1/3 top-0 bottom-0 border-l border-white/40" />
              <div className="absolute left-2/3 top-0 bottom-0 border-l border-white/40" />
            </div>
            <div
              className="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full cursor-se-resize"
              onMouseDown={(e) => { e.stopPropagation(); handleStart(e, 'resize'); }}
              onTouchStart={(e) => { e.stopPropagation(); handleStart(e, 'resize'); }}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={onCancel} className="flex-1 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium">Cancel</button>
        <button onClick={handleCrop} className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium">Crop & Continue</button>
      </div>
    </div>
  );
}

export default function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [pixels, setPixels] = useState(null);
  const [result, setResult] = useState(null);
  const [strategy, setStrategy] = useState('weighted_depletion');
  const [selectedSet, setSelectedSet] = useState('The Sith');
  const [view, setView] = useState('preview');
  const [quadrant, setQuadrant] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [cropping, setCropping] = useState(false);
  const canvasRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const loadImage = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => { setOriginalImage(img); setCropping(true); };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCrop = useCallback((cropData) => {
    const canvas = hiddenCanvasRef.current;
    canvas.width = 48; canvas.height = 48;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImage, cropData.x, cropData.y, cropData.size, cropData.size, 0, 0, 48, 48);
    const data = ctx.getImageData(0, 0, 48, 48).data;
    const pxls = [];
    for (let i = 0; i < data.length; i += 4) pxls.push([data[i], data[i+1], data[i+2]]);
    setPixels(pxls);
    setCropping(false);
  }, [originalImage]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) loadImage(file);
  }, [loadImage]);

  useEffect(() => {
    if (!pixels) return;
    COLOR_PALETTE = SETS[selectedSet];
    const res = strategies[strategy](pixels, 42, 48);
    setResult(res);
  }, [pixels, strategy, selectedSet]);

  useEffect(() => {
    if (!result || !canvasRef.current || view !== 'preview') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 480; canvas.height = 480;
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 480, 480);
    for (let i = 0; i < result.length; i++) {
      const x = (i % 48) * 10 + 5, y = Math.floor(i / 48) * 10 + 5;
      const rgb = COLOR_PALETTE[result[i]].rgb;
      const grad = ctx.createRadialGradient(x-1, y-1, 0, x, y, 4);
      grad.addColorStop(0, 'rgba(255,255,255,0.25)');
      grad.addColorStop(0.5, `rgb(${rgb.join(',')})`);
      grad.addColorStop(1, 'rgba(0,0,0,0.3)');
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }, [result, view]);

  const resetAll = () => { setOriginalImage(null); setPixels(null); setResult(null); setCropping(false); };
  const colorCounts = result ? result.reduce((acc, c) => { acc[c] = (acc[c]||0) + 1; return acc; }, {}) : {};
  const activePalette = SETS[selectedSet];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-6 overflow-x-hidden">
      <canvas ref={hiddenCanvasRef} className="hidden" />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mosaic Builder</h1>

        {cropping && originalImage && (
          <ImageCropper image={originalImage} onCrop={handleCrop} onCancel={() => { setOriginalImage(null); setCropping(false); }} />
        )}

        {!pixels && !cropping && (
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-zinc-400 text-center mb-8">
              Transform any image into a buildable brick mosaic. Upload a photo and we'll convert it to a 48×48 stud design using the colors available in official LEGO Art sets, complete with building instructions and a parts list.
            </p>
            <div
              className={`rounded-2xl p-12 text-center cursor-pointer border-2 border-dashed transition-all ${dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700 hover:border-zinc-500'}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="text-5xl mb-4 opacity-50">📷</div>
              <p className="text-xl text-zinc-300 mb-2">Drop an image here or click to browse</p>
              <p className="text-sm text-zinc-500">Supports JPG, PNG, and other common formats</p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && loadImage(e.target.files[0])} />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8 text-center">
              <div className="bg-zinc-900 rounded-xl p-4">
                <div className="text-2xl mb-2">🎨</div>
                <h3 className="font-medium text-zinc-200 mb-1">7 Algorithms</h3>
                <p className="text-xs text-zinc-500">Different dithering strategies</p>
              </div>
              <div className="bg-zinc-900 rounded-xl p-4">
                <div className="text-2xl mb-2">📋</div>
                <h3 className="font-medium text-zinc-200 mb-1">Instructions</h3>
                <p className="text-xs text-zinc-500">Section-by-section guide</p>
              </div>
              <div className="bg-zinc-900 rounded-xl p-4">
                <div className="text-2xl mb-2">🧱</div>
                <h3 className="font-medium text-zinc-200 mb-1">Parts List</h3>
                <p className="text-xs text-zinc-500">Track your inventory</p>
              </div>
            </div>
          </div>
        )}

        {pixels && result && !cropping && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="bg-zinc-900 rounded-xl p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Set</label>
                  <select value={selectedSet} onChange={(e) => setSelectedSet(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-zinc-100">
                    {Object.keys(SETS).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Strategy</label>
                  <select value={strategy} onChange={(e) => setStrategy(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-zinc-100">
                    {Object.keys(strategies).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                  </select>
                  <p className="text-xs text-zinc-500 mt-2">{STRATEGY_INFO[strategy]}</p>
                </div>
              </div>
              <button onClick={resetAll} className="w-full py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium">Upload New Image</button>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="flex bg-zinc-900 rounded-xl p-1">
                {[['preview', 'Preview'], ['instructions', 'Instructions'], ['parts', 'Parts']].map(([v, label]) => (
                  <button key={v} onClick={() => setView(v)} className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${view === v ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}>{label}</button>
                ))}
              </div>

              {view === 'preview' && (
                <div className="bg-zinc-900 rounded-xl p-4 flex justify-center">
                  <div className="w-full" style={{ maxWidth: '480px' }}>
                    <canvas ref={canvasRef} className="rounded-lg w-full h-auto" />
                  </div>
                </div>
              )}

              {view === 'instructions' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(9)].map((_, i) => (
                      <button key={i} onClick={() => setQuadrant(i)} className={`py-2 rounded-lg font-medium ${quadrant === i ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
                        {Math.floor(i/3)+1}-{i%3+1}
                      </button>
                    ))}
                  </div>
                  <div className="bg-zinc-900 rounded-xl p-4">
                    <div className="grid gap-0.5 mx-auto" style={{ gridTemplateColumns: 'repeat(16, 1fr)', maxWidth: '100%' }}>
                      {[...Array(256)].map((_, i) => {
                        const qRow = Math.floor(quadrant / 3), qCol = quadrant % 3;
                        const px = qCol * 16 + (i % 16), py = qRow * 16 + Math.floor(i / 16);
                        const colorNum = result[py * 48 + px];
                        const rgb = COLOR_PALETTE[colorNum].rgb;
                        const bright = 0.299*rgb[0] + 0.587*rgb[1] + 0.114*rgb[2];
                        return (
                          <div key={i} className="aspect-square rounded-full flex items-center justify-center font-bold"
                            style={{ backgroundColor: `rgb(${rgb.join(',')})`, color: bright > 128 ? '#000' : '#fff', fontSize: '10px' }}>
                            {colorNum}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {view === 'parts' && (
                <div className="bg-zinc-900 rounded-xl p-4 space-y-3">
                  {Object.entries(activePalette).filter(([k]) => colorCounts[k] > 0).map(([k, v]) => {
                    const count = colorCounts[k], pct = (count / v.count) * 100, over = pct > 100;
                    const url = v.bricklinkColor ? `https://www.bricklink.com/v2/catalog/catalogitem.page?P=98138&C=${v.bricklinkColor}` : null;
                    return (
                      <div key={k} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: `rgb(${v.rgb.join(',')})`, color: (0.299*v.rgb[0] + 0.587*v.rgb[1] + 0.114*v.rgb[2]) > 128 ? '#000' : '#fff' }}>{k}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-zinc-300 capitalize truncate">{v.name.replace(/_/g, ' ')}</span>
                            <span className={`font-medium ${over ? 'text-red-400' : 'text-zinc-400'}`}>{count}</span>
                          </div>
                          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: over ? '#ef4444' : '#22c55e' }} />
                          </div>
                        </div>
                        {url && <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300">Buy</a>}
                      </div>
                    );
                  })}
                  <div className="flex justify-between pt-3 border-t border-zinc-800 font-medium">
                    <span>Total</span>
                    <span>{Object.values(colorCounts).reduce((a,b) => a+b, 0)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}