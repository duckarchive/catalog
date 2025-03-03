import { Confession } from "./confessions";
import { parseCode } from "./parse";

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
  const isCodesLine =
    /^\d+\.\s{0,}(народж|шлюб|смерт|сповід|розлу|списк|дошлюбні)/i.test(line);
  return isCodesLine;
};

export const isEmptyLine = (line: string): boolean => {
  return /^\d+\.\s?(-|–|інформація)/i.test(line);
};

const deLine = (line: string): string => {
  return line.replace(/^\d+\.\s?/, "");
};

const codesLineToData = (line: string): [LineCode[], ParseError[]] => {
  // 5. Народження: 1841: ф. 35, оп. 10, спр. 94; 1844: ф. 193, оп. 1, спр. 193;
  // 6. Шлюб: 1841: ф. 35, оп. 10, спр. 94; 1844: ф. 193, оп. 1, спр. 193;

  const matches = line.match(
    /^\d+\.\s?((народж|шлюб|смерт|сповід|розлу|розір|списк)[а-яїєґі ]{0,}):\s?(.+)/i
  );
  if (matches === null) {
    return [[], []];
  }

  const [, recordType, _, recordLine] = matches;
  const result: LineCode[] = [];
  const errors: ParseError[] = [];

  recordLine
    .split(";")
    .filter(Boolean)
    .forEach((yearData) => {
      try {
        const [year, rest] = yearData.split(":");
        year.split(",").forEach((y) => {
          const codes = rest
            .replace(/ф|оп|с?пр/gi, "")
            .split(",")
            .map((s) => {
              try {
                return parseCode(s);
              } catch (err) {
                errors.push({
                  fullLine: recordLine,
                  part: rest,
                  message: (err as Error).message,
                });
                return "";
              }
            });

          if (!codes.filter(Boolean).length) {
            return;
          }
          const [f, d, c] = codes;
          if (y.includes("-") || y.includes("–")) {
            const [from, to] = y.split(/-|–/).map((s) => parseInt(s.trim()));
            if (
              isNaN(from) ||
              isNaN(to) ||
              from > to ||
              from < 1000 ||
              to > 2000
            ) {
              errors.push({
                fullLine: recordLine,
                part: y,
                message: "Invalid year range",
              });
              return;
            }
            for (let i = from; i <= to; i++) {
              result.push({ year: i, recordType, f, d, c });
            }
          } else {
            result.push({ year: parseInt(y.trim()), recordType, f, d, c });
          }
        });
      } catch (err) {
        errors.push({
          fullLine: recordLine,
          part: yearData,
          message: (err as Error).message,
        });
      }
    });

  return [result, errors];
};

const blockToData = (
  block: Block,
  confession: Confession,
  archive: string
): ([FullCode[], ParseError[]] | undefined)[] => {
  const lines = block.lines;
  return lines.map((line) => {
    if (isCodesLine(line)) {
      const [linesData, linesErrors] = codesLineToData(line);
      const fullCodes = linesData.map((data) => ({
        country: deLine(block.country || ""),
        state: deLine(block.state),
        place: deLine(block.place),
        churchName: deLine(block.churchName),
        churchAdministration: deLine(block.churchAdministration),
        confession,
        a: archive,
        ...data,
      }));

      return [fullCodes, linesErrors];
    }
  });
};

export default blockToData;
