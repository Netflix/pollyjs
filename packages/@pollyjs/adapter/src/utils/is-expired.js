import dehumanizeTime from './dehumanize-time';

export default function isExpired(recordedOn, expiresIn) {
  if (recordedOn && expiresIn) {
    return (
      new Date() >
      new Date(new Date(recordedOn).getTime() + dehumanizeTime(expiresIn))
    );
  }

  return false;
}
