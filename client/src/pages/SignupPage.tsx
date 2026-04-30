import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { SplineSceneBasic } from '../components/ui/SplineSceneBasic';

const SignupPage = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/signup', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <SplineSceneBasic>
            <div className="animate-fade-in">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-white text-3xl mb-6 fw-bold tracking-tight">Create Account</h2>
                    
                    {error && (
                        <Alert variant="danger" className="bg-red-500/10 border-red-500/20 text-red-400">
                            {error}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit} className="space-y-4">
                        <Form.Group className="mb-4">
                            <Form.Label className="text-neutral-400 text-sm mb-2">Display Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                required 
                                placeholder="John Doe"
                                className="bg-transparent border-white/10 text-white py-2.5 input-glow transition-all focus:bg-white/5"
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="text-neutral-400 text-sm mb-2">Workspace Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                required 
                                placeholder="name@company.com"
                                className="bg-transparent border-white/10 text-white py-2.5 input-glow transition-all focus:bg-white/5"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-6">
                            <Form.Label className="text-neutral-400 text-sm mb-2">Secure Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                required 
                                placeholder="••••••••"
                                className="bg-transparent border-white/10 text-white py-2.5 input-glow transition-all focus:bg-white/5"
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </Form.Group>

                        <Button 
                            className="w-full py-3 fw-bold bg-gradient-to-r from-blue-600 to-cyan-500 border-0 shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-transform active:scale-[0.98]" 
                            type="submit"
                        >
                            Get Started Free
                        </Button>
                    </Form>

                    <div className="text-center mt-6 text-neutral-400 text-sm">
                        Already have an account? <Link to="/login" className="text-cyan-400 fw-bold hover:text-cyan-300 transition-colors">Log In</Link>
                    </div>
                </div>
            </div>
        </SplineSceneBasic>
    );
};

export default SignupPage;
