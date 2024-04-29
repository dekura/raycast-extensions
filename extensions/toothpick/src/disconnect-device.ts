import { getPreferenceValues, showToast, Toast } from "@raycast/api";
import { ratio } from "fuzzball";
import { disconnectDevice } from "./core/devices/handlers/disconnect-device";
import { getDevicesService } from "./core/devices/devices.service";
import { showError } from "./utils";

export default async (props: { arguments: { nameOrMacAddress: string | undefined } }) => {
  const { fuzzyRatio, bluetoothBackend } = getPreferenceValues<ExtensionPreferences>();

  if (props.arguments.nameOrMacAddress === undefined) {
    await showError("Undefined value. Check extension preferences.");
    return;
  }

  if (isNaN(parseFloat(fuzzyRatio))) {
    await showError("Invalid fuzzy ratio. Check extension preferences.");
    return;
  }

  const devices = getDevicesService(bluetoothBackend)?.getDevices() ?? [];

  const device = devices.find(
    (device) =>
      ratio(device.name, props.arguments.nameOrMacAddress || "") > parseInt(fuzzyRatio) ||
      device.macAddress === props.arguments.nameOrMacAddress
  );

  if (!device) {
    await showToast({ style: Toast.Style.Failure, title: "Device not found." });
  } else {
    await disconnectDevice(device);
  }
};
