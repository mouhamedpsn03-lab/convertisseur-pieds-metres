export const METERS_PER_FOOT = 0.3048;

export function feetToMeters(feet) {
  if (typeof feet !== 'number' || !Number.isFinite(feet)) {
    throw new TypeError('La valeur en pieds doit être un nombre valide.');
  }

  return feet * METERS_PER_FOOT;
}

