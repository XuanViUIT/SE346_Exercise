import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../context/authcontext';
import { router } from 'expo-router';

const SettingScreen = () => {
  const { logoutUser } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    
    router.replace('/'); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',     
    backgroundColor: '#f0f2f5',
  },
  logoutButton: {
    backgroundColor: '#ff4d4f', 
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingScreen;