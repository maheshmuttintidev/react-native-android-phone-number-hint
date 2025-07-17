import AndroidPhoneNumberHint from './NativeAndroidPhoneNumberHint';

export async function showPhoneNumberHint(): Promise<string> {
  return await AndroidPhoneNumberHint.showPhoneNumberHint();
}
