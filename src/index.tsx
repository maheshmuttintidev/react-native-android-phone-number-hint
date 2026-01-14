import AndroidPhoneNumberHint, {
  type PhoneNumberHintOptions,
} from './NativeAndroidPhoneNumberHint';

/**
 * Error codes that can be thrown by showPhoneNumberHint
 */
export const PhoneNumberHintErrorCodes = {
  /** User cancelled/dismissed the phone number picker */
  USER_CANCELLED: 'USER_CANCELLED',
  /** Phone number hints are disabled in device settings (Settings → Google → Phone number sharing) */
  RESOLUTION_REQUIRED: 'RESOLUTION_REQUIRED',
  /** Google Play Services not connected or unavailable */
  API_NOT_CONNECTED: 'API_NOT_CONNECTED',
  /** Network connectivity issue */
  NETWORK_ERROR: 'NETWORK_ERROR',
  /** Google account sign-in required */
  SIGN_IN_REQUIRED: 'SIGN_IN_REQUIRED',
  /** API configuration error (usually a development issue) */
  DEVELOPER_ERROR: 'DEVELOPER_ERROR',
  /** No active Android activity available */
  NO_ACTIVITY: 'NO_ACTIVITY',
  /** A phone number hint request is already in progress */
  ALREADY_IN_PROGRESS: 'ALREADY_IN_PROGRESS',
  /** Failed to launch the phone number picker intent */
  INTENT_ERROR: 'INTENT_ERROR',
  /** Failed to retrieve phone number from the picker result */
  GET_PHONE_ERROR: 'GET_PHONE_ERROR',
  /** Unexpected/unknown error occurred */
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type PhoneNumberHintErrorCode =
  (typeof PhoneNumberHintErrorCodes)[keyof typeof PhoneNumberHintErrorCodes];

/**
 * Shows the native Android phone number hint picker.
 *
 * @param options - Optional configuration for the hint behavior
 * @param options.showGuidanceDialog - If true, shows a guidance dialog when phone number hints
 *   are not available (e.g., disabled in settings). Default: false.
 *   Set to false to handle errors in your application layer with custom UI.
 *
 * @returns Promise that resolves with the selected phone number string
 *
 * @throws Error with code property matching PhoneNumberHintErrorCodes
 *
 * @example
 * // Basic usage - handle errors yourself
 * try {
 *   const phoneNumber = await showPhoneNumberHint();
 *   console.log('Selected:', phoneNumber);
 * } catch (error) {
 *   if (error.code === 'USER_CANCELLED') {
 *     // User dismissed the picker - this is normal
 *   } else if (error.code === 'RESOLUTION_REQUIRED') {
 *     // Phone number hints disabled - show your own UI
 *     Alert.alert('Enable Phone Number Hints',
 *       'Please enable phone number sharing in Settings → Google');
 *   }
 * }
 *
 * @example
 * // With built-in guidance dialog
 * try {
 *   const phoneNumber = await showPhoneNumberHint({ showGuidanceDialog: true });
 * } catch (error) {
 *   // Error still thrown, but user saw guidance dialog
 * }
 */
export async function showPhoneNumberHint(
  options?: PhoneNumberHintOptions
): Promise<string> {
  return await AndroidPhoneNumberHint.showPhoneNumberHint(options ?? null);
}

// Re-export types for consumers
export type { PhoneNumberHintOptions };
