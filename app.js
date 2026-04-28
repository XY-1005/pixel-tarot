const home = document.getElementById("home");
const draw = document.getElementById("draw");
const result = document.getElementById("result");

const startBtn = document.getElementById("startBtn");
const restart = document.getElementById("restart");

const deck = document.getElementById("deck");
const cardsBox = document.getElementById("cards");

let tarotData = [];

fetch("tarot.json")
  .then(res => res.json())
  .then(data => tarotData = data);

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) % 100000;
  }
  return h;
}

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

function showScreen(name) {
  home.classList.remove("active");
  draw.classList.remove("active");
  result.classList.remove("active");

  document.getElementById(name).classList.add("active");
}

startBtn.onclick = () => {
  const birthday = document.getElementById("birthday").value;
  const gender = document.getElementById("gender").value;

  const seed = hash(birthday + gender);

  showScreen("draw");

  deck.innerHTML = "";

  // 动画卡
  for (let i = 0; i < 3; i++) {
    const el = document.createElement("div");
    el.className = "card-anim";
    el.style.left = `${i * 10}px`;
    el.style.animationDelay = `${i * 0.3}s`;
    deck.appendChild(el);
  }

  setTimeout(() => {
    const resultCards = shuffle(seed).slice(0, 3);

    cardsBox.innerHTML = resultCards.map(c => `
      <div class="tarot-card">
        <div>${c.name}</div>
        <div style="font-size:10px;margin-top:10px;">${c.desc}</div>
      </div>
    `).join("");

    showScreen("result");
  }, 1500);
};

restart.onclick = () => {
  showScreen("home");
};
