async function main(){
  //try to get an adapter.
  const adapter = await navigator.gpu?.requestAdapter();
  const device = await adapter?.requestDevice();
  if(!device){
    alert("The browser doesn't support webGPU");
    return;
  }
  //create a web-GPU context
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('webgpu');
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format: presentationFormat
  })
}

main();
