const form = document.querySelector("#search-form");
const input = document.querySelector("#search");
const results = document.querySelector("#results");

let words = [];

function normalize(text) {
  return text
    .toLocaleLowerCase("uz")
    .trim()
    .replace(/[''`´ʼ']/g, "'");
}

async function loadWords() {
  try {
    const response = await fetch("words.json");

    if (!response.ok) {
      throw new Error("words.json fayli ochilmadi");
    }

    words = await response.json();
    console.log("Yuklangan so'zlar:", words.length);
  } catch (error) {
    results.textContent =
      "Lug'at ma'lumotlarini yuklab bo'lmadi. Saytni ishga tushirish usulini keyin sozlaymiz.";
    console.error(error);
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const query = normalize(input.value);
  results.replaceChildren();

  if (!query) {
    results.textContent = "Avval so'z kiriting.";
    return;
  }

  const matches = words.filter(function (item) {
    return normalize(item.word).includes(query);
  });

  if (matches.length === 0) {
    results.textContent = "Bu so'z topilmadi.";
    return;
  }

  matches.forEach(function (item) {
    const entry = document.createElement("li");

    const title = document.createElement("h3");
const link = document.createElement("a");

link.textContent = item.word;
link.href = "word.html?id=" + encodeURIComponent(item.id);

title.appendChild(link);
entry.appendChild(title);

    const partOfSpeech = document.createElement("p");
    partOfSpeech.textContent = "So'z turkumi: " + item.partOfSpeech;
    entry.appendChild(partOfSpeech);

    item.meanings.forEach(function (meaning, index) {
      const heading = document.createElement("h4");
      heading.textContent =
        "[" + (index + 1) + "] " + meaning.definition;
      entry.appendChild(heading);

      const label = document.createElement("p");
      label.textContent = "Misollar:";
      entry.appendChild(label);

      const list = document.createElement("ul");

      meaning.examples.forEach(function (example) {
        const exampleItem = document.createElement("li");
        exampleItem.textContent = example;
        list.appendChild(exampleItem);
      });

      entry.appendChild(list);
    });

    results.appendChild(entry);
  });
});

loadWords();

