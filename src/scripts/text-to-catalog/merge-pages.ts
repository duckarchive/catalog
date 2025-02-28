const mergePages = (text: string): string => {
  return text
    .replace(/\n\n\d+\nДержавний архів.+$/gm, "")
    .replace(/\n\n\d+\nМіжархівний довідник/gm, "");
};

export default mergePages;
