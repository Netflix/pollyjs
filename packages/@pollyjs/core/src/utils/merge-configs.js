import mergeWith from 'lodash-es/mergeWith';
import { assert, EXPIRY_STRATEGIES } from '@pollyjs/utils';

function deprecateRecordIfExpired(mergedConfig) {
  // throw if you used both recordIfExpired and expiryStrategy
  assert(
    'recordIfExpired is deprecated and cannot be used with expiryStrategy',
    mergedConfig.hasOwnProperty('recordIfExpired') &&
      mergedConfig.hasOwnProperty('expiryStrategy')
  );

  // return if you only used expiryStrategy
  if (mergedConfig.hasOwnProperty('expiryStrategy')) {
    return mergedConfig;
  }

  if (mergedConfig.recordIfExpired) {
    // replace recordIfExpired: true with expiryStrategy: record
    mergedConfig.expiryStrategy = EXPIRY_STRATEGIES.RECORD;
  } else {
    // replace recordIfExpired: false with expiryStrategy: warn
    mergedConfig.expiryStrategy = EXPIRY_STRATEGIES.WARN;
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
