export default function getFactoryId(Factory) {
  if (Factory.hasOwnProperty('id')) {
    return Factory.id;
  }

  console.warn(
    `[Polly] ${Factory.name} "name" is deprecated and has been renamed to "id".`
  );

  return Factory.name;
}
