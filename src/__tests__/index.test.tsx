import { showPhoneNumberHint, PhoneNumberHintErrorCodes } from '../index';
import NativeModule from '../NativeAndroidPhoneNumberHint';

jest.mock('../NativeAndroidPhoneNumberHint', () => ({
  __esModule: true,
  default: { showPhoneNumberHint: jest.fn() },
}));

const mockedShow = NativeModule.showPhoneNumberHint as jest.Mock;

describe('showPhoneNumberHint', () => {
  beforeEach(() => mockedShow.mockReset());

  it('passes null to the native module when no options are given', async () => {
    mockedShow.mockResolvedValue('+15555550100');
    await expect(showPhoneNumberHint()).resolves.toBe('+15555550100');
    expect(mockedShow).toHaveBeenCalledWith(null);
  });

  it('forwards options to the native module', async () => {
    mockedShow.mockResolvedValue('+15555550100');
    await showPhoneNumberHint({ showGuidanceDialog: true });
    expect(mockedShow).toHaveBeenCalledWith({ showGuidanceDialog: true });
  });

  it('propagates native rejections', async () => {
    const error = Object.assign(new Error('cancelled'), {
      code: PhoneNumberHintErrorCodes.USER_CANCELLED,
    });
    mockedShow.mockRejectedValue(error);
    await expect(showPhoneNumberHint()).rejects.toBe(error);
  });
});

it('exposes the expected error codes', () => {
  expect(Object.keys(PhoneNumberHintErrorCodes).sort()).toEqual(
    [
      'ALREADY_IN_PROGRESS',
      'API_NOT_CONNECTED',
      'DEVELOPER_ERROR',
      'GET_PHONE_ERROR',
      'INTENT_ERROR',
      'NETWORK_ERROR',
      'NO_ACTIVITY',
      'RESOLUTION_REQUIRED',
      'SIGN_IN_REQUIRED',
      'UNKNOWN_ERROR',
      'USER_CANCELLED',
    ].sort()
  );
});
