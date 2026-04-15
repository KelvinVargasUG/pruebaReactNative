import { Platform } from 'react-native';

const ANDROID_EMULATOR_HOST = '10.0.2.2';
const DEFAULT_HOST = 'localhost';

const host = Platform.OS === 'android' ? ANDROID_EMULATOR_HOST : DEFAULT_HOST;

export const BASE_URL = `http://${host}:3002`;
