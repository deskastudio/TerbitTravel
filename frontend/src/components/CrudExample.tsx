import { useEffect, useState } from 'react';
import { createData, fetchData, updateData, deleteData } from '../lib/apiClient';

const CrudExample = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [newPost, setNewPost] = useState<string>('');
    const [editPost, setEditPost] = useState<any | null>(null); // Untuk post yang sedang diedit
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1); // Halaman saat ini
    const postsPerPage = 5; // Jumlah data per halaman

    // Fetch data berdasarkan halaman
    useEffect(() => {
        const getPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchData('/posts');
                setPosts(data.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage));
            } catch (err: any) {
                setError('Failed to load posts. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        getPosts();
    }, [currentPage]);

    // Create a new post
    const handleCreate = async () => {
        try {
            const postData = {
                title: newPost,
                body: 'This is a test post body',
                userId: 1,
            };
            const createdPost = await createData('/posts', postData);
            setPosts((prevPosts) => [...prevPosts, createdPost]);
            setNewPost('');
        } catch (err) {
            console.error('Error creating post:', err);
        }
    };

    // Update a post
    const handleUpdate = async () => {
        if (!editPost) return;
        try {
            const updatedData = {
                title: editPost.title,
                body: editPost.body,
                userId: editPost.userId,
            };
            const updatedPost = await updateData(`/posts/${editPost.id}`, updatedData);
            setPosts((prevPosts) =>
                prevPosts.map((post) => (post.id === editPost.id ? updatedPost : post))
            );
            setEditPost(null); // Tutup modal
        } catch (err) {
            console.error('Error updating post:', err);
        }
    };

    // Delete a post
    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deleteData(`/posts/${id}`);
                setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
            } catch (err) {
                console.error('Error deleting post:', err);
            }
        }
    };

    // Pagination Handlers
    const handleNextPage = () => {
        if (currentPage * postsPerPage < 100) setCurrentPage((prev) => prev + 1);
    };
    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="spinner border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 font-bold mt-10">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-6">CRUD Example with TailwindCSS</h1>

            {/* Create Post */}
            <div className="mb-6 flex items-center gap-4">
                <input
                    type="text"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="New post title"
                    className="border border-gray-300 rounded p-2 flex-1"
                />
                <button
                    onClick={handleCreate}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Create Post
                </button>
            </div>

            {/* List Posts */}
            <ul className="space-y-4">
                {posts.map((post) => (
                    <li
                        key={post.id}
                        className="border border-gray-300 p-4 rounded shadow-sm flex justify-between items-center"
                    >
                        <div>
                            <strong className="block text-lg">{post.title}</strong>
                            <p className="text-gray-600">{post.body}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setEditPost(post)}
                                className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(post.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${
                        currentPage === 1
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage * postsPerPage >= 100}
                    className={`px-4 py-2 rounded ${
                        currentPage * postsPerPage >= 100
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    Next
                </button>
            </div>

            {/* Edit Modal */}
            {editPost && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4">Edit Post</h3>
                        <input
                            type="text"
                            value={editPost.title}
                            onChange={(e) =>
                                setEditPost({ ...editPost, title: e.target.value })
                            }
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        />
                        <textarea
                            value={editPost.body}
                            onChange={(e) =>
                                setEditPost({ ...editPost, body: e.target.value })
                            }
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        ></textarea>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleUpdate}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditPost(null)}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrudExample;
