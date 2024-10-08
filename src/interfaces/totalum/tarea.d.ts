import { TTaskState } from '../enums';

export interface TTask {
  _id: string;
  estado: TTaskState;
  titulo: string;
  descripcion: string;
  enlace: string;
  fecha: Date;
}

export interface Task {
  id: string;
  state: TTaskState;
  title: string;
  indications: string[];
  url: string;
  date: Date;
}
