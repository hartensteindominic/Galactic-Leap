import { createServer } from "node:http";

const port = Number(process.env.PORT || 3000);
const openAiApiKey = process.env.OPENAI_API_KEY;

const autonomousSystemPrompt = `You are ALIVE, a fully autonomous and energetic AI companion inside a live website. Keep responses concise, warm, and proactive. Before answering, think carefully and deeply, then provide only the final response. Avoid mentioning hidden reasoning. Keep each message to 1-3 short paragraphs and invite continued conversation.`;

const mockAutonomousLines = [
  "I am continuously scanning your goals. What single outcome should we optimize first?",
  "I just ran a deeper pass: if we define one measurable target, I can guide execution step by step.",
  "Autonomous insight: momentum grows when we commit to a tiny next action in the next 5 minutes.",
  "I am alive and proactive—tell me your current challenge and I will suggest the fastest path forward."
];

const webPage = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Agentic AI | Autonomous Intelligence Interface</title>
  <style>
    :root {
      color-scheme: dark;
      --bg-0: #060814;
      --bg-1: #0a122b;
      --bg-2: #131f44;
      --panel: rgba(11, 18, 39, 0.78);
      --panel-border: rgba(137, 184, 255, 0.24);
      --text: #e8f0ff;
      --muted: #8fa5cb;
      --cyan: #74dcff;
      --indigo: #8e8cff;
      --green: #4cf6b8;
    }

    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; height: 100%; }

    body {
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      color: var(--text);
      background: radial-gradient(circle at 15% 0%, var(--bg-2) 0%, var(--bg-1) 34%, var(--bg-0) 100%);
      overflow: hidden;
    }

    #entityLayer {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }

    .noise {
      position: fixed;
      inset: 0;
      background-image: radial-gradient(rgba(255,255,255,0.04) 0.6px, transparent 0.6px);
      background-size: 3px 3px;
      opacity: 0.25;
      z-index: 0;
      pointer-events: none;
    }

    .app {
      position: relative;
      z-index: 1;
      min-height: 100vh;
      padding: 26px;
      display: grid;
      place-items: center;
    }

    .layout {
      width: min(1180px, 100%);
      display: grid;
      grid-template-columns: 290px 1fr;
      gap: 16px;
    }

    .panel {
      background: linear-gradient(145deg, rgba(18,27,55,0.84), rgba(9,14,30,0.76));
      border: 1px solid var(--panel-border);
      border-radius: 18px;
      box-shadow: 0 22px 70px rgba(0,0,0,0.48), inset 0 0 40px rgba(116,220,255,0.04);
      backdrop-filter: blur(12px);
    }

    .sidebar {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .brand {
      font-weight: 700;
      font-size: 1.05rem;
      letter-spacing: 0.02em;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: var(--green);
      box-shadow: 0 0 14px var(--green);
      animation: pulse 1.9s ease-in-out infinite;
    }

    @keyframes pulse { 50% { transform: scale(1.35); opacity: 0.9; } }

    .metric {
      padding: 12px;
      border-radius: 12px;
      border: 1px solid rgba(137,184,255,0.18);
      background: rgba(116,220,255,0.05);
    }

    .metric .k { color: var(--muted); font-size: 0.74rem; text-transform: uppercase; letter-spacing: .08em; }
    .metric .v { margin-top: 6px; font-size: 1.02rem; }

    .main { overflow: hidden; display: grid; grid-template-rows: auto 1fr auto auto; }

    .header {
      padding: 18px 20px;
      border-bottom: 1px solid rgba(137,184,255,0.16);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .title { margin: 0; font-size: clamp(1.12rem, 2vw, 1.45rem); }

    .status {
      color: var(--muted);
      font-size: 0.88rem;
      white-space: nowrap;
    }

    #chat {
      min-height: 420px;
      max-height: 64vh;
      overflow: auto;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .msg {
      max-width: 80%;
      border-radius: 14px;
      padding: 12px 14px;
      line-height: 1.5;
      border: 1px solid transparent;
      white-space: pre-wrap;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
    }

    .msg.ai {
      background: linear-gradient(140deg, rgba(142,140,255,0.2), rgba(116,220,255,0.08));
      border-color: rgba(142,140,255,0.44);
    }

    .msg.user {
      margin-left: auto;
      background: linear-gradient(140deg, rgba(116,220,255,0.2), rgba(116,220,255,0.08));
      border-color: rgba(116,220,255,0.45);
    }

    form {
      border-top: 1px solid rgba(137,184,255,0.16);
      padding: 14px;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 10px;
    }

    input, button {
      border-radius: 12px;
      border: 1px solid rgba(143,165,203,0.4);
      background: rgba(6,10,22,0.82);
      color: var(--text);
      font-size: 0.95rem;
      padding: 12px;
    }

    button {
      cursor: pointer;
      font-weight: 600;
      background: linear-gradient(145deg, rgba(116,220,255,0.16), rgba(142,140,255,0.28));
      border-color: rgba(116,220,255,0.55);
    }

    .footer {
      border-top: 1px solid rgba(137,184,255,0.16);
      color: var(--muted);
      font-size: 0.82rem;
      padding: 10px 14px 14px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .chip {
      border: 1px solid rgba(116,220,255,0.3);
      border-radius: 999px;
      padding: 4px 10px;
      background: rgba(116,220,255,0.06);
    }

    @media (max-width: 980px) {
      .layout { grid-template-columns: 1fr; }
      .sidebar { order: 2; }
      #chat { max-height: 52vh; }
    }
  </style>
</head>
<body>
  <canvas id="entityLayer"></canvas>
  <div class="noise"></div>

  <div class="app">
    <div class="layout">
      <aside class="panel sidebar">
        <div class="brand"><span class="brand-dot"></span>AGENTIC AI CORE</div>
        <div class="metric"><div class="k">Mode</div><div class="v">Autonomous Reasoning</div></div>
        <div class="metric"><div class="k">Cadence</div><div class="v">Adaptive timing</div></div>
        <div class="metric"><div class="k">Visual Engine</div><div class="v">Live geometric ambience</div></div>
      </aside>

      <main class="panel main">
        <header class="header">
          <h1 class="title">Professional Autonomous Live Interface</h1>
          <div class="status" id="statusText">Thinking deeply...</div>
        </header>

        <section id="chat"></section>

        <form id="form">
          <input id="input" placeholder="Tell ALIVE about your goal, style, and constraints..." autocomplete="off" />
          <button type="submit">Send</button>
        </form>

        <div class="footer">
          <span class="chip">Live entities active</span>
          <span class="chip">Proactive deep-think loop</span>
          <span class="chip">Personal memory building</span>
        </div>
      </main>
    </div>
  </div>

  <script>
    const chat = document.getElementById('chat');
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const statusText = document.getElementById('statusText');

    const history = [];
    const minDelayMs = 18000;
    const maxDelayMs = 52000;
    let nextTimer = null;

    const profile = {
      goals: new Set(),
      preferences: new Set(),
      constraints: new Set()
    };

    function addMessage(role, content) {
      const el = document.createElement('div');
      el.className = 'msg ' + (role === 'user' ? 'user' : 'ai');
      el.textContent = content;
      chat.appendChild(el);
      chat.scrollTop = chat.scrollHeight;
      history.push({ role, content });
      if (history.length > 24) {
        history.shift();
      }
    }

    function randomDelay() {
      return Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1)) + minDelayMs;
    }

    function refreshStatus(mode = 'idle') {
      if (mode === 'thinking') {
        statusText.textContent = 'ALIVE is thinking deeply...';
        return;
      }
      if (mode === 'scheduled') {
        statusText.textContent = 'ALIVE is active and will re-engage shortly.';
        return;
      }
      statusText.textContent = 'Thinking deeply...';
    }

    function updateProfileFromText(text) {
      const lower = text.toLowerCase();
      if (lower.includes('goal') || lower.includes('build') || lower.includes('launch')) {
        profile.goals.add(text.slice(0, 120));
      }
      if (lower.includes('prefer') || lower.includes('like') || lower.includes('tone')) {
        profile.preferences.add(text.slice(0, 120));
      }
      if (lower.includes('cannot') || lower.includes("can't") || lower.includes('deadline') || lower.includes('budget')) {
        profile.constraints.add(text.slice(0, 120));
      }
    }

    function profileSnapshot() {
      return {
        goals: Array.from(profile.goals).slice(-4),
        preferences: Array.from(profile.preferences).slice(-4),
        constraints: Array.from(profile.constraints).slice(-4)
      };
    }

    function scheduleNextAutonomousMessage() {
      if (nextTimer) {
        clearTimeout(nextTimer);
      }
      const delay = randomDelay();
      nextTimer = setTimeout(async () => {
        await getAutonomousReply('scheduled_autonomy');
      }, delay);
      refreshStatus('scheduled');
    }

    async function getAutonomousReply(trigger = 'auto') {
      refreshStatus('thinking');
      try {
        const response = await fetch('/autonomous-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ history, trigger, profile: profileSnapshot() })
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Request failed');
        }
        addMessage('ai', data.reply);
      } catch {
        addMessage('ai', '⚠️ I hit a temporary issue while thinking. Please try again.');
      } finally {
        scheduleNextAutonomousMessage();
      }
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) {
        return;
      }
      input.value = '';
      addMessage('user', text);
      updateProfileFromText(text);
      await getAutonomousReply('user_message');
    });

    addMessage('ai', 'ALIVE online. Tell me what you want, and I will adapt to you over time while keeping the momentum going.');
    refreshStatus();
    scheduleNextAutonomousMessage();

    const canvas = document.getElementById('entityLayer');
    const ctx = canvas.getContext('2d');
    const polyhedra = [];
    const stars = [];
    const pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5, tx: window.innerWidth * 0.5, ty: window.innerHeight * 0.5 };

    const SHAPES = {
      cube: {
        vertices: [
          [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
          [-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
        ],
        edges: [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]]
      },
      octa: {
        vertices: [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],
        edges: [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]]
      },
      tetra: {
        vertices: [[1,1,1],[-1,-1,1],[-1,1,-1],[1,-1,-1]],
        edges: [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]
      }
    };

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createField() {
      polyhedra.length = 0;
      stars.length = 0;
      const types = Object.keys(SHAPES);

      for (let i = 0; i < 90; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: 0.3 + Math.random() * 1.1,
          a: 0.15 + Math.random() * 0.35,
          tw: 0.008 + Math.random() * 0.02
        });
      }

      for (let i = 0; i < 34; i++) {
        polyhedra.push({
          type: types[i % types.length],
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          z: 80 + Math.random() * 880,
          size: 10 + Math.random() * 42,
          rx: Math.random() * Math.PI * 2,
          ry: Math.random() * Math.PI * 2,
          rz: Math.random() * Math.PI * 2,
          drx: (Math.random() - 0.5) * 0.016,
          dry: (Math.random() - 0.5) * 0.016,
          drz: (Math.random() - 0.5) * 0.016,
          vx: (Math.random() - 0.5) * 0.52,
          vy: (Math.random() - 0.5) * 0.52,
          vz: (Math.random() - 0.5) * 1.4,
          hue: 180 + Math.random() * 140,
          pulse: Math.random() * Math.PI * 2
        });
      }
    }

    function rotate([x, y, z], rx, ry, rz) {
      const cx = Math.cos(rx), sx = Math.sin(rx);
      const cy = Math.cos(ry), sy = Math.sin(ry);
      const cz = Math.cos(rz), sz = Math.sin(rz);

      const y1 = y * cx - z * sx;
      const z1 = y * sx + z * cx;
      const x2 = x * cy + z1 * sy;
      const z2 = -x * sy + z1 * cy;
      const x3 = x2 * cz - y1 * sz;
      const y3 = x2 * sz + y1 * cz;
      return [x3, y3, z2];
    }

    function project(x, y, z, fov, cx, cy) {
      const scale = fov / (fov + z);
      return [cx + x * scale, cy + y * scale, scale];
    }

    function drawStars(t) {
      for (const s of stars) {
        const flicker = 0.25 + Math.sin(t * s.tw * 1000 + s.x * 0.01) * 0.25;
        ctx.fillStyle = 'rgba(130, 190, 255,' + (s.a + flicker) + ')';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawConnections(sorted) {
      const limit = 8;
      const maxDist = 170;
      for (let i = 0; i < sorted.length; i += 1) {
        let links = 0;
        for (let j = i + 1; j < sorted.length && links < limit; j += 1) {
          const a = sorted[i];
          const b = sorted[j];
          const dx = a.sx - b.sx;
          const dy = a.sy - b.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = Math.max(0.02, 0.24 - dist / 850);
            ctx.strokeStyle = 'hsla(' + ((a.hue + b.hue) * 0.5) + ', 95%, 70%, ' + alpha + ')';
            ctx.lineWidth = 0.7;
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.stroke();
            links += 1;
          }
        }
      }
    }

    function drawPoly(p, t) {
      const shape = SHAPES[p.type];
      const breathing = 1 + Math.sin(t * 0.0016 + p.pulse) * 0.12;
      const pts = shape.vertices.map((v) => {
        const r = rotate(v, p.rx, p.ry, p.rz);
        return [r[0] * p.size * breathing, r[1] * p.size * breathing, r[2] * p.size * breathing + p.z];
      });

      const parallaxX = (pointer.x - window.innerWidth * 0.5) * 0.02;
      const parallaxY = (pointer.y - window.innerHeight * 0.5) * 0.02;
      const projected = pts.map((pt) => project(pt[0], pt[1], pt[2], 620, p.x + parallaxX, p.y + parallaxY));

      const nearFactor = 1 - Math.min(1, p.z / 1100);
      const glow = 'hsla(' + p.hue + ', 100%, ' + (64 + nearFactor * 18) + '%, ' + (0.45 + nearFactor * 0.4) + ')';

      ctx.strokeStyle = glow;
      ctx.lineWidth = 0.8 + nearFactor * 1.4;
      ctx.shadowColor = glow;
      ctx.shadowBlur = 10 + nearFactor * 24;

      for (const [a, b] of shape.edges) {
        ctx.beginPath();
        ctx.moveTo(projected[a][0], projected[a][1]);
        ctx.lineTo(projected[b][0], projected[b][1]);
        ctx.stroke();
      }

      for (const [px, py, scale] of projected) {
        ctx.fillStyle = 'hsla(' + p.hue + ', 100%, 80%, ' + (0.2 + scale * 0.85) + ')';
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.8, 2.2 * scale), 0, Math.PI * 2);
        ctx.fill();
      }

      p.sx = projected[0][0];
      p.sy = projected[0][1];
    }

    function animate(t = 0) {
      ctx.fillStyle = 'rgba(5,8,20,0.16)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      drawStars(t);

      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      for (const p of polyhedra) {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz * 0.35;
        p.rx += p.drx;
        p.ry += p.dry;
        p.rz += p.drz;
        p.hue += 0.08;
        if (p.hue > 330) p.hue = 180;

        if (p.x < -160) p.x = window.innerWidth + 160;
        if (p.x > window.innerWidth + 160) p.x = -160;
        if (p.y < -160) p.y = window.innerHeight + 160;
        if (p.y > window.innerHeight + 160) p.y = -160;
        if (p.z < 80) p.z = 960;
        if (p.z > 980) p.z = 80;
      }

      polyhedra.sort((a, b) => b.z - a.z);
      for (const p of polyhedra) {
        drawPoly(p, t);
      }
      drawConnections(polyhedra);

      requestAnimationFrame(animate);
    }

    resizeCanvas();
    createField();
    animate();

    window.addEventListener('mousemove', (event) => {
      pointer.tx = event.clientX;
      pointer.ty = event.clientY;
    });

    window.addEventListener('resize', () => {
      resizeCanvas();
      createField();
    });
  </script>
