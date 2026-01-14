import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

/**
 * Options for configuring the phone number hint behavior
 */
export interface PhoneNumberHintOptions {
  /**
   * Whether to show a guidance dialog when phone number hints are not available.
   * This dialog helps users navigate to settings to enable phone number sharing.
   *
   * @default false
   *
   * Set to `true` if you want the library to show a helpful dialog.
   * Set to `false` (default) to handle errors in your application layer.
   */
  showGuidanceDialog?: boolean;
}

export interface Spec extends TurboModule {
  /**
   * Shows the phone number hint picker.
   * @param options Optional configuration for the hint behavior
   * @returns Promise resolving to the selected phone number
   *
   * @throws {Error} Error codes:
   * - `USER_CANCELLED`: User dismissed the picker
   * - `RESOLUTION_REQUIRED`: Phone number hints are disabled in device settings
   * - `API_NOT_CONNECTED`: Google Play Services not connected
   * - `NETWORK_ERROR`: Network connectivity issue
   * - `SIGN_IN_REQUIRED`: Google account sign-in required
   * - `DEVELOPER_ERROR`: API configuration error
   * - `NO_ACTIVITY`: No active Android activity
   * - `ALREADY_IN_PROGRESS`: A hint request is already in progress
   * - `INTENT_ERROR`: Failed to launch the picker
   * - `GET_PHONE_ERROR`: Failed to retrieve phone number
   * - `UNKNOWN_ERROR`: Unexpected error
   */
  showPhoneNumberHint(options: Object | null): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('AndroidPhoneNumberHint');
