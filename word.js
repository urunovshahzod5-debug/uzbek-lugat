const detail = document.querySelector("#word-detail");
const params = new URLSearchParams(window.location.search);
const wordId = params.get("id");

async function showWord() {
  try {
    const response = await fetch("words.json");

    if (!response.ok) {
      throw new Error("Lug'at fayli ochilmadi");
    }

    const words = await response.json();
    const item = words.find(function (word) {
      return word.id === wordId;
    });

    if (!item) {
      detail.textContent = "Bu so'z topilmadi.";
      return;
    }

    detail.replaceChildren();

    const title = document.createElement("h1");
    title.textContent = item.word;
    detail.appendChild(title);

    const partOfSpeech = document.createElement("p");
    partOfSpeech.textContent = "So'z turkumi: " + item.partOfSpeech;
    detail.appendChild(partOfSpeech);

    item.meanings.forEach(function (meaning, index) {
      const heading = document.createElement("h2");
      heading.textContent = "[" + (index + 1) + "] " + meaning.definition;
      detail.appendChild(heading);

      if (meaning.examples && meaning.examples.length > 0) {
        const label = document.createElement("p");
        label.textContent = "Misollar:";
        detail.appendChild(label);

        const list = document.createElement("ul");

        meaning.examples.forEach(function (example) {
          const exampleItem = document.createElement("li");
          exampleItem.textContent = example;
          list.appendChild(exampleItem);
        });

        detail.appendChild(list);
      }
    });
  } catch (error) {
    detail.textContent =
      "Ma'lumotni yuklab bo'lmadi. Saytni Live Server orqali ochganingizni tekshiring.";
    console.error(error);
  }
}

showWord();
