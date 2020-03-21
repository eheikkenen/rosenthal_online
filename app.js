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
  document.getElementById("x").value = params.x;
  document.getElementById("y").value = params.y;
  document.getElementById("z").value = params.z;
  document.getElementById("power").value = params.power;
  document.getElementById("initialTemp").value = params.initialTemp;
  document.getElementById("velocity").value = params.initialTemp;
  document.getElementById("thermalConductivity").value = params.thermalConductivity;
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
      if (Number(value) > min && Number(value) < max) { params[key] = Number(value); };
    }
  }

  return params
};

const onFormChange = () => {
  setUrlBarFromForm();
}

const rosenthal = (x, y, z, initialTemperature, power, lambda, velocity, alpha) => {
  const r = Math.sqrt(x*x + y*y + z*z);
  const dt = power / (2 * Math.PI * lambda * r) * Math.exp(-velocity / (2 * alpha) * (r + x));
  return initialTemperature + dt;
};

setFormFromUrlBar();
setUrlBarFromForm();
