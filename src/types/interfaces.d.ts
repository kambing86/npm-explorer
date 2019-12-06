declare interface OptionType {
  label: string;
  value: string;
}
declare interface VersionInfoWithOptions {
  options: OptionType[];
  latest: string;
}

declare interface PackageVersionInfo {
  versions: string[];
  latest: string;
}
