import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext<any>(null);

const db = SQLite.openDatabaseSync('my_app.db');

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  const [db, setDb] = useState<any>(null);
  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await SQLite.openDatabaseAsync('my_app.db');
        setDb(database);

        await database.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
          );
          CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            postId TEXT,
            author TEXT,
            content TEXT,
            date TEXT
          );
        `);

        const storedCurrentUser = await AsyncStorage.getItem('currentUser');
        if (storedCurrentUser) {
          setCurrentUser(JSON.parse(storedCurrentUser));
        }
      } catch (error) {
        console.error('Lỗi khởi tạo SQLite:', error);
      } finally {
        setLoading(false);
      }
    };
    initDB();
  }, []);

  const registerUser = async (user: { name: string; email: string; pass: string }) => {
    try {
      const statement = await db.prepareAsync(
        'INSERT INTO users (name, email, password) VALUES ($name, $email, $password)'
      );
      await statement.executeAsync({
        $name: user.name,
        $email: user.email,
        $password: user.pass
      });
      return true;
    } catch (error) {
      console.error('Lỗi khi đăng ký (Có thể email đã tồn tại):', error);
      return false;
    }
  };

  const loginUser = async (email: string, pass: string) => {
    try {
      const foundUser = await db.getFirstAsync(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, pass]
      );

      if (foundUser) {
        setCurrentUser(foundUser);
        await AsyncStorage.setItem('currentUser', JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      return false;
    }
  };

  const updateProfile = async (updatedData: { name: string; email: string }) => {
    if (!currentUser) return;
    
    try {
      await db.runAsync(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [updatedData.name, updatedData.email, currentUser.id]
      );
      
      const newUserState = { ...currentUser, ...updatedData };
      setCurrentUser(newUserState);
      await AsyncStorage.setItem('currentUser', JSON.stringify(newUserState));
    } catch (error) {
      console.error('Lỗi khi cập nhật profile:', error);
    }
  };

  const logoutUser = async () => {
    setCurrentUser(null);
    await AsyncStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, db, registerUser, loginUser, updateProfile, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);