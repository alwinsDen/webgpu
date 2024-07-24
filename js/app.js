/**
 * Loads a GLSL file from the specified URL.
 * @param {string} url - The URL of the GLSL file to load.
 * @returns {Promise<string>} - A promise that resolves with the loaded GLSL code as a string.
 */
const loadGLSL = async(url) => {
  const response = await fetch(url);
  const vlss = await response.text();
  return vlss;
}

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
  //shader module definition
  const module = device.createShaderModule({
    label: "RED_TRIANGEL_SHADERS",
    code: await loadGLSL("./js/shader_module.wgsl")
  })

  //module for render pipeline
  const pipeline = device.createRenderPipeline({
    label: "RED_TRIANGLE_RENDER_PIPELINE",
    layout: "auto",
    vertex: {
      entryPoint: 'vs',
      module
    },
    fragment: {
      entryPoint: 'fs',
      module,
      targets:[{format:presentationFormat}],
    }
  })
  //create a render_pass
  const RENDER_PASS_DESCRITPER = {
    label: "RENDER_PASS_DESCRITPER",
    colorAttachments: [
      {
        // view: <- to be filled out when we render
        clearValue: [0.3, 0.3, 0.3, 1], //semi-dark grey
        loadOp: 'clear',
        storeOp: 'store',
      },
    ]
  }

  //defining the render function
  function render(){
    //get current texture
    RENDER_PASS_DESCRITPER.colorAttachments[0].view = context.getCurrentTexture().createView();
    //to encode commands
    //command encoder is used to create command buffer.
    const encoder = device.createCommandEncoder({label: 'ENCODER'});
    //render pass to encode specific commands
    const pass = encoder.beginRenderPass(RENDER_PASS_DESCRITPER);
    pass.setPipeline(pipeline);
    pass.draw(3);
    pass.end();
    
    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);
  }
  render();
}

main();
