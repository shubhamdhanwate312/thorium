
export type RSVerifyerOnlyKeys = {
  publicKey: string;
}

export interface RSSignerAndVerifyerKeys extends RSVerifyerOnlyKeys {
  privateKey: string;
}

export type HSSignerAndVerifyerKeys = {
  privateKey: string;
}

export type Keys = RSVerifyerOnlyKeys | RSSignerAndVerifyerKeys | HSSignerAndVerifyerKeys;
export type HasPrivateKey = {
  privateKey: string;
}
export type HasPublicKey = {
  publicKey: string;
}

export function isRSVerifyerOnlyKeys(keys: any): keys is RSVerifyerOnlyKeys {
  return (keys as any).publicKey !== undefined && (keys as any).privateKey === undefined;
}
export function isRSSignerAndVerifyerKeys(keys: any): keys is RSSignerAndVerifyerKeys {
  return (keys as any).publicKey !== undefined && (keys as any).privateKey !== undefined;
}
export function isHSSignerAndVerifyerKeys(keys: any): keys is RSSignerAndVerifyerKeys {
  return (keys as any).privateKey !== undefined;
}

export function canUsePrivateKey(algorithm: string, keys: Keys): keys is HasPrivateKey {
  return (algorithm.charAt(0) === 'H' && isHSSignerAndVerifyerKeys(keys))
    || (algorithm.charAt(0) === 'R' && isRSSignerAndVerifyerKeys(keys));
}

export function canUsePublicKey(algorithm: string, keys: Keys): keys is HasPublicKey {
  return (algorithm.charAt(0) === 'R' && (isRSSignerAndVerifyerKeys(keys)) || isRSVerifyerOnlyKeys(keys));
}