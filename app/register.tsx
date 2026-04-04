import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/authcontext'; 

const RegisterScreen = () => {
  const router = useRouter();
  const { registerUser } = useAuth(); 

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
  if (!name || !email || !password) {
    Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
    return;
  }

  const isSuccess = await registerUser({ 
    name: name, 
    email: email, 
    pass: password 
  });

  if (isSuccess) {
    Alert.alert('Thành công', 'Đăng ký tài khoản thành công!');
    router.replace('/login'); 
  } else {
    Alert.alert('Thất bại', 'Email này đã được sử dụng hoặc có lỗi xảy ra!');
  }
};

  return (
    <View style={styles.container}>
      <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20}}>
        <Text style={{fontSize: 36, fontWeight: 'bold'}}>Register</Text>
      </View>

      <View style={{flex: 3, width: '100%', maxWidth: 400, alignSelf: 'center'}}>
        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} placeholder="Enter your name" value={name} onChangeText={setName} />
        <Text style ={styles.label}>Your Email</Text>
        <TextInput style={styles.input} placeholder="Enter your email" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <Text style ={styles.label}>Password</Text>
        <TextInput style={styles.input} placeholder="Enter your password" secureTextEntry value={password} onChangeText={setPassword} />
        
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }} onPress={() => router.back()}>
          <Text style={{ textDecorationLine: 'underline' }}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  input: { borderWidth: 1, borderColor: 'black', padding: 12, marginBottom: 15, borderRadius: 6 },
  button: { borderWidth: 1, borderColor: 'black', padding: 15, alignItems: 'center', borderRadius: 6, backgroundColor: '#f0f0f0' },
  buttonText: { fontSize: 18, fontWeight: 'bold' },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
});
export default RegisterScreen;