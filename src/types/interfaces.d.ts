declare interface OptionType {
  label: string;
  value: string;
}
declare interface VersionInfoWithOptions {
  options: OptionType[];
  latest: string;
}
