import mergeWith from 'lodash-es/mergeWith';
import { EXPIRY_STRATEGIES } from '@pollyjs/utils';

function deprecateRecordIfExpired(mergedConfig) {
  if (mergedConfig.hasOwnProperty('recordIfExpired')) {
    console.warn(
      '[Polly] config option "recordIfExpired" is deprecated. Please use "expiryStrategy".'
    );

    if (mergedConfig.recordIfExpired) {
      // replace recordIfExpired: true with expiryStrategy: record
      mergedConfig.expiryStrategy = EXPIRY_STRATEGIES.RECORD;
    } else {
      // replace recordIfExpired: false with expiryStrategy: warn
      mergedConfig.expiryStrategy = EXPIRY_STRATEGIES.WARN;
    }

    delete mergedConfig.recordIfExpired;
  }

  return mergedConfig;
}

function customizer(objValue, srcValue, key) {
  // Arrays and `context` options should just replace the existing value
  // and not be deep merged.
  if (Array.isArray(objValue) || ['context'].includes(key)) {
    return srcValue;
  }
}

export default function mergeConfigs(...configs) {
  const mergedConfig = mergeWith({}, ...configs, customizer);

  return deprecateRecordIfExpired(mergedConfig);
}
