import { Algorithm } from 'jws';
import { HSSignerAndVerifyerKeys, RSVerifyerOnlyKeys, RSSignerAndVerifyerKeys } from './canUse';

type HMACFamilyAlgorithms = 'HS256' | 'HS384' | 'HS512';
type RSAFamilyAlgorithms = 'RS256' | 'RS384' | 'RS512';
type ValidAlgorithmAndKeys = {
  algorithm: HMACFamilyAlgorithms;
  keys: HSSignerAndVerifyerKeys;
} | {
  algorithm: RSAFamilyAlgorithms;
  keys: RSSignerAndVerifyerKeys;
} | {
  algorithm: RSAFamilyAlgorithms;
  keys: RSVerifyerOnlyKeys;
}

export const validateAlgorithm = (algo: string): Algorithm | never => {
  const algos: Algorithm[] = ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512', 'PS256', 'PS384', 'PS512', 'none'];
  if (algos.indexOf(algo as Algorithm) === -1) {
    throw new Error(`Unsupported algorithm value ${algo}`);
  }
  return algo as Algorithm;
};

export default function getValidAlgorithmAndKeysObject(algorithm: string, privateKey: string, publicKey: string = ''): ValidAlgorithmAndKeys | never {
  const validAlgorithm = validateAlgorithm(algorithm);
  if (validAlgorithm.charAt(0) === 'H') {
    if (privateKey.length <= 0) {
      throw new Error('The private key cannot be an empty string when using HMAC family');
    }
    const keys: HSSignerAndVerifyerKeys = {
      privateKey
    };
    return {
      algorithm: validAlgorithm as HMACFamilyAlgorithms,
      keys,
    };
  }
  if (validAlgorithm.charAt(0) === 'R') {
    if (publicKey.length <= 0) {
      throw new Error('One or more keys are missing for RS256 validAlgorithm to work');
    }
    if (privateKey.length <= 0) {
      const keys: RSVerifyerOnlyKeys = {
        publicKey
      };
      return {
        algorithm: validAlgorithm as RSAFamilyAlgorithms,
        keys,
      };
    }
    const keys: RSSignerAndVerifyerKeys = {
      publicKey,
      privateKey
    };
    return {
      algorithm: validAlgorithm as RSAFamilyAlgorithms,
      keys,
    };
  }
  throw new Error(`Algorithm ${validAlgorithm} is not supported, use HS256 or RS256`);
}