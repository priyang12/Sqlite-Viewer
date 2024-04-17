export const getDBKey = (file: File) => {
  const lastModifiedDate = new Date(file.lastModified);
  const dbKey = file.name + "-" + lastModifiedDate.toISOString();
  return dbKey;
};
