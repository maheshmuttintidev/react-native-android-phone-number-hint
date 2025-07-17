import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { showPhoneNumberHint } from '@shayrn/react-native-android-phone-number-hint';

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [_, setHasAttempted] = useState(false);

  const requestPhoneNumber = async () => {
    setLoading(true);
    setError('');
    setHasAttempted(true);

    try {
      const _phoneNumber = await showPhoneNumberHint();
      setPhoneNumber(_phoneNumber);
    } catch (err: any) {
      console.log('🚀 ~ requestPhoneNumber ~ err:', err);

      // Handle different error types
      if (err.code === 'USER_CANCELLED') {
        setError('Phone number selection was cancelled');
      } else if (
        err.code === 'RESOLUTION_REQUIRED' ||
        err.code === 'API_NOT_CONNECTED'
      ) {
        setError(
          'Phone number hints are disabled. Please enable in Settings → Google → Phone number sharing'
        );
      } else if (err.code === 'NO_ACTIVITY') {
        setError('App is not ready. Please try again');
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your connection and try again');
      } else if (err.code === 'SIGN_IN_REQUIRED') {
        setError('Please sign in to your Google account to use this feature');
      } else {
        setError('Unable to retrieve phone number. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestPhoneNumber();
  }, []);

  const showErrorDetails = () => {
    Alert.alert(
      'Troubleshooting',
      'To use phone number hints:\n\n• Go to Settings → Google → Phone number sharing and enable it\n• Ensure you have a phone number saved in your Google account\n• Make sure Google Play Services is updated\n• Try restarting the app if issues persist',
      [{ text: 'OK' }]
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.contentContainer}>
          <ActivityIndicator size="large" color="#4285F4" />
          <Text style={styles.loadingText}>Requesting phone number...</Text>
        </View>
      );
    }

    if (phoneNumber) {
      return (
        <View style={styles.contentContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Phone Number Retrieved</Text>
          <View style={styles.phoneContainer}>
            <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          </View>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={requestPhoneNumber}
          >
            <Text style={styles.secondaryButtonText}>Try Another Number</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.contentContainer}>
          <View style={styles.errorIcon}>
            <Text style={styles.errorIconText}>⚠</Text>
          </View>
          <Text style={styles.errorTitle}>Unable to Get Phone Number</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={requestPhoneNumber}
          >
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={showErrorDetails}
          >
            <Text style={styles.helpButtonText}>Need Help?</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Initial state (shouldn't happen due to useEffect, but just in case)
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Phone Number Hint</Text>
        <Text style={styles.subtitle}>Get your phone number from Google</Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={requestPhoneNumber}
        >
          <Text style={styles.primaryButtonText}>Get Phone Number</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Phone Number Hint Demo</Text>
      </View>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#4285F4',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  phoneContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  phoneNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorIconText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'white',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4285F4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButtonText: {
    color: '#4285F4',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  helpButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  helpButtonText: {
    color: '#4285F4',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
