import { Task, TTask } from '../../interfaces/totalum/tarea';

export function parseTaskFromTotalum(totalumTask: TTask): Task {
  let indications;

  if (!totalumTask.descripcion) {
    indications = [''];
  } else {
    indications = totalumTask.descripcion.split('\n').filter((indication) => indication.trim() !== '');
  }

  return {
    id: totalumTask._id,
    state: totalumTask.estado,
    url: totalumTask.enlace,
    title: totalumTask.titulo,
    indications,
    date: totalumTask.fecha,
  };
}

export function parseTaskToTotalum(task: Task): TTask {
  const descripcion = task.indications.length > 0 ? task.indications.join('\n') : '';

  return {
    _id: task.id,
    estado: task.state,
    enlace: task.url,
    titulo: task.title,
    descripcion,
    fecha: task.date,
  };
}
