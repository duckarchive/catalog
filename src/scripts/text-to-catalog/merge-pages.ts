const mergePages = (text: string): string => {
  return text
    .replace(/\n\n\d+\nДержавний архів.+$/gm, "")
    .replace(/\n\n\d+\nМіжархівний довідник/gm, "")
    .replace(/\n((?!\d{1,2}\.).+)/g, "$1")
    .replace(/\n\n/g, "\n")
};

export default mergePages;
