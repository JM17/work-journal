export function validateText(content: string) {
  if (content.length < 3) {
    return "Text is too short";
  }
}
