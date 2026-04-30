import React, { useState, useContext } from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { CommentSection } from './CommentSection';
import { MessageSquareText } from 'lucide-react';

const QuestionCard = ({ question, onEdit, onDelete }) => {
    const { user } = useContext(AuthContext);
    const [showComments, setShowComments] = useState(false);
    const isOwner = user && user.id === question.user_id;

    return (
        <Card className="quora-card shadow-sm border border-white/5 mb-4 p-3 bg-white/5 backdrop-blur-md">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg="transparent" className="border border-white/20 text-white">
                        {question.category}
                    </Badge>
                    <small className="text-neutral-500">
                        Posted by <strong className="text-cyan-400">{question.author_name}</strong> on {new Date(question.created_at).toLocaleDateString()}
                    </small>
                </div>
                <Card.Title className="fw-bold fs-4 mb-3 text-white">{question.title}</Card.Title>
                <Card.Text className="text-neutral-300 whitespace-pre-wrap leading-relaxed">
                    {question.content}
                </Card.Text>
                
                <div className="mt-4 pt-3 border-t border-white/10 d-flex justify-content-between align-items-center">
                    <Button 
                        variant="link" 
                        className="text-neutral-400 hover:text-white p-0 text-decoration-none flex items-center gap-2 text-sm"
                        onClick={() => setShowComments(!showComments)}
                    >
                        <MessageSquareText className="w-4 h-4" />
                        {showComments ? 'Hide Comments' : 'View Comments & Explanations'}
                    </Button>

                    {isOwner && (
                        <div className="d-flex gap-3">
                            <Button 
                                className="bg-sky-500 hover:bg-sky-600 text-white border-0 fw-bold px-3 py-1 rounded-md transition-colors" 
                                size="sm" 
                                onClick={() => onEdit(question)}
                            >
                                Edit
                            </Button>
                            <Button 
                                className="bg-red-500 hover:bg-red-600 text-white border-0 fw-bold px-3 py-1 rounded-md transition-colors" 
                                size="sm" 
                                onClick={() => {
                                    console.log('Attempting to delete question ID:', question.id);
                                    onDelete(question.id);
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    )}

                </div>

                {showComments && <CommentSection questionId={question.id} />}
            </Card.Body>
        </Card>
    );
};

export default QuestionCard;
