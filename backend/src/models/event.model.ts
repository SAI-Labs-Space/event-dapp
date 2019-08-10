import { Model } from 'sequelize';

export class Event extends Model {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public publicAddress!: string;
  public ownerAddress!: string;
  public name!: string;
  public description?: string; // for nullable fields
  public location?: string;
  public startDate?: Date;
  public endDate?: Date;
  public quota?: number;

}
