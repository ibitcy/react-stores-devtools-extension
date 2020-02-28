export function mergeClassNames(classes: string[]): string {
  return classes.filter(item => item).join(" ");
}