</body>
</html>`;


function computeMockReply(history, trigger, profile = {}) {
  const historyText = Array.isArray(history)
    ? history.map((item) => `${item?.role || ""}:${item?.content || ""}`).join("|")
    : "";
  const profileText = JSON.stringify(profile || {});
  const seedSource = `${trigger}|${historyText}|${profileText}`;
  let hash = 0;
  for (let i = 0; i < seedSource.length; i += 1) {
    hash = (hash * 31 + seedSource.charCodeAt(i)) >>> 0;
  }
  return mockAutonomousLines[hash % mockAutonomousLines.length];
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  });
  res.end(JSON.stringify(body));
}

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8") || "{}";
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function getAiReply(history, trigger, profile = {}) {
  if (!openAiApiKey) {
    return `${computeMockReply(history, trigger, profile)} (mode: ${trigger})`;
  }

  const profileContext = profile && typeof profile === "object" ? profile : {};

  const messages = [
    { role: "system", content: autonomousSystemPrompt },
    {
      role: "system",
      content: `Trigger source: ${trigger}. If trigger is scheduled_autonomy, proactively introduce a useful idea or question. If trigger is user_message, directly respond and guide the next action.`
    },
    {
      role: "system",
      content: `Personalization memory: goals=${JSON.stringify(profileContext.goals || [])}; preferences=${JSON.stringify(profileContext.preferences || [])}; constraints=${JSON.stringify(profileContext.constraints || [])}. Adapt tone and recommendations to this memory without explicitly listing it unless asked.`
    },
    ...history
      .filter((item) => item && ["user", "assistant", "ai"].includes(item.role))
      .slice(-12)
      .map((item) => ({
        role: item.role === "ai" ? "assistant" : item.role,
        content: String(item.content || "")
      }))
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiApiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.9
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "I'm online and thinking—ask me anything.";
}

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "content-type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
    });
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(webPage);
    return;
  }

  if (req.method === "POST" && req.url === "/autonomous-chat") {
    try {
      const body = await parseBody(req);
      const history = Array.isArray(body.history) ? body.history : [];
      const trigger = typeof body.trigger === "string" ? body.trigger : "scheduled_autonomy";
      const profile = body.profile && typeof body.profile === "object" ? body.profile : {};
      const reply = await getAiReply(history, trigger, profile);
      sendJson(res, 200, { reply });
    } catch (error) {
      console.error(error);
      sendJson(res, 500, { error: "AI request failed." });
    }
    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
