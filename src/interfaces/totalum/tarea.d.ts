import { TTaskState } from '../enums';

export interface TTask {
  estado: TTaskState;
  titulo: string;
  descripcion: string;
  enlace: string;
  fecha: Date;
}

export interface Task {
  state: TTaskState;
  title: string;
  indications: string[];
  url: string;
  date: Date;
}
