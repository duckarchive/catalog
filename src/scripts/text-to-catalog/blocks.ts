import { isCodesLine } from "./lines";
import { parseChurchNameWithPlace } from "./parse";

const confessionTextToBlocks = (text: string): [Block[], ParseError[]] => {
  const lines = text.split("\n").filter(el => /^\d+/.test(el));
  const blocks: string[][] = [];
  const results: Block[] = [];
  const errors: ParseError[] = [];
  let currentBlock: string[] = [];
  let prevNumber = -1;

  lines.forEach(line => {
    const match = line.match(/^(\d+)/);
    if (match) {
      const currNumber = parseInt(match[1]);
      if (prevNumber <= currNumber) {
        currentBlock.push(line);
        prevNumber = currNumber;
      } else {
        blocks.push(currentBlock);
        currentBlock = [line];
        prevNumber = currNumber;
      }
    } else {
      errors.push({
        fullLine: line,
        part: "",
        message: "No number in line"
      });
    }
  });

  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  blocks.forEach(blockLines => {
    const blockDataEndPos = blockLines.findIndex(isCodesLine);
    const result: Block = {
      country: "",
      state: "",
      place: "",
      churchName: "",
      churchAdministration: "",
      lines: []
    };
    if (blockDataEndPos === -1) {
      errors.push({
        fullLine: blockLines.join("\n"),
        part: "",
        message: "No codes line in block"
      });
      return results.push(result);
    }

    result.lines = blockLines.slice(blockDataEndPos, blockLines.length);
    const blockDataLines = blockLines.slice(0, blockDataEndPos).filter(Boolean);
    if (blockDataLines.length >= 4) {
      const [state, churchAdministration, churchNameWithPlace, additionalPlaces] = blockDataLines;
      const parsedChurch = parseChurchNameWithPlace(churchNameWithPlace);
      result.state = state;
      result.churchAdministration = churchAdministration;
      result.churchName = parsedChurch.churchName;
      result.place = parsedChurch.place;
      additionalPlaces.split(",").forEach(place => {
        results.push({
          ...result,
          place: place.trim()
        });
      });
    } else if (blockDataLines.length === 3) {
      const [state, churchAdministration, churchNameWithPlace] = blockDataLines;
      const parsedChurch = parseChurchNameWithPlace(churchNameWithPlace);
      result.state = state;
      result.churchAdministration = churchAdministration;
      result.churchName = parsedChurch.churchName;
      result.place = parsedChurch.place;
    } else {
      errors.push({
        fullLine: blockLines.join("\n"),
        part: blockDataLines.join("\n"),
        message: "Unexpected block data lines"
      });
    }

    results.push(result);
  });

  return [results, errors];
};

export default confessionTextToBlocks;
