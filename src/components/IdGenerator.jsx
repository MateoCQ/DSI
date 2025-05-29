export const generateId = (prefix) => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 6);
  return `${prefix}_${timestamp}_${randomPart}`;
};

export const ID_PREFIXES = {
  EMPRESA: 'emp',
  ESTUDIANTE: 'est',
  PUESTO: 'pst'
};