const modelParams = {
    x: {min: 0.001, max: 0.010, step: 0.001, default: 0.003},
    y: {min: 0.001, max: 0.010, step: 0.001, default: 0.001},
    // z: {min: 0.001, max: 0.010, step: 0.001, default: 0.001},
    initialTemp: {min: 273, max: 2000, step: 25, default: 393},
    power: {min: 1, max: 5000, step: 10, default: 200},
    thermalConductivity: {min: 1, max: 500, step: 1, default: 20},
    velocity: {min: 0.001, max: 5, step: 0.01, default: 1},
    rho: {min: 1, max: 20000, step: 100, default: 8000},
    cp: {min: 1, max: 1500, step: 50, default: 500},
    meltingTemperature: {min: 200, max: 5000, step: 100, default: 1660}
};

const modelParamDefaults = Object.fromEntries(
    Object.entries(modelParams).map(
        ([paramName, paramValues]) => [paramName, paramValues.default]
    )
);

const setFormFromUrlBar = () => {
    const params = getUrlParams();
    const elements = formElements();

    for (let key in params) {
        elements[key].value = params[key];
        elements[key].min = modelParams[key].min
        elements[key].max = modelParams[key].max
        elements[key].step = modelParams[key].step
    }

};

const setUrlBarFromForm = () => {
    const searchString = (new URLSearchParams(formValues())).toString();
    history.replaceState(null, '', "?" + searchString)
};

const getUrlParams = () => {
    let params = {...modelParamDefaults};
    const searchParams = new URLSearchParams(window.location.search);

    for (const [key, value] of searchParams) {
        if (key in modelParams) {
            const {min: min, max: max} = modelParams[key];
            if (value !== "" && Number(value) >= min && Number(value) <= max) {
                params[key] = Number(value);
            }
        }
    }
    return params
};

const onFormChange = () => {
    setUrlBarFromForm();
    setFormFromUrlBar();
    drawPlots();
};

const formElements = () => ({
    x: document.getElementById("x"),
    y: document.getElementById("y"),
    // z: document.getElementById("z"),
    power: document.getElementById("power"),
    initialTemp: document.getElementById("initialTemp"),
    velocity: document.getElementById("velocity"),
    thermalConductivity: document.getElementById("thermalConductivity"),
    rho: document.getElementById("rho"),
    cp: document.getElementById("cp"),
    meltingTemperature: document.getElementById("meltingTemperature")
});

const formValues = () => {
    const elements = formElements();
    return Object.fromEntries(
        Object.keys(modelParams).map(param => [param, Number(elements[param].value)])
    )
};

const rosenthal = (x, y, z, initialTemperature, power, lambda, velocity, alpha) => {
    const r = Math.sqrt(x * x + y * y + z * z);
    const dt = power / (2 * Math.PI * lambda * r) * Math.exp(-velocity / (2 * alpha) * (r + x));
    return initialTemperature + dt;
};

const drawPlots = () => {

    const values = formValues();

    // declare vars
    const size = 500, x = new Array(size), y = new Array(size), z = new Array(size);

    // get x and y values
    for (let i = 0; i < size; i++) {
        x[i] = -values.x + (2 * values.x / size) * i;
        y[i] = -values.y + (2 * values.y / size) * i;
        z[i] = new Array(size)
    }

    // get thermal diffusivity
    const alpha = values.thermalConductivity / (values.rho * values.cp);

    // get temperatures
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            z[j][i] = rosenthal(x[i], y[j], 0, values.initialTemp, values.power, values.thermalConductivity, values.velocity, alpha);
            if (z[j][i] > values.meltingTemperature) {
                z[j][i] = values.meltingTemperature;
            }  // set maximum value
        }
    }

    const data = [{
        z: z,
        x: x,
        y: y,
        type: 'contour',
        contours: {
            coloring: 'heatmap'
        },
        colorbar: {
            title: 'Temperature [K]',
            titleside: 'right'
        }
    }
    ];

    //var layout = {
    //  title: 'X-Y Plot',
    //}

    const layout = {
        title: {
            text: 'X-Y Plot'
        },
        xaxis: {
            title: 'X Axis [m]'
        },
        yaxis: {
            scaleanchor: "x",
            title: 'Y Axis [m]'
        }
    };

    Plotly.newPlot('plotlyDiv', data, layout);
};

onFormChange();

