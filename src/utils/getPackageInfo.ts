export const getPackageInfo = (packageString: string) => {
  const lastSeperatorIndex = packageString.lastIndexOf("@");
  const packageName = packageString.substring(0, lastSeperatorIndex);
  const packageVersion = packageString
    .substring(lastSeperatorIndex + 1)
    // remove invalid character "," in range
    .replace(/,/g, "");
  return {
    packageName,
    packageVersion,
  };
};
