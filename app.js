const modelParams = {
  x: { min: 0, max: 100, default: 50 },
  y: { min: 0, max: 100, default: 50 },
  z: { min: 0, max: 100, default: 50 },
  initialTemp: { min: 0, max: 100, default: 50 },
  power: { min: 0, max: 100, default: 50 },
  thermalConductivity: { min: 0, max: 100, default: 50 },
  velocity: { min: 0, max: 100, default: 50 }
};

const modelParamDefaults = Object.fromEntries(
  Object.
  entries(modelParams).
  map(
    ([paramName, paramValues]) => [paramName, paramValues.default]
  )
);

const setFormFromUrlBar = () => {
  const params = getUrlParams();
  const elements = formElements();

  elements.x.value = params.x;
  elements.x.min = modelParams.x.min
  elements.x.max = modelParams.x.max

  elements.y.value = params.y;
  elements.y.min = modelParams.y.min
  elements.y.max = modelParams.y.max

  elements.z.value = params.z;
  elements.z.min = modelParams.z.min
  elements.z.max = modelParams.z.max

  elements.power.value = params.power;
  elements.power.min = modelParams.power.min
  elements.power.max = modelParams.power.max

  elements.initialTemp.value = params.initialTemp;
  elements.initialTemp.min = modelParams.initialTemp.min
  elements.initialTemp.max = modelParams.initialTemp.max

  elements.velocity.value = params.velocity;
  elements.velocity.min = modelParams.velocity.min
  elements.velocity.max = modelParams.velocity.max

  elements.thermalConductivity.value = params.thermalConductivity;
  elements.thermalConductivity.min = modelParams.thermalConductivity.min
  elements.thermalConductivity.max = modelParams.thermalConductivity.max
  
  elements.xyGraph.width = params.x;
  elements.xyGraph.height = params.y;

  elements.xzGraph.width = params.x;
  elements.xzGraph.height = params.z;
}

const setUrlBarFromForm = () => {
  params = {
    x: document.getElementById("x").value,
    y: document.getElementById("y").value,
    z: document.getElementById("z").value,
    power: document.getElementById("power").value,
    initialTemp: document.getElementById("initialTemp").value,
    velocity: document.getElementById("velocity").value ,
    thermalConductivity: document.getElementById("thermalConductivity").value,
  }
  const searchString = (new URLSearchParams(params)).toString();
  history.replaceState(null, '', "?" + searchString)
}

const getUrlParams = () => {
  let params = {...modelParamDefaults};
  const searchParams = new URLSearchParams(window.location.search);

  for (const [key, value] of searchParams) {
    if (key in modelParams) {
      const {min: min, max: max} = modelParams[key];
      if (Number(value) >= min && Number(value) <= max) { params[key] = Number(value); };
    }
  }

  return params
};

const onFormChange = () => {
  setUrlBarFromForm();
  setFormFromUrlBar();
}

const formElements = () => ({
  x: document.getElementById("x"),
  y: document.getElementById("y"),
  z: document.getElementById("z"),
  power: document.getElementById("power"),
  initialTemp: document.getElementById("initialTemp"),
  velocity: document.getElementById("velocity"),
  thermalConductivity: document.getElementById("thermalConductivity"),
  xyGraph: document.getElementById("xyGraph"),
  xzGraph: document.getElementById("xzGraph"),
})

const rosenthal = (x, y, z, initialTemperature, power, lambda, velocity, alpha) => {
  const r = Math.sqrt(x*x + y*y + z*z);
  const dt = power / (2 * Math.PI * lambda * r) * Math.exp(-velocity / (2 * alpha) * (r + x));
  return initialTemperature + dt;
};

setFormFromUrlBar();
setUrlBarFromForm();
