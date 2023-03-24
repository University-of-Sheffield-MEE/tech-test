// ===API CALLS===

// Helper function to construct the full API URL
function getAPIUrl(path) {
  return document.getElementById('server-url').value + '/api/' + path;
}

// Check that the provided server URL is valid and reachable
async function apiHealthCheck() {
  const res = await fetch(getAPIUrl('health'));
  const data = await res.json();
  return data.ok;
}

// Get the currently set motor power (the last power we sent to the motor)
async function apiGetMotorPower() {
  const res = await fetch(getAPIUrl('motor'));
  const data = await res.json();
  return data.power;
}

// Set the motor power (0-1)
async function apiSetMotorPower(power) {
  const body = JSON.stringify({ power: power });
  const res = await fetch(getAPIUrl('motor'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  });
  const data = await res.json();
  return data.ok;
}

// Get an array of recent rpm measurements
async function apiGetMeasurements() {
  const res = await fetch(getAPIUrl('measured-speed'));
  const body = await res.json();
  return body.data;
}


// === UI LOGIC AND CALLBACKS ===

// Used for displaying error messages
function setErrorMessage(message) {
  document.getElementById('error-message').innerHTML = message;
}

// Check that the provided server URL is valid and reachable
// If it is:
// * update the controls to match the currently set state of the device
// * show elements that are initially hidden
// * start polling for data
let initConnectionInterval;
async function initConnection() {
  try {
    // Check that the server is reachable
    await apiHealthCheck();

    // Get the current motor power and display
    const power = await apiGetMotorPower();
    document.getElementById('motor-power').value = power;
    document.getElementById('motor-off').disabled = Boolean(power === 0);

    // Show controls and measurements sections
    document.getElementById('controls').classList.remove('d-none');
    document.getElementById('measurements').classList.remove('d-none');

    // Start polling for data
    if (initConnectionInterval) {
      clearInterval(initConnectionInterval);
    }
    initConnectionInterval = setInterval(fetchData, 1000);

    return true;
  } catch (err) {
    console.error(err);
    setErrorMessage('Failed to connect to server. See console');
    return false;
  }
}

// Get the latest rpm measurements and update the speed display
async function fetchData() {
  try {
    const data = await apiGetMeasurements();
    const speed = data[data.length - 1];
    const displayValue = speed.toFixed(3) + ' rpm';
    document.getElementById('measured-speed').innerHTML = displayValue;
  }
  catch (err) {
    console.error(err);
    setErrorMessage('Failed to fetch data. See console');
  }
}

// Turn the motor off
async function handleMotorOff() {
  try {
    await apiSetMotorPower(0);
    document.getElementById('motor-power').value = 0;
    document.getElementById('motor-off').disabled = true;
  } catch (err) {
    console.error(err);
    setErrorMessage('Failed to turn motor off. See console');
  }
}

// Set the motor power
async function handleMotorPowerChange(event) {
  try {
    const power = Number(event.target.value);
    await apiSetMotorPower(power);
    document.getElementById('motor-off').disabled = Boolean(power === 0)
  } catch (err) {
    console.error(err);
    setErrorMessage('Failed to set motor power. See console');
  }
}


// === INIT EVENT HANDLERS ===

document.getElementById('connect')
  .addEventListener('click', initConnection);

document.getElementById('motor-off')
  .addEventListener('click', handleMotorOff);

document.getElementById('motor-power')
  .addEventListener('input', handleMotorPowerChange);