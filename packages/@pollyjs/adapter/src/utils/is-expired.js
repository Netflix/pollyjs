import calculateTime from './human-time-to-ms';

export default function isExpired(recordedOn, expiresIn) {
  if (recordedOn && expiresIn) {
    return (
      new Date() >
      new Date(new Date(recordedOn).getTime() + calculateTime(expiresIn))
    );
  }

  return false;
}
