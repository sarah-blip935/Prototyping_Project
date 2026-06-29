const selections = {
  style: 'Gearwork Star',
  clock: 'Roman Numerals',
  finish: 'Aged Brass',
  arm: 'Riveted',
  size: 'Standard (4.5in)'
};

const finishColors = {
  'Aged Brass':    { primary: '#c8922a', secondary: '#8b6010', light: '#f0d080', dark: '#3a2010', ring: '#d4a843' },
  'Dark Bronze':   { primary: '#6b5a30', secondary: '#3a2f18', light: '#c0a860', dark: '#1a1508', ring: '#8a7840' },
  'Copper Patina': { primary: '#8b6040', secondary: '#4a6040', light: '#d08050', dark: '#1a2018', ring: '#70a870' },
  'Silver Steel':  { primary: '#a0a8b0', secondary: '#606870', light: '#d8e0e8', dark: '#202830', ring: '#c0c8d0' }
};

document.querySelectorAll('.opt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const g = btn.dataset.group;
    document.querySelectorAll(`[data-group="${g}"]`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selections[g] = btn.dataset.val;
    renderOrnament();
  });
});

function drawGear(cx, cy, r, teeth, c) {
  const toothH = r * 0.25, innerR = r * 0.75;
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 0.4) / teeth) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 0.6) / teeth) * Math.PI * 2 - Math.PI / 2;
    const a3 = ((i + 1) / teeth) * Math.PI * 2 - Math.PI / 2;
    if (i === 0) d += `M${cx + innerR * Math.cos(a0)},${cy + innerR * Math.sin(a0)}`;
    d += ` L${cx + (r + toothH) * Math.cos(a1)},${cy + (r + toothH) * Math.sin(a1)}`;
    d += ` L${cx + (r + toothH) * Math.cos(a2)},${cy + (r + toothH) * Math.sin(a2)}`;
    d += ` L${cx + innerR * Math.cos(a3)},${cy + innerR * Math.sin(a3)}`;
  }
  d += 'Z';
  return `<path d="${d}" fill="${c.primary}" stroke="${c.ring}" stroke-width="1"/>`;
}

function drawArm(cx, cy, angle, style, c, armLen) {
  const rad = (angle * Math.PI) / 180;
  const ex = cx + armLen * Math.cos(rad);
  const ey = cy + armLen * Math.sin(rad);
  const w = 10;
  const perpX = -Math.sin(rad) * w;
  const perpY = Math.cos(rad) * w;
  let extras = '';

  if (style === 'Riveted') {
    for (let t = 0.3; t <= 0.85; t += 0.2) {
      const rx2 = cx + armLen * t * Math.cos(rad);
      const ry2 = cy + armLen * t * Math.sin(rad);
      extras += `<circle cx="${rx2}" cy="${ry2}" r="3" fill="${c.ring}" stroke="${c.dark}" stroke-width="0.5"/>`;
    }
    extras += `<polygon points="${ex},${ey} ${ex + perpX * 0.5},${ey + perpY * 0.5} ${ex + Math.cos(rad) * 14},${ey + Math.sin(rad) * 14} ${ex - perpX * 0.5},${ey - perpY * 0.5}" fill="${c.primary}" stroke="${c.ring}" stroke-width="1"/>`;
  } else if (style === 'Filigree') {
    const mx = cx + armLen * 0.5 * Math.cos(rad);
    const my = cy + armLen * 0.5 * Math.sin(rad);
    extras += `<ellipse cx="${mx}" cy="${my}" rx="6" ry="3" transform="rotate(${angle} ${mx} ${my})" fill="none" stroke="${c.ring}" stroke-width="1"/>`;
    extras += `<circle cx="${ex}" cy="${ey}" r="5" fill="${c.secondary}" stroke="${c.ring}" stroke-width="1"/>`;
    extras += `<circle cx="${ex}" cy="${ey}" r="2.5" fill="${c.light}" stroke="${c.ring}" stroke-width="0.5"/>`;
  } else {
    for (let t = 0.25; t <= 0.9; t += 0.22) {
      const gx = cx + armLen * t * Math.cos(rad);
      const gy = cy + armLen * t * Math.sin(rad);
      extras += drawGear(gx, gy, 5, 8, c);
    }
  }

  return `
    <line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="${c.primary}" stroke-width="${w}" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="${c.ring}" stroke-width="1" opacity="0.4"/>
    ${extras}`;
}

