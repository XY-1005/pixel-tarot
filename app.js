const home = document.getElementById("home");
const draw = document.getElementById("draw");
const result = document.getElementById("result");

const startBtn = document.getElementById("startBtn");
const restart = document.getElementById("restart");

const deck = document.getElementById("deck");
const cardsBox = document.getElementById("cards");

let tarotData = [];

fetch("tarot.json")
  .then(r => r.json())
  .then(d => tarotData = d);

/* seed */
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) % 100000;
  }
  return h;
}

/* shuffle */
function shuffle(seed) {
  let arr = [...tarotData];
  let r = seed;

  for (let i = arr.length - 1; i > 0; i--) {
    r = (r * 9301 + 49297) % 233280;
    const j = r % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

/* 模拟AI解读 */
function aiExplain(card, gender) {
  return `AI解读（仅供参考）：
你抽到【${card.name}】。
结合你的状态，这张牌代表：${card.desc}。
当前建议：保持觉察，避免过度依赖外界判断。`;
}

/* 页面切换 */
function show(name) {
  home.classList.remove("active");
  draw.classList.remove("active");
  result.classList.remove("active");
  document.getElementById(name).classList.add("active");
}

/* 开始 */
startBtn.onclick = () => {
  const b = document.getElementById("birthday").value;
  const g = document.getElementById("gender").value;

  const seed = hash(b + g);

  show("draw");

  deck.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    const d = document.createElement("div");
    d.className = "card-anim";
    d.style.left = `${50 + i * 10}%`;
    d.style.animationDelay = i * 0.2 + "s";
    deck.appendChild(d);
  }

  setTimeout(() => {
    const cards = shuffle(seed).slice(0, 3);

    cardsBox.innerHTML = cards.map(c => `
      <div class="tarot-card">
        <img src="${c.img}" />
        <h3>${c.name}</h3>
        <p style="font-size:12px">${c.desc}</p>
      </div>
    `).join("");

    cardsBox.innerHTML += `
      <div class="ai-box">
        ${aiExplain(cards[0], g)}
      </div>
    `;

    show("result");
  }, 1500);
};

restart.onclick = () => show("home");
import { getAIReading } from "./ai.js";

const state = {
  cards: [],
  user: null
};

function seed(str) {
  let h = 0;
  for (let c of str) h = (h * 31 + c.charCodeAt(0)) % 100000;
  return h;
}

function shuffle(arr, s) {
  let r = s;
  let a = [...arr];

  for (let i = a.length - 1; i > 0; i--) {
    r = (r * 9301 + 49297) % 233280;
    const j = r % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* 主流程 */
async function startGame() {
  const birthday = document.querySelector("#birthday").value;
  const gender = document.querySelector("#gender").value;

  const user = { birthday, gender };
  state.user = user;

  const s = seed(birthday + gender);

  const res = shuffle(window.TAROT, s).slice(0, 3);
  state.cards = res;

  renderCards(res);
}

/* 渲染卡牌（3D翻转） */
function renderCards(cards) {
  const box = document.querySelector("#cards");

  box.innerHTML = cards.map((c, i) => `
    <div class="card-3d" onclick="flip(this, ${i})">
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">
          <img src="${c.img}" style="width:100%;border-radius:12px"/>
          <p>${c.name}</p>
        </div>
      </div>
    </div>
  `).join("");
}

/* 翻牌 */
window.flip = async (el, index) => {
  el.classList.add("flipped");

  const card = state.cards[index];

  const aiText = await getAIReading(card, state.user);

  const aiBox = document.querySelector("#ai");

  aiBox.innerText = aiText;
};

/* 绑定 */
document.querySelector("#start").onclick = startGame;
