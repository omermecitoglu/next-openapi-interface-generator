export function isTuple(schema: string) {
  return (/^\[(?:\s*[^,[\]]+\s*(?:,\s*[^,[\]]+\s*)*)?\]$/).test(schema);
}

export function getTupleItems(schema: string) {
  const matches = schema.match(/\s*([^,[\]\s]+)\s*/g);
  return matches?.map(m => m.trim()) ?? [];
}
