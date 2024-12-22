import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [newPost, setNewPost] = useState({ title: '', body: '' });
    const [isEditing, setIsEditing] = useState(false);

    const loadPosts = async () => {
        try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Ошибка загрузки постов:', error);
        }
    };


    const loadPostDetails = async (postId) => {
        try {
            const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
            setSelectedPost(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error('Ошибка загрузки поста:', error);
        }
    };


    const addPost = async () => {
        try {
            const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
                ...newPost,
                userId: 1,
            });
            setPosts([response.data, ...posts]);
            setNewPost({ title: '', body: '' });
        } catch (error) {
            console.error('Ошибка добавления поста:', error);
        }
    };


    const updatePost = async () => {
        try {
            const response = await axios.put(`https://jsonplaceholder.typicode.com/posts/${selectedPost.id}`, {
                ...newPost,
                userId: selectedPost.userId,
            });
            setPosts(posts.map((post) => (post.id === selectedPost.id ? response.data : post)));
            setSelectedPost(null);
            setIsEditing(false);
        } catch (error) {
            console.error('Ошибка редактирования поста:', error);
        }
    };


    const deletePost = async (postId) => {
        try {
            await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
            setPosts(posts.filter((post) => post.id !== postId)); 
        } catch (error) {
            console.error('Ошибка удаления поста:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Работа с JSONPlaceholder API</h1>


            <button onClick={loadPosts} style={{ marginBottom: '20px' }}>
                Загрузить посты
            </button>


            <div style={{ marginBottom: '20px' }}>
                <h2>{isEditing ? 'Редактировать пост' : 'Добавить новый пост'}</h2>
                <input
                    type="text"
                    placeholder="Заголовок"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    style={{ display: 'block', marginBottom: '10px' }}
                />
                <textarea
                    placeholder="Содержание"
                    value={newPost.body}
                    onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                    style={{ display: 'block', marginBottom: '10px' }}
                />
                <button onClick={isEditing ? updatePost : addPost}>
                    {isEditing ? 'Сохранить изменения' : 'Добавить пост'}
                </button>
            </div>


            <h2>Список постов</h2>
            <ul>
                {posts.map((post) => (
                    <li key={post.id} style={{ marginBottom: '10px' }}>
                        <strong>{post.title}</strong>
                        <button onClick={() => loadPostDetails(post.id)} style={{ marginLeft: '10px' }}>
                            Подробнее
                        </button>
                        <button
                            onClick={() => {
                                setSelectedPost(post);
                                setIsEditing(true);
                                setNewPost({ title: post.title, body: post.body });
                            }}
                            style={{ marginLeft: '10px' }}
                        >
                            Редактировать
                        </button>
                        <button onClick={() => deletePost(post.id)} style={{ marginLeft: '10px' }}>
                            Удалить
                        </button>
                    </li>
                ))}
            </ul>


            {selectedPost && !isEditing && (
                <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
                    <h2>Детали поста</h2>
                    <h3>{selectedPost.title}</h3>
                    <p>{selectedPost.body}</p>
                    <button onClick={() => setSelectedPost(null)}>Закрыть</button>
                </div>
            )}
        </div>
    );
}

export default App;
