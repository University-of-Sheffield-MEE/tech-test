// Real hardware logic has been mocked to allow local testing prior to interview

let motorPower = 0;
let ledColor = { r: 0, g: 0, b: 0 };

const getMotorPower = () => {
  return motorPower;
}
const setMotorPower = (power) => {
  motorPower = power;
}
const getLedColor = () => {
  return ledColor;
}
const setLedColor = (led) => {
  ledColor = led;
}
const getEncoderData = () => {
  // Return 10 values equal to 10 times the motor power +/- 5%
  return new Array(10).fill(motorPower)
    .map(n => 10 * n * (0.95 + Math.random()*0.1))
}

module.exports = {
  getMotorPower,
  setMotorPower,
  getLedColor,
  setLedColor,
  getEncoderData
}