import { Model } from 'sequelize';

export class User extends Model {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public nonce!: number;
  public publicAddress!: string;
  public name!: string; 
  public email?: string; // for nullable fields
  public phone?: string;
}
