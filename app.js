console.log("hello world")

const rosenthal = (x, y, z, initialTemperature, power, lambda, velocity, alpha) => {
  const r = Math.sqrt(x*x + y*y + z*z)
  const dt = power / (2 * Math.PI * lambda * r) * Math.exp(-velocity / (2 * alpha) * (r + x))
  return initialTemperature + dt
}

const drawGraph = () => {
  const canvas = $("#myCanvas")[0]
  const x = $("#x")[0]
  const y = $("#y")[0]
  const z = $("#z")[0]
  const initialTemperature = $("#initialTemperature")[0]
  const power = $("#power")[0]
  const lambda = $("#lambda")[0]
  const velocity = $("#velocity")[0]
  const alpha = $("#alpha")[0]
}

