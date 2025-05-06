import type { Request } from 'express';
import { lookup } from 'geoip-lite';
import * as countries from 'i18n-iso-countries';
import DeviceDetector = require('device-detector-js');
import { SessionMetaData } from '../types/session-metadata.types';
import { IS_DEV_ENV } from './is-dev.util';

countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

function extractClientIp(req: Request): string {
  if (IS_DEV_ENV) return '173.166.164.121';

  const cfIp = req.headers['cf-connecting-ip'];
  const forwardedFor = req.headers['x-forwarded-for'];

  if (Array.isArray(cfIp)) return cfIp[0];
  if (typeof cfIp === 'string') return cfIp;
  if (typeof forwardedFor === 'string') return forwardedFor.split(',')[0];

  return req.ip;
}

function getLocation(ip: string) {
  const geo = lookup(ip);

  return {
    country: countries.getName(geo?.country || '', 'en') || 'Unknown',
    city: geo?.city || 'Unknown',
    latidute: geo?.ll?.[0] || 0,
    longitude: geo?.ll?.[1] || 0,
  };
}

function getDeviceInfo(userAgent: string) {
  const detector = new DeviceDetector();
  const device = detector.parse(userAgent);

  return {
    browser: device.client?.name || 'Unknown',
    os: device.os?.name || 'Unknown',
    type: device.device?.type || 'Unknown',
  };
}

export function getSessionMetadata(
  req: Request,
  userAgent: string,
): SessionMetaData {
  const ip = extractClientIp(req);
  const location = getLocation(ip);
  const device = getDeviceInfo(userAgent);

  return {
    ip,
    location,
    device,
  };
}