function drawClock(cx, cy, r, type, c) {
  let inner = '';
  if (type === 'Roman Numerals') {
    const nums = ['XII', 'III', 'VI', 'IX'];
    const angles = [-90, 0, 90, 180];
    nums.forEach((n, i) => {
      const a = angles[i] * Math.PI / 180;
      const tx = cx + (r * 0.62) * Math.cos(a);
      const ty = cy + (r * 0.62) * Math.sin(a);
      inner += `<text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="central" font-size="8" fill="${c.light}" font-weight="500">${n}</text>`;
    });
    inner += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r * 0.5}" stroke="${c.light}" stroke-width="2" stroke-linecap="round"/>`;
    inner += `<line x1="${cx}" y1="${cy}" x2="${cx + r * 0.35}" y2="${cy}" stroke="${c.light}" stroke-width="1.5" stroke-linecap="round"/>`;
  } else if (type === 'Gear Face') {
    inner += drawGear(cx, cy, r * 0.5, 12, c);
    inner += drawGear(cx, cy, r * 0.25, 8, { ...c, primary: c.secondary });
  } else {
    const dirs = ['N', 'E', 'S', 'W'];
    const angles2 = [-90, 0, 90, 180];
    dirs.forEach((dir, i) => {
      const a = angles2[i] * Math.PI / 180;
      const tx = cx + (r * 0.62) * Math.cos(a);
      const ty = cy + (r * 0.62) * Math.sin(a);
      inner += `<text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="central" font-size="9" fill="${dir === 'N' ? c.light : c.ring}" font-weight="500">${dir}</text>`;
    });
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      inner += `<line x1="${cx + r * 0.3 * Math.cos(a)}" y1="${cy + r * 0.3 * Math.sin(a)}" x2="${cx + r * 0.45 * Math.cos(a)}" y2="${cy + r * 0.45 * Math.sin(a)}" stroke="${c.ring}" stroke-width="1"/>`;
    }
  }

  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${c.dark}" stroke="${c.primary}" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 4}" fill="${c.secondary}" stroke="${c.ring}" stroke-width="1"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 8}" fill="#2a1800" stroke="${c.ring}" stroke-width="0.5" opacity="0.8"/>
    ${inner}
    <circle cx="${cx}" cy="${cy}" r="3" fill="${c.ring}"/>`;
}

function renderOrnament() {
  const c = finishColors[selections.finish] || finishColors['Aged Brass'];
  const cx = 150, cy = 150;
  //let armAngles = [], armLen = 95;
  let armLen = 95;
if (selections.size === 'Small (3in)') armLen = 70;
else if (selections.size === 'Standard (4.5in)') armLen = 95;
else if (selections.size === 'Large (6in)') armLen = 118;
let armAngles = [];

  if (selections.style === 'Gearwork Star') armAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  else if (selections.style === 'Victorian Spiral') armAngles = [0, 60, 120, 180, 240, 300];
  else armAngles = [0, 90, 180, 270, 45, 135, 225, 315];

  let svg = `<circle cx="${cx}" cy="${cy}" r="148" fill="#1a0f00"/>`;
  armAngles.forEach(a => { svg += drawArm(cx, cy, a, selections.arm, c, armLen); });

  if (selections.style === 'Gearwork Star') {
    [45, 135, 225, 315].forEach(a => {
      const gr = (a * Math.PI) / 180;
      const gx = cx + 70 * Math.cos(gr);
      const gy = cy + 70 * Math.sin(gr);
      svg += drawGear(gx, gy, 14, 10, c);
    });
  }

  svg += drawClock(cx, cy, 45, selections.clock, c);
  svg += `<circle cx="${cx}" cy="22" r="8" fill="${c.secondary}" stroke="${c.ring}" stroke-width="1.5"/>`;
  svg += `<circle cx="${cx}" cy="22" r="4" fill="none" stroke="${c.light}" stroke-width="1"/>`;

  document.getElementById('ornament-svg').innerHTML = svg;
}

async function generateOrnament() {
  renderOrnament();
  const btn = document.getElementById('gen-btn');
  const descBox = document.getElementById('desc-box');
  const badges = document.getElementById('badges');

  btn.disabled = true;
  btn.textContent = '⚙ Generating...';
  descBox.className = 'desc-box loading';
  descBox.textContent = 'Consulting the Victorian clockmaker...';
  badges.innerHTML = '';

  const prompt = `You are a Victorian steampunk artisan. Describe this 3D printable ornament in 3 sentences max. Be poetic but concise. Style: ${selections.style}, Clock: ${selections.clock}, Finish: ${selections.finish}, Arms: ${selections.arm}, Size: ${selections.size}. Then on a new line write: SPECS: and list 3 key specs as comma separated values.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    const text = data.content[0].text;
    const parts = text.split('SPECS:');
    descBox.className = 'desc-box';
    descBox.textContent = parts[0].trim();
    if (parts[1]) {
      const specs = parts[1].trim().split(',');
      badges.innerHTML = specs.map(s => `<span class="badge">${s.trim()}</span>`).join('');
    }
  } catch (e) {
    descBox.className = 'desc-box';
    descBox.textContent = `A magnificent ${selections.style} ornament with ${selections.clock} center, crafted in ${selections.finish} with ${selections.arm} arm details. Perfect for Victorian Christmas display.`;
  }

  btn.disabled = false;
  btn.textContent = '⚙ Generate Design';
}

renderOrnament();