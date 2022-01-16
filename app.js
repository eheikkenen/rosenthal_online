const modelParams = {
    x: {min: 0.001, max: 0.010, step: 0.001, default: 0.003},
    y: {min: 0.001, max: 0.010, step: 0.001, default: 0.001},
    initialTemp: {min: 0, max: 5000, step: 25, default: 393},
    power: {min: 1, max: 10000, step: 10, default: 200},
    thermalConductivity: {min: 0.1, max: 5000, step: 1, default: 20},
    velocity: {min: 0.00001, max: 500, step: 0.01, default: 1},
    rho: {min: 1, max: 20000, step: 100, default: 8000},
    cp: {min: 1, max: 1500, step: 50, default: 500},
    meltingTemperature: {min: 200, max: 5000, step: 100, default: 1660}
};

const modelParamDefaults = Object.fromEntries(
    Object.entries(modelParams).map(
        ([paramName, paramValues]) => [paramName, paramValues.default]
    )
);

const formElements = () => ({
    x: document.getElementById("x"),
    y: document.getElementById("y"),
    power: document.getElementById("power"),
    initialTemp: document.getElementById("initialTemp"),
    velocity: document.getElementById("velocity"),
    thermalConductivity: document.getElementById("thermalConductivity"),
    rho: document.getElementById("rho"),
    cp: document.getElementById("cp"),
    meltingTemperature: document.getElementById("meltingTemperature"),
    meltPoolDepth: document.getElementById("meltPoolDepth"),
    meltPoolWidth: document.getElementById("meltPoolWidth")
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

    // calculate melt pool statistics [meters]
    // d = np.sqrt((2 * q) / (np.e * np.pi * rho * c * (tf - t0) * v))  # melt pool depth [m]
    // w = 2 * d  # melt pool width [m]
    const depth = Math.sqrt((2 * values.power) / (Math.E * Math.PI * values.rho * values.cp * (values.meltingTemperature - values.initialTemp) * values.velocity));
    const width = 2 * depth;
    document.getElementById("meltPoolDepth").innerHTML = depth.toPrecision(3);
    document.getElementById("meltPoolWidth").innerHTML = width.toPrecision(3);

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

const setDefaults316 = () => {
    const elements = formElements();
    elements["thermalConductivity"].value = 20;
    elements["rho"].value = 8000;
    elements["cp"].value = 500;
    elements["meltingTemperature"].value = 1660;
    drawPlots();
};

const setDefaultsTitanium = () => {
    const elements = formElements();
    elements["thermalConductivity"].value = 6.7;
    elements["rho"].value = 4430;
    elements["cp"].value = 526;
    elements["meltingTemperature"].value = 1900;
    drawPlots();
};

const setDefaultsInconel = () => {
    const elements = formElements();
    elements["thermalConductivity"].value = 11.4;
    elements["rho"].value = 8200;
    elements["cp"].value = 435;
    elements["meltingTemperature"].value = 1575;
    drawPlots();
};

const setDefaultsAluminum = () => {
    const elements = formElements();
    elements["thermalConductivity"].value = 113;
    elements["rho"].value = 2670;
    elements["cp"].value = 900;
    elements["meltingTemperature"].value = 850;
    drawPlots();
};


let params = {...modelParamDefaults};
const elements = formElements();
for (let key in params) {
    elements[key].value = params[key];
    elements[key].min = modelParams[key].min
    elements[key].max = modelParams[key].max
    elements[key].step = modelParams[key].step
}
drawPlots();
