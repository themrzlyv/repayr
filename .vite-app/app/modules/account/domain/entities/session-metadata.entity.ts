export type SessionMetadataEntity = {
  ip: string;
  location: {
    country: string;
    city: string;
  };
  device: {
    browser: string;
    os: string;
    type: string;
  };
};
