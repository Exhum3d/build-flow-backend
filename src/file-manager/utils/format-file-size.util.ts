export const formatFileSize = (sizeInBytes: number): string => {
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
  const suffixArray = ['B', 'kB', 'MB', 'GB', 'TB'];
  const transformedSize = (sizeInBytes / Math.pow(1024, i)).toFixed(2);
  return transformedSize.toString() + ' ' + suffixArray[i];
};
