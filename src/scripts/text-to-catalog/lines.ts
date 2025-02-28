export const isCodesLine = (line: string): boolean => {
  // 1. Назва державної адміністративно-територіальної одиниці (губернії, воєводства, жупи та ін.), у межах якої велася метрична книга (виділяється жирним курсивом);
  // 2. Назва церковної адміністративної установи, в межах якої велася метрична книга (виділяється жирним шрифтом);
  // 3. Назви храму, в якому велася метрична книга та населеного пункту, в якому він знаходився і його адміністративно-територіальне підпорядкування (повіт, волость та ін.);
  // 4. Назва(и) населених пунктів, мешканці яких були прихожанами цього храму; якщо частина цих населених пунктів відносилася до інших адміністративно-територіальних одиниць, то зазначаються ці одиниці;
  // 5. Відомості про записи в метричній книзі про народження: їх хронологічні межі, номери фондів, описів, справ; у разі значної кількості таких записів ці відомості перелічуються по кожному фонду, опису, справі у хронологічному порядку;
  // 6. Аналогічно побудовані відомості про шлюбні записи;
  // 7. Аналогічно побудовані відомості про записи про розлучення;
  // 8. Аналогічно побудовані відомості про записи про смерть;
  // 9. Аналогічно побудовані відомості про наявність інших записів, зокрема, сповідальних відомостей;
  // 10. Відомості про додаткову інформацію, що міститься в метричних книгах, наприклад, про персональний склад парафіян та ін., у такому ж порядку, як і в пункті 5. У зв’язку з тим, що далеко не завжди по всіх зазначених позиціях (особливо 9 і 10) у метричних книгах містилися відповідні записи, по частині цих позицій є пропуски (у довіднику вони позначені довгим тире або ж зазначено, що інформація відсутня).
  const isCodesLine = /^\d+\.\s?(народж|шлюб|смерт|сповід|розлу|списк|дошлюбні)/i.test(line);
  return isCodesLine;
};

export const isEmptyLine = (line: string): boolean => {
  return /^\d+\.\s?(-|–|інформація)/i.test(line);
}

const codesLineToData = (line: string): LineCode[] => {
  // 5. Народження: 1841: ф. 35, оп. 10, спр. 94; 1844: ф. 193, оп. 1, спр. 193;
  // 6. Шлюб: 1841: ф. 35, оп. 10, спр. 94; 1844: ф. 193, оп. 1, спр. 193;

  const matches = line.match(
    /^\d+\.\s?(народж|шлюб|смерт|сповід|розлу|списк[а-яїєґі ]+):\s?(.+)/i
  );
  if (matches === null) {
    return [];
  }

  const [, recordType, data] = matches;
  const result: LineCode[] = [];
  data.split(";").map((yearData) => {
    try {
      const [year, rest] = yearData.split(":");
      if (year.includes(",")) {
        year.split(",").map((y) => {
          // const year = parseInt(y.trim());
          // const [f, d, c] = rest.split(",").map((s) => s.trim());
          // result.push({ year, record_type, f, d, c });
          if (y.includes("-") || y.includes("–")) {
            const [from, to] = y.split(/-|–/).map((s) => parseInt(s.trim()));
            const [f, d, c] = rest.split(",").map((s) => s.trim());
            for (let i = from; i <= to; i++) {
              result.push({ year: i, recordType, f, d, c });
            }
          } else {
            const [f, d, c] = rest.split(",").map((s) => s.trim());
            result.push({ year: parseInt(y.trim()), recordType, f, d, c });
          }
        });
      }
    } catch (err) {
      console.error(yearData, err);
    }
  });

  return result;
};

const blockToData = (block: Block, confession: string, archive: string): FullCode[][] => {
  const lines = block.lines;
  return lines.map((line) => {
    if (isCodesLine(line)) {
      return codesLineToData(line).map((data) => ({
        country: block.country,
        state: block.state,
        place: block.place,
        churchName: block.churchName,
        churchAdministration: block.churchAdministration,
        confession,
        a: archive,
        ...data,
      }));
    }
    return [];
  });
};

export default blockToData;
