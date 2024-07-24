@vertex 
fn vs(@builtin(vertex_index) vertexIndex : u32) -> @builtin(position) vec4f{
  let pos = array(
    vec2f( 0.0,  0.5),  // top center
    vec2f(-0.5, -0.5),  // bottom left
    vec2f( 0.5, -0.5)   // bottom right
  );
  return vec4f(pos[vertexIndex], 0.0, 1.0);
}

@fragment 
fn fs() -> @location(0) vec4f { //location(0) means it will write to the first render target.
  return vec4f(1.0, 0.0, 0.0, 1.0);
}