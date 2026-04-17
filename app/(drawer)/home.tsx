import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/authcontext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/services/api';
interface Post {
  id: string;
  title: string;
  description: string;
  creator_name: string;
  creator_email: string;
  created_at: string;
}


const HomeScreen = () => {
  const { currentUser, db } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  
  const [comments, setComments] = useState<any[]>([]);
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await apiClient.get('/posts');

      if(response.status === 200 && response.data)
      {
          setPosts(response.data);
      }
    } catch (error: any) {
      console.error('Lỗi khi tải Post:', error.response?.data || error.message);
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);

  const loadComments = async () => {
    if (!db) return;
    try {
      const allComments = await db.getAllAsync('SELECT * FROM comments ORDER BY id DESC');
      setComments(allComments);
    } catch (error) {
      console.log('Lỗi tải comment:', error);
    }
  };

  useEffect(() => {
    loadComments();
  }, [db]);

  const handleAddPost = async () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ tiêu đề và nội dung');
      return;
    }
    const payload = {
      title: newTitle,
      description: newDescription,
      creator_email: currentUser?.email || 'tester@gmail.com'
    };
    try {
      const response = await apiClient.post('/posts', payload);

      if(response.status === 200 || response.status === 201) {
        setNewTitle('');
        setNewDescription('');

        fetchPosts();
      }else {
        Alert.alert('Lỗi', 'Không thể tạo bài Post');
      }
    } catch (error: any) {
      console.error('Lỗi khi tạo bài Post', JSON.stringify(error.response?.data || error.message, null, 2));
      Alert.alert('Lỗi hệ thống','Có lỗi xảy ra khi gửi bài Post lên Server');
    }
    
  };

  const sortedPosts = [...posts].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));

  const handleAddComment = async (postId: string) => {
    if (!currentUser) {
      Alert.alert('Lỗi', 'Bạn cần đăng nhập để bình luận!');
      return;
    }
    if (!commentText.trim() || !db) return;

    try {
      const statement = await db.prepareAsync(
        'INSERT INTO comments (postId, author, content, date) VALUES ($postId, $author, $content, $date)'
      );
      await statement.executeAsync({
        $postId: postId,
        $author: currentUser.name,
        $content: commentText,
        $date: new Date().toISOString(),
      });
      
      setCommentText('');
      loadComments();
    } catch (error) {
      console.log('Lỗi không thể bình luận', error)
    }
  };

  const renderPost = ({ item }: { item: Post }) => {
    const postComments = comments.filter(c => c.postId === item.id);
    const isCommentOpen = activeCommentPost === item.id;

    const formattedDate = new Date(item.created_at).toLocaleDateString('vi-VN');

    return (
      <View style={styles.postCard}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <View style={styles.postMeta}>
          <Text style={styles.authorText}>👤 {item.creator_name}</Text>
          <Text style={styles.dateText}>📅 {formattedDate}</Text>
        </View>
        <Text style={styles.postDescription}>{item.description}</Text>

        <TouchableOpacity 
          style={styles.commentToggle} 
          onPress={() => setActiveCommentPost(isCommentOpen ? null : item.id)}
        >
          <Text style={styles.commentToggleText}>
            💬 {postComments.length} Bình luận
          </Text>
        </TouchableOpacity>

        {isCommentOpen && (
          <View style={styles.commentSection}>
            {currentUser ? (
              <View style={styles.commentInputRow}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Viết bình luận..."
                  value={commentText}
                  onChangeText={setCommentText}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={() => handleAddComment(item.id)}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>Gửi</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={{color: 'red', fontStyle: 'italic', marginBottom: 10}}>
                * Vui lòng đăng nhập để bình luận.
              </Text>
            )}

            {postComments.map((cmt) => (
              <View key={cmt.id} style={styles.commentItem}>
                <Text style={styles.commentAuthor}>{cmt.author}</Text>
                <Text style={styles.commentContent}>{cmt.content}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {currentUser && (
        <View style={styles.createPostContainer}>
          <TextInput
            style={styles.inputTitle}
            placeholder="Title"
            value={newTitle}
            onChangeText={setNewTitle} 
          />
          <TextInput
            style={styles.inputDesc}
            placeholder="Description"
            value={newDescription}
            onChangeText={setNewDescription}
            multiline={true}
            numberOfLines={3}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleAddPost}>
            <Text style={styles.submitButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.feedTitle}>Recent Posts</Text>
      <FlatList
        data={sortedPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', paddingHorizontal: 15 },
  createPostContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
    marginBottom: 10,
  },
  inputDesc: {
    fontSize: 16,
    height: 60,
    textAlignVertical: 'top', 
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#1877f2', 
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  feedTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#1c1e21' },

  postCard: { backgroundColor: '#fff', padding: 18, borderRadius: 12, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  postTitle: { fontSize: 20, fontWeight: 'bold', color: '#050505', marginBottom: 8 },
  postMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e4e6eb' },
  authorText: { fontSize: 14, color: '#65676b', fontWeight: '500' },
  dateText: { fontSize: 14, color: '#65676b' },
  postDescription: { fontSize: 16, color: '#1c1e21', lineHeight: 24 },
  commentToggle: { marginTop: 15, paddingVertical: 5, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  commentToggleText: { color: '#65676b', fontWeight: 'bold' },
  commentSection: { marginTop: 10, backgroundColor: '#f7f8fa', padding: 10, borderRadius: 8 },
  commentInputRow: { flexDirection: 'row', marginBottom: 15 },
  commentInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 15, height: 40, backgroundColor: '#fff' },
  sendBtn: { backgroundColor: '#1877f2', justifyContent: 'center', paddingHorizontal: 15, borderRadius: 20, marginLeft: 10 },
  commentItem: { marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ebebeb' },
  commentAuthor: { fontWeight: 'bold', fontSize: 13, color: '#050505' },
  commentContent: { fontSize: 14, color: '#1c1e21', marginTop: 2 }
});

export default HomeScreen;