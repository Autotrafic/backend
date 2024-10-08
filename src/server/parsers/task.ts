import { Task, TTask } from '../../interfaces/totalum/tarea';

export function parseTaskFromTotalum(totalumTask: TTask): Task {
  const indications = totalumTask.descripcion.split('\n').filter((indication) => indication.trim() !== '');

  return {
    state: totalumTask.estado,
    url: totalumTask.enlace,
    title: totalumTask.titulo,
    indications,
    date: totalumTask.fecha,
  };
}

export function parseTaskToTotalum(task: Task): TTask {
    const descripcion = task.indications.join('\n');
    
  return {
    estado: task.state,
    enlace: task.url,
    titulo: task.title,
    descripcion,
    fecha: task.date,
  };
}
