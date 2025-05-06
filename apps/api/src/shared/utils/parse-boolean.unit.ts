export function parseBoolean(value: string | boolean): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const lowerCaseValue = value.trim().toLowerCase();
    if (lowerCaseValue === 'true') {
      return true;
    }

    if (lowerCaseValue === 'false') {
      return false;
    }
  }

  throw new Error(`"${value}" is not a valid boolean value.`);
}
