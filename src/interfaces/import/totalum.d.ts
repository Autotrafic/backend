import { THeaderType } from '../enums';

export interface ToggleTotalumHeaderBody {
  body: {
    activeHeader: THeaderType;
  };
}
