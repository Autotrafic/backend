import { THeaderType } from '../enums';
import { TTask } from '../totalum/tarea';

export interface ToggleTotalumHeaderBody {
  body: {
    activeHeader: THeaderType;
  };
}

export interface UpdateTaskBody {
  body: {
    id: string;
    update: Partial<TTask>;
  };
}
