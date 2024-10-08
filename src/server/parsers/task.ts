import { Task, TTask } from '../../interfaces/totalum/tarea';

export function parseTaskFromTotalum(totalumTask: TTask): Task {
  const indications = totalumTask.descripcion.split('\n').filter((indication) => indication.trim() !== '');

  const title = indications.length > 0 ? indications[0] : '';

  const remainingIndications = indications.slice(1);

  return {
    state: totalumTask.estado,
    url: totalumTask.enlace,
    title,
    indications: remainingIndications,
    date: totalumTask.fecha,
  };
}

export function parseTaskToTotalum(task: Task): TTask {
  const descripcion = [task.title, ...task.indications].join('\n');

  return {
    estado: task.state,
    enlace: task.url,
    descripcion,
    fecha: task.date,
  };
}
