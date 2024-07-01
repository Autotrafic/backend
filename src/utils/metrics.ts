export default function logMemoryUsage() {
  const memoryUsage = process.memoryUsage();
  console.log(`RSS: ${memoryUsage.rss / 1024 / 1024} MB`);
  console.log(`Heap Total: ${memoryUsage.heapTotal / 1024 / 1024} MB`);
  console.log(`Heap Used: ${memoryUsage.heapUsed / 1024 / 1024} MB`);
  console.log(`External: ${memoryUsage.external / 1024 / 1024} MB`);
}