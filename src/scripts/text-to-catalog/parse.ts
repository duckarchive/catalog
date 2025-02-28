export const parseChurchNameWithPlace = (line: string): Pick<Block, "churchName" | "place"> => {
  const match = line.match(/(\d+)\.\s(.+),\sс\.\s(.+)/);
  if (match) {
    return {
      churchName: match[2],
      place: match[3]
    };
  }

  return {
    churchName: "",
    place: ""
  };
}