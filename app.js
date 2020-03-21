const modelParams = {
  x: { min: 0.001, max: 0.010, step: 0.001, default: 0.003 },
  y: { min: 0.001, max: 0.010, step: 0.001, default: 0.001 },
  z: { min: 0.001, max: 0.010, step: 0.001, default: 0.001 },
  initialTemp: { min: 0, max: 2000, step: 25, default: 100 },
  power: { min: 0, max: 100, step: 10, default: 50 },
  thermalConductivity: { min: 0, max: 500, step: 1, default: 20 },
  velocity: { min: 0, max: 5, step: 0.01, default: 1 }
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
    elements[key].step = modelParams[key].step
  }

}

const setUrlBarFromForm = () => {
  const searchString = (new URLSearchParams(formValues())).toString();
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

const formValues = () => {
  const elements = formElements();
  return Object.fromEntries(
    Object.
    keys(modelParams).
    map(param => [param, Number(elements[param].value)])
    )
}

const rosenthal = (x, y, z, initialTemperature, power, lambda, velocity, alpha) => {
  const r = Math.sqrt(x*x + y*y + z*z);
  const dt = power / (2 * Math.PI * lambda * r) * Math.exp(-velocity / (2 * alpha) * (r + x));
  return initialTemperature + dt;
};

const getTemperatures = () => {
  const steps = 500;
  const values = formValues();
  const stepX = values.x / steps;
  const stepY = values.y / steps;
  const rho = 8000;
  const cp = 460;
  const alpha = values.thermalConductivity / (rho * cp);
  
  const temperatures = [];

  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < steps; j++) {
      const temp = rosenthal(i*stepX, j*stepY, 0, values.initialTemp, values.power, values.thermalConductivity, values.velocity, alpha);

      temperatures[i * steps + j] = temp
      }
  }
  return temperatures;
}

const drawPlots = () => {

  const values = formValues();

  const steps = 500;

  // declare vars
  var size = 500, x = new Array(size), y = new Array(size), z = new Array(size), i, j;

  // get x and y values
  for (var i = 0; i < size; i++) {
  x[i] = -values.x + (2 * values.x / size) * i;
  y[i] = -values.y + (2 * values.y / size) * i;
  z[i] = new Array(size)
  }

  // get thermal diffusivity
  const alpha = values.thermalConductivity / (8000 * 460);
  
  // get temperatures
  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < steps; j++) {
    debugger;
      z[i][j] = rosenthal(x[i], y[j], 0, values.initialTemp, values.power, values.thermalConductivity, values.velocity, alpha);
      if (z[i][j] > 3000) {z[i][j] = 3000;}
      }
    }

    var data = [ {
      z: z,
      x: x,
      y: y,
      type: 'contour'
      }
    ];

    Plotly.newPlot('plotlyDiv', data);
}

setFormFromUrlBar();
setUrlBarFromForm();

