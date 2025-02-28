const mergePages = (text: string): string => {
  return text
    .replace(/\n\n\d+\nДержавний архів.+$/gm, "")
    .replace(/\n\n\d+\nМіжархівний довідник/gm, "")
    .replace(/^\s+(\d{1,2}\.)/gm, "$1")
    .replace(/\n((?!\d{1,2}\.).+)/g, "$1")
    .replace(/^(\s+)?\n/gm, "");
};

export default mergePages;
