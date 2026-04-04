import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/authcontext';

const LoginScreen = () => {
  const router = useRouter();
  const { loginUser } = useAuth(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const isSuccess = await loginUser(email, password);
    if (isSuccess) {
      router.replace('/(drawer)/home');
    } else {
      Alert.alert('Lỗi', 'Sai email hoặc mật khẩu! Hoặc tài khoản chưa được tạo.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 40}}>
        <Text style={{fontSize: 36, fontWeight: 'bold'}}>Login</Text>
      </View>

      <View style={{flex: 2, width: '100%', maxWidth: 400, alignSelf: 'center'}}>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType='email-address'/>
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }} onPress={() => router.push('/register')}>
          <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  input: { borderWidth: 1, borderColor: 'black', padding: 12, marginBottom: 20, borderRadius: 6 },
  button: { borderWidth: 1, borderColor: 'black', padding: 15, alignItems: 'center', borderRadius: 6, backgroundColor: '#f0f0f0' },
  buttonText: { fontSize: 18, fontWeight: 'bold' },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
});
export default LoginScreen;