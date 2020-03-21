const modelParams = {
  x: { min: 50, max: 200, default: 100 },
  y: { min: 50, max: 200, default: 100 },
  z: { min: 50, max: 200, default: 100 },
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

  for (key in params) {
    elements[key].value = params[key];
    elements[key].min = modelParams[key].min
    elements[key].max = modelParams[key].max
  }

  elements.xyGraph.width = params.x;
  elements.xyGraph.height = params.y;

  elements.xzGraph.width = params.x;
  elements.xzGraph.height = params.z;
}

const setUrlBarFromForm = () => {
  const elements = formElements();
  params = 
    Object.fromEntries(
      Object.
      keys(modelParams).
      map(param => [param, elements[param].value])
    )
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
