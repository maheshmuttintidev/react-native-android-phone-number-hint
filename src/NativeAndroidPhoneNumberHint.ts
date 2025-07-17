import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  showPhoneNumberHint(): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('AndroidPhoneNumberHint');
