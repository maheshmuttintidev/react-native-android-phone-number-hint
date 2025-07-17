import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { showPhoneNumberHint } from 'react-native-android-phone-number-hint';

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const _phoneNumber = await showPhoneNumberHint();
        setPhoneNumber(_phoneNumber);
      } catch (err) {
        console.log('🚀 ~ init ~ err:', err);
      }
    };
    init();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Result: {phoneNumber || "Oops! can't find SIM Number"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: 'black', fontSize: 18 },
});
