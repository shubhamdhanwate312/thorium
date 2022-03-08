export type UserInfoInstance = {
  UUID: string;
  [k: string]: any;
}

export interface TokenUserInstance extends UserInfoInstance {
  token: string;
}

export type TokenUserConstuctorParam = {
  userInfo: UserInfoInstance;
  token: string; 
} 

export interface TokenUserConstructor {
  new(param: TokenUserConstuctorParam): TokenUserInstance;
}

export default class TokenUser implements TokenUserInstance {
  public token: string;
  public UUID: string;
  constructor({ userInfo, token }: TokenUserConstuctorParam) {
    this.token = token;
    const { UUID, ...rest } = userInfo;
    this.UUID = UUID;
    Object.assign(this, rest);
  }
}
