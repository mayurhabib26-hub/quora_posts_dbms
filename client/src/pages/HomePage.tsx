import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import QuestionCard from '../components/QuestionCard';
import QuestionForm from '../components/QuestionForm';
import { AuthContext } from '../context/AuthContext';
import { HeroGeometric } from '../components/ui/shape-landing-hero';
import { Database } from 'lucide-react';

const HomePage = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const { user } = useContext(AuthContext);

    const fetchQuestions = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/questions');
            setQuestions(res.data);
            setLoading(false);
        } catch (err) {
            setError('Could not load questions');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleCreateOrUpdate = async (formData) => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            if (editingQuestion) {
                await axios.put(`http://localhost:5000/api/questions/${editingQuestion.id}`, formData, config);
            } else {
                await axios.post('http://localhost:5000/api/questions', formData, config);
            }
            setShowModal(false);
            setEditingQuestion(null);
            fetchQuestions();
        } catch (err) {
            alert('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            console.log(`Sending DELETE request to /api/questions/${id}`);
            await axios.delete(`http://localhost:5000/api/questions/${id}`, config);
            console.log('Delete successful, refreshing list');
            fetchQuestions();
        } catch (err) {
            console.error('Delete failed:', err);
            alert(`Delete failed: ${err.message || 'Unknown error'}`);
        }
    };

    const openEditModal = (question) => {
        setEditingQuestion(question);
        setShowModal(true);
    };

    return (
        <HeroGeometric badge="" title1="" title2="">
            <Container>
                <Row className="justify-content-center">
                    <Col lg={8}>
                        {/* Massive Centerpiece Logo */}
                        <div className="flex flex-col items-center justify-center mb-16 mt-6 group cursor-pointer transition-transform hover:scale-105 z-50 relative">
                            <style>
                                {`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@800&display=swap');`}
                            </style>
                            <div className="relative flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full shadow-[0_0_35px_rgba(168,85,247,0.4)] bg-gradient-to-tr from-purple-600 to-cyan-400 p-[5px] group-hover:rotate-12 transition-all duration-700 mb-6 group-hover:shadow-[0_0_50px_rgba(34,211,238,0.6)]">
                                <div className="w-full h-full bg-[#030303] rounded-full flex items-center justify-center relative overflow-hidden">
                                    <Database className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-300 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                                    <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-purple-500 animate-[spin_3s_linear_infinite] opacity-70 z-0"></div>
                                    <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-b-cyan-400 animate-[spin_4s_linear_infinite_reverse] opacity-50 z-0"></div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.9)] border-[3px] border-[#030303]"></div>
                            </div>
                            <span 
                                className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 drop-shadow-[0_4px_10px_rgba(0,0,0,1)] text-center leading-tight" 
                                style={{ fontFamily: '"Orbitron", sans-serif' }}
                            >
                                DBMS QUORA
                            </span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="fw-bold m-0 text-white">Top Questions for You</h2>
                            <Button variant="primary" onClick={() => { setEditingQuestion(null); setShowModal(true); }}>
                                Ask Question
                            </Button>
                        </div>

                        {loading ? (
                            <div className="text-center mt-5">
                                <Spinner animation="border" variant="light" />
                            </div>
                        ) : error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : questions.length === 0 ? (
                            <div className="text-center mt-5 p-5 bg-white/5 backdrop-blur-md rounded-3 border border-white/10 shadow-sm text-white">
                                <h4>No questions yet. Be the first to ask!</h4>
                            </div>
                        ) : (
                            questions.map(q => (
                                <QuestionCard 
                                    key={q.id} 
                                    question={q} 
                                    onEdit={openEditModal} 
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </Col>
                </Row>

                <QuestionForm 
                    show={showModal} 
                    handleClose={() => setShowModal(false)}
                    handleSubmit={handleCreateOrUpdate}
                    initialData={editingQuestion}
                />
            </Container>
        </HeroGeometric>
    );
};


export default HomePage;
