# BMW Connected Drive

This package can be used to access the BMW ConnectedDrive services.

## Installation

```bash
npm i -S bmw-connected-drive
```

## Usage

```javascript
import { ConnectedDrive, CarBrand, Regions } from 'bmw-connected-drive';

// Setup the API client
// captchaToken is required for first authentication you can get token from here: https://bimmer-connected.readthedocs.io/en/stable/captcha.html
const api = new ConnectedDrive(username, password, Regions.RestOfWorld, captchaToken);

// Fetch a list of vehicles associated with the credentials
const vehicles = await api.getVehicles();

// Trigger the Remote Service for remotely heating/cooling the car.
await api.startClimateControl(vehicleIdentificationNumber, CarBrand.Bmw);

// Trigger the stopping Remote Service for remotely heating/cooling the car.
await api.stopClimateControl(vehicleIdentificationNumber, CarBrand.Bmw);

```

## Disclaimer

This library is not an official integration from BMW Connected Drive. This library is neither endorsed nor supported by BMW Connected Drive. This implementation is based on reverse engineering REST calls used by the BMW Connected Drive web app, and may thus intermittently stop working if the underlying API is updated.

Any utilization, consumption and application of this library is done at the user's own discretion. This library, its maintainers and BMW Connected Drive cannot guarantee the integrity of this library or any applications of this library.

## Acknowledgements

Inspired by <https://github.com/bimmerconnected/bimmer_connected>
