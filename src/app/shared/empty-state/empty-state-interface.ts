export interface EmptyStateDataConf {
  title?: String;
  description?: String;
  icon?: IconInfo;
  action?: Array<EmptyActions>;
  options?: OptionsInfo;
  image?: ImageInfo;

}

export interface IconInfo {
  class: string;
  show: boolean;
  enableAction?: boolean;
  actionType?: string;
}

export interface OptionsInfo {
  class?: string;
}

export interface ImageInfo {
  url: string;
  show: boolean;
  rounded?: boolean;
  width?: string;
  height?: string;
}

export interface EmptyActions {
  buttonName: string;
  actionType: string;
  tooltip?: string;
  buttonClass?: string;
  iconClass?: string;
}
