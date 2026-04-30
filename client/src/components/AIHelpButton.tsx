import React, { useState, useRef, useEffect } from 'react';
import { Phone, X, Sparkles, CheckCircle, AlertCircle, Loader2, HelpCircle } from 'lucide-react';

const AIHelpButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('+91');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
    const modalRef = useRef<HTMLDivElement>(null);

    // Close modal on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                if (status !== 'loading') handleClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, status]);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && status !== 'loading') handleClose();
        };
        if (isOpen) document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, status]);

    const handleClose = () => {
        setIsOpen(false);
        // Reset after animation
        setTimeout(() => {
            setName('');
            setPhone('+91');
            setStatus('idle');
            setMessage('');
            setErrors({});
        }, 300);
    };

    const validate = () => {
        const newErrors: { name?: string; phone?: string } = {};
        if (!name.trim()) newErrors.name = 'Please enter your name';
        if (!phone || phone === '+91') {
            newErrors.phone = 'Please enter your phone number';
        } else if (!/^\+\d{10,15}$/.test(phone)) {
            newErrors.phone = 'Enter a valid number (e.g., +91XXXXXXXXXX)';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setStatus('loading');
        setMessage('');
        setErrors({});

        try {
            const res = await fetch('http://localhost:5000/api/ai-call', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStatus('success');
                setMessage(data.message || 'AI agent is calling you now! 📞');
            } else {
                setStatus('error');
                setMessage(data.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Could not reach the server. Make sure the backend is running.');
        }
    };

    return (
        <>
            {/* ============ STYLES ============ */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

                .ai-help-fab {
                    position: fixed;
                    bottom: 28px;
                    right: 28px;
                    z-index: 9999;
                    width: 62px;
                    height: 62px;
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    background: linear-gradient(135deg, #a855f7, #06b6d4);
                    box-shadow: 0 4px 24px rgba(168, 85, 247, 0.45), 0 0 40px rgba(6, 182, 212, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    animation: ai-fab-pulse 2.5s ease-in-out infinite;
                }
                .ai-help-fab:hover {
                    transform: scale(1.12);
                    box-shadow: 0 6px 32px rgba(168, 85, 247, 0.6), 0 0 60px rgba(6, 182, 212, 0.35);
                }
                .ai-help-fab:active {
                    transform: scale(0.95);
                }
                .ai-help-fab svg {
                    color: white;
                    width: 28px;
                    height: 28px;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
                }

                @keyframes ai-fab-pulse {
                    0%, 100% { box-shadow: 0 4px 24px rgba(168, 85, 247, 0.45), 0 0 40px rgba(6, 182, 212, 0.2); }
                    50% { box-shadow: 0 4px 32px rgba(168, 85, 247, 0.65), 0 0 60px rgba(6, 182, 212, 0.4); }
                }

                /* Ripple ring behind FAB */
                .ai-help-fab::before {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 2px solid rgba(168, 85, 247, 0.4);
                    animation: ai-ripple 2.5s ease-out infinite;
                }
                @keyframes ai-ripple {
                    0% { transform: scale(1); opacity: 0.6; }
                    100% { transform: scale(1.8); opacity: 0; }
                }

                /* ---- Overlay ---- */
                .ai-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 10000;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(6px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    animation: ai-overlay-in 0.3s ease;
                }
                .ai-overlay.closing {
                    animation: ai-overlay-out 0.25s ease forwards;
                }
                @keyframes ai-overlay-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes ai-overlay-out {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }

                /* ---- Modal Card ---- */
                .ai-modal {
                    position: relative;
                    width: 100%;
                    max-width: 420px;
                    border-radius: 20px;
                    padding: 2px; /* gradient border trick */
                    background: linear-gradient(135deg, #a855f7, #06b6d4, #a855f7);
                    background-size: 300% 300%;
                    animation: ai-border-glow 4s ease infinite, ai-modal-in 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                    font-family: 'Inter', sans-serif;
                }
                @keyframes ai-border-glow {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes ai-modal-in {
                    from { transform: scale(0.9) translateY(20px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
                .ai-modal-inner {
                    background: rgba(10, 10, 20, 0.92);
                    backdrop-filter: blur(20px);
                    border-radius: 18px;
                    padding: 32px 28px 28px;
                }

                /* ---- Header ---- */
                .ai-modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }
                .ai-modal-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 20px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #c084fc, #22d3ee);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .ai-modal-close {
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    width: 34px;
                    height: 34px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #94a3b8;
                    transition: all 0.2s;
                }
                .ai-modal-close:hover {
                    background: rgba(255,255,255,0.15);
                    color: white;
                    transform: rotate(90deg);
                }

                .ai-modal-subtitle {
                    color: #94a3b8;
                    font-size: 13.5px;
                    margin-bottom: 24px;
                    line-height: 1.5;
                }

                /* ---- Form ---- */
                .ai-field {
                    margin-bottom: 18px;
                }
                .ai-label {
                    display: block;
                    font-size: 12.5px;
                    font-weight: 600;
                    color: #cbd5e1;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    margin-bottom: 7px;
                }
                .ai-input {
                    width: 100%;
                    padding: 12px 16px;
                    border-radius: 12px;
                    border: 1.5px solid rgba(255,255,255,0.1);
                    background: rgba(255,255,255,0.05);
                    color: #f1f5f9;
                    font-size: 15px;
                    font-family: 'Inter', sans-serif;
                    transition: all 0.25s;
                    outline: none;
                    box-sizing: border-box;
                }
                .ai-input::placeholder {
                    color: #4b5563;
                }
                .ai-input:focus {
                    border-color: #a855f7;
                    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
                    background: rgba(255,255,255,0.08);
                }
                .ai-input.has-error {
                    border-color: #ef4444;
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
                }
                .ai-error-text {
                    color: #f87171;
                    font-size: 12px;
                    margin-top: 5px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                /* ---- Submit Button ---- */
                .ai-submit {
                    width: 100%;
                    padding: 14px;
                    border: none;
                    border-radius: 14px;
                    font-size: 15px;
                    font-weight: 700;
                    font-family: 'Inter', sans-serif;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    color: white;
                    background: linear-gradient(135deg, #a855f7, #7c3aed, #06b6d4);
                    background-size: 200% 200%;
                    transition: all 0.3s;
                    margin-top: 6px;
                    letter-spacing: 0.3px;
                    position: relative;
                    overflow: hidden;
                }
                .ai-submit:hover:not(:disabled) {
                    background-position: 100% 0;
                    box-shadow: 0 8px 30px rgba(168, 85, 247, 0.4);
                    transform: translateY(-1px);
                }
                .ai-submit:active:not(:disabled) {
                    transform: translateY(0);
                }
                .ai-submit:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                /* ---- Status Messages ---- */
                .ai-status {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 16px;
                    border-radius: 12px;
                    margin-top: 16px;
                    font-size: 13.5px;
                    font-weight: 500;
                    line-height: 1.4;
                    animation: ai-status-in 0.35s ease;
                }
                @keyframes ai-status-in {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .ai-status.success {
                    background: rgba(34, 197, 94, 0.12);
                    border: 1px solid rgba(34, 197, 94, 0.25);
                    color: #4ade80;
                }
                .ai-status.error {
                    background: rgba(239, 68, 68, 0.12);
                    border: 1px solid rgba(239, 68, 68, 0.25);
                    color: #f87171;
                }

                /* ---- Spinner ---- */
                .ai-spinner {
                    animation: ai-spin 1s linear infinite;
                }
                @keyframes ai-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                /* ---- Tooltip on FAB ---- */
                .ai-fab-wrapper {
                    position: fixed;
                    bottom: 28px;
                    right: 28px;
                    z-index: 9999;
                }
                .ai-fab-tooltip {
                    position: absolute;
                    right: 72px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(10,10,20,0.9);
                    backdrop-filter: blur(10px);
                    color: #e2e8f0;
                    padding: 8px 14px;
                    border-radius: 10px;
                    font-size: 13px;
                    font-weight: 500;
                    white-space: nowrap;
                    border: 1px solid rgba(168, 85, 247, 0.3);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.25s;
                    font-family: 'Inter', sans-serif;
                }
                .ai-fab-wrapper:hover .ai-fab-tooltip {
                    opacity: 1;
                }
            `}</style>

            {/* ============ FLOATING ACTION BUTTON ============ */}
            {!isOpen && (
                <div className="ai-fab-wrapper">
                    <div className="ai-fab-tooltip">🤖 Need help? Get an AI call!</div>
                    <button
                        className="ai-help-fab"
                        onClick={() => setIsOpen(true)}
                        aria-label="Get AI Help Call"
                        id="ai-help-button"
                    >
                        <HelpCircle />
                    </button>
                </div>
            )}

            {/* ============ MODAL OVERLAY ============ */}
            {isOpen && (
                <div className="ai-overlay" role="dialog" aria-modal="true" aria-labelledby="ai-modal-title">
                    <div className="ai-modal" ref={modalRef}>
                        <div className="ai-modal-inner">
                            {/* Header */}
                            <div className="ai-modal-header">
                                <div className="ai-modal-title" id="ai-modal-title">
                                    <Sparkles size={22} />
                                    AI Help Assistant
                                </div>
                                <button
                                    className="ai-modal-close"
                                    onClick={handleClose}
                                    disabled={status === 'loading'}
                                    aria-label="Close"
                                    id="ai-modal-close-btn"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <p className="ai-modal-subtitle">
                                Our AI agent will call you and guide you through using DBMS Quora — asking questions, commenting, and more.
                            </p>

                            {/* Form */}
                            {status !== 'success' && (
                                <>
                                    <div className="ai-field">
                                        <label className="ai-label" htmlFor="ai-name-input">Your Name</label>
                                        <input
                                            id="ai-name-input"
                                            className={`ai-input ${errors.name ? 'has-error' : ''}`}
                                            type="text"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: undefined })); }}
                                            disabled={status === 'loading'}
                                            autoFocus
                                        />
                                        {errors.name && <div className="ai-error-text"><AlertCircle size={13} /> {errors.name}</div>}
                                    </div>

                                    <div className="ai-field">
                                        <label className="ai-label" htmlFor="ai-phone-input">Phone Number</label>
                                        <input
                                            id="ai-phone-input"
                                            className={`ai-input ${errors.phone ? 'has-error' : ''}`}
                                            type="tel"
                                            placeholder="+91XXXXXXXXXX"
                                            value={phone}
                                            onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined })); }}
                                            disabled={status === 'loading'}
                                        />
                                        {errors.phone && <div className="ai-error-text"><AlertCircle size={13} /> {errors.phone}</div>}
                                    </div>

                                    <button
                                        className="ai-submit"
                                        onClick={handleSubmit}
                                        disabled={status === 'loading'}
                                        id="ai-call-submit-btn"
                                    >
                                        {status === 'loading' ? (
                                            <>
                                                <Loader2 size={18} className="ai-spinner" />
                                                Connecting...
                                            </>
                                        ) : (
                                            <>
                                                <Phone size={18} />
                                                Call Me
                                            </>
                                        )}
                                    </button>
                                </>
                            )}

                            {/* Success / Error Status */}
                            {status === 'success' && (
                                <div className="ai-status success">
                                    <CheckCircle size={20} />
                                    <span>{message}</span>
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="ai-status error">
                                    <AlertCircle size={20} />
                                    <span>{message}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIHelpButton;
