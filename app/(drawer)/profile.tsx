import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/authcontext';

const ProfileScreen = () => {
  const router = useRouter();
  const { currentUser, updateProfile, logoutUser } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [description, setDescription] = useState(currentUser?.description || '');

  const handleSave = () => {
    updateProfile({ name, address, avatarUrl, description });
    Alert.alert('Thành công', 'Đã lưu thông tin Profile!');
  };

  const handleLogout = () => {
    logoutUser();
    router.replace('/');
  };

  return (
    <View style={styles.container}>

      <ScrollView style={styles.formContainer} contentContainerStyle={styles.contentContainer}>
        
        <View style={styles.headerRow}>
          <Text style={styles.title}>{name || 'Unknown'}</Text>
          <View style={styles.avatarBox}>
            {currentUser?.avatarUrl ? (
              <Image source={{ uri: currentUser.avatarUrl }} style={styles.imageConfig} />
            ) : (
              <Text style={{ fontSize: 35 }}>🖼️</Text>
            )}
          </View>
        </View>

        <View style={styles.formBox}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={[styles.input, {backgroundColor: '#eee'}]} value={currentUser?.email} editable={false} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="xxxxxxxxx" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Avatar URL</Text>
            <TextInput style={styles.input} value={avatarUrl} onChangeText={setAvatarUrl} placeholder="http://xxxx.xxx.xxxx" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              multiline 
              numberOfLines={4} 
              value={description} 
              onChangeText={setDescription} 
              placeholder="" 
            />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button]} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', 
    alignItems: 'center', 
  },
  formContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 600, 
    backgroundColor: '#ffffff', 
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contentContainer: {
    paddingHorizontal: 40,
    paddingTop: 60,
    paddingBottom: 60,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 36, fontWeight: 'bold', color: 'black' },
  avatarBox: { width: 120, height: 120, borderWidth: 1, borderColor: 'black', borderRadius: 12, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  imageConfig: { width: '100%', height: '100%', resizeMode: 'cover' },
  formBox: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 15, marginBottom: 8, color: 'black', fontWeight: '500' },
  input: { borderWidth: 1, borderColor: 'black', padding: 12, fontSize: 16, backgroundColor: 'white', borderRadius: 6 },
  textArea: { height: 100, textAlignVertical: 'top' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  button: { borderWidth: 1, borderColor: 'black', paddingVertical: 15, width: '45%', alignItems: 'center', borderRadius: 6 },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: 'black' }
});

export default ProfileScreen;