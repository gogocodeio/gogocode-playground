export function requestResponse(worker: Worker, data: any) {
  return new Promise((resolve) => {
    const _id = performance.now();
    function onMessage(event: any) {
      if (event.data._id !== _id) return;
      worker.removeEventListener('message', onMessage);
      resolve(event.data);
    }
    worker.addEventListener('message', onMessage);
    worker.postMessage({ ...data, _id });
  });
}
