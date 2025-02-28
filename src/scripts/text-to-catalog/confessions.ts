export enum Confession {
  ORTHODOXY = "ПРАВОСЛАВ’Я",
  ROMAN_CATHOLICISM = "РИМО-КАТОЛИЦИЗМ",
  GREEK_CATHOLICISM = "ГРЕКО-КАТОЛИЦИЗМ",
  EVANGELISM = "ЄВАНГЕЛІЗМ",
  BAPTISM = "БАПТИЗМ",
  REFORMATION = "РЕФОРМАТСТВО",
  JUDAISM = "ІУДАЇЗМ",
  LUTHERANISM = "ЛЮТЕРАНСТВО",
  PROTESTANTISM = "ПРОТЕСТАНТИЗМ",
}

const splitByConfessions = (
  text: string
): { confession: Confession; chunk: string }[] => {
  const confessions = Object.values(Confession);
  const regex = new RegExp(confessions.join("|"), "g");
  const chunks = text.split(regex);
  const matches = text.match(regex);

  if (!matches) {
    return [];
  }

  return matches.map((match, index) => ({
    confession: Object.values(Confession).find(
      (confession) => confession === match
    ) as Confession,
    chunk: chunks[index + 1] || "",
  }));
};

export default splitByConfessions;