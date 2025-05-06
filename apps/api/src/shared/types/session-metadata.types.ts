export type LocationInfo = {
  country: string;
  city: string;
};

export type DeviceInfo = {
  browser: string;
  os: string;
  type: string;
};

export type SessionMetaData = {
  location: LocationInfo;
  device: DeviceInfo;
  ip: string;
};
