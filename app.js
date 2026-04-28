let TAROT = [];

fetch("./tarot.json")
  .then(res => res.json())
  .then(data => {
    TAROT = data;
  });

const btn = document.getElementById("start");
const cardsBox = document.getElementById("cards");
const aiBox = document.getElementById("ai");

function seed(str) {
  let h = 0;
  for (let c of str) h = (h * 31 + c.charCodeAt(0)) % 100000;
  return h;
}

function shuffle(arr, seedVal) {
  let a = [...arr];
  let r = seedVal;

  for (let i = a.length - 1; i > 0; i--) {
    r = (r * 9301 + 49297) % 233280;
    const j = r % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

btn.onclick = () => {
  const birthday = document.getElementById("birthday").value;
  const gender = document.getElementById("gender").value;

  if (!birthday) {
    alert("请输入生日");
    return;
  }

  const s = seed(birthday + gender);

  const result = shuffle(TAROT, s).slice(0, 3);

  renderCards(result);
};

function renderCards(cards) {
  cardsBox.innerHTML = "";
  aiBox.innerHTML = "";

  cards.forEach((card, index) => {

    const div = document.createElement("div");
    div.className = "card";
    div.style.animationDelay = index * 0.2 + "s";

    div.innerHTML = `
      <img src="${card.img}">
    `;

    div.onclick = () => {
      aiBox.innerHTML =
        "✨ " + card.name + "<br><br>" +
        card.desc +
        "<br><br>（仅供参考）";
    };

    cardsBox.appendChild(div);
  });
}
