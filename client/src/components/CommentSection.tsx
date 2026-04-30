import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, Send } from 'lucide-react';

interface Comment {
    id: number;
    question_id: number;
    user_id: number;
    author_name: string;
    content: string;
    created_at: string;
}

export function CommentSection({ questionId }: { questionId: number }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { user } = useContext(AuthContext);

    const fetchComments = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/questions/${questionId}/comments`);
            setComments(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch comments', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [questionId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setSubmitting(true);
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            await axios.post(`http://localhost:5000/api/questions/${questionId}/comments`, { content: newComment }, config);
            setNewComment('');
            fetchComments();
        } catch (err) {
            console.error('Failed to add comment', err);
            alert('Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-4 pt-4 border-t border-white/10">
            <h5 className="text-white flex items-center gap-2 mb-4 font-semibold text-lg">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                Comments ({comments.length})
            </h5>

            {loading ? (
                <div className="flex justify-center my-4">
                    <Spinner animation="border" variant="light" size="sm" />
                </div>
            ) : (
                <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-white rounded-lg p-3 shadow-md">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-cyan-600 font-bold text-sm">{comment.author_name}</span>
                                <span className="text-neutral-500 text-xs">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-black font-medium text-sm m-0 whitespace-pre-wrap">{comment.content}</p>
                        </div>
                    ))}
                    {comments.length === 0 && (
                        <p className="text-neutral-500 text-sm italic text-center py-2">
                            No comments yet. Be the first to explain!
                        </p>
                    )}
                </div>
            )}

            {user ? (
                <Form onSubmit={handleSubmit} className="mt-2">
                    <div className="relative">
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Write an explanation or comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            className="bg-white text-black placeholder-neutral-500 resize-none pr-12 rounded-xl text-sm shadow-sm focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/80"
                            disabled={submitting}
                        />
                        <Button 
                            type="submit" 
                            variant="link"
                            disabled={!newComment.trim() || submitting}
                            className="absolute right-2 bottom-2 text-cyan-500 hover:text-cyan-300 p-1"
                        >
                            {submitting ? <Spinner animation="border" size="sm" /> : <Send className="w-5 h-5" />}
                        </Button>
                    </div>
                </Form>
            ) : (
                <div className="bg-black/20 rounded-lg p-3 text-center border border-white/5">
                    <p className="text-neutral-400 text-sm m-0">Please log in to add a comment.</p>
                </div>
            )}
        </div>
    );
}
