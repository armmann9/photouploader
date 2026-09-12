/**
 * ============================================================================
 * EventLens AI — Event PIN Gate (PinGate.tsx)
 * ============================================================================
 *
 * PURPOSE:
 *   When a photographer marks an event as PIN-protected (e.g. private weddings
 *   or exclusive corporate events), this full-screen modal appears BEFORE
 *   the guest can view the photo gallery or use the AI face matcher.
 *
 * SECURITY FLOW:
 *   1. Guest scans QR code → opens /event/{slug}
 *   2. event/[id]/page.tsx checks if event.pinCode exists
 *   3. If PIN is set, PinGate renders as a blocking overlay
 *   4. Guest enters 4-digit PIN on large numpad buttons
 *   5. PIN is validated client-side against event.pinCode
 *   6. On success → sessionStorage remembers access for this session
 *   7. Guest can now view gallery and use AI matcher
 *
 * CONNECTIONS:
 *   - Rendered by: event/[id]/page.tsx (when event.pinCode is set)
 *   - Validates against: EventItem.pinCode from db.ts
 *   - Stores session in: sessionStorage (cleared when browser tab closes)
 *
 * DESIGN:
 *   - Full-screen dark glassmorphic overlay with centered PIN input
 *   - Large touch-friendly numpad buttons for mobile event guests
 *   - Animated shake on wrong PIN, smooth success transition
 * ============================================================================
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Lock, ShieldCheck, X, Delete } from 'lucide-react';

interface PinGateProps {
  /** The event's 4-digit PIN code to validate against */
  correctPin: string;
  /** The event title (displayed for context) */
  eventTitle: string;
  /** Called when the guest enters the correct PIN */
  onSuccess: () => void;
}

export default function PinGate({ correctPin, eventTitle, onSuccess }: PinGateProps) {
  const [enteredPin, setEnteredPin] = useState('');
  const [isWrong, setIsWrong] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /** Numpad digit handler */
  const handleDigit = (digit: string) => {
    if (enteredPin.length >= 4) return;
    const newPin = enteredPin + digit;
    setEnteredPin(newPin);
    setIsWrong(false);

    // Auto-validate when 4 digits entered
    if (newPin.length === 4) {
      if (newPin === correctPin) {
        setIsSuccess(true);
        // Save session access so guest doesn't re-enter PIN on page refresh
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`eventlens_pin_${correctPin}`, 'granted');
        }
        setTimeout(() => {
          onSuccess();
        }, 800);
      } else {
        setIsWrong(true);
        setTimeout(() => {
          setEnteredPin('');
          setIsWrong(false);
        }, 600);
      }
    }
  };

  /** Backspace handler */
  const handleDelete = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
    setIsWrong(false);
  };

  const numpadDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 12, 0.97)',
      backdropFilter: 'blur(20px)',
      zIndex: 500,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Lock Icon */}
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '18px',
        background: isSuccess
          ? 'linear-gradient(135deg, #10b981, #34d399)'
          : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        boxShadow: isSuccess
          ? '0 8px 30px rgba(16, 185, 129, 0.5)'
          : '0 8px 30px rgba(99, 102, 241, 0.4)',
        transition: 'all 0.3s ease',
      }}>
        {isSuccess ? <ShieldCheck size={32} color="#fff" /> : <Lock size={32} color="#fff" />}
      </div>

      {/* Title */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 800,
        fontFamily: 'var(--font-heading)',
        textAlign: 'center',
        marginBottom: '8px',
      }}>
        {isSuccess ? 'Access Granted ✓' : 'Private Event Gallery'}
      </h2>

      <p style={{
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        textAlign: 'center',
        marginBottom: '32px',
        maxWidth: '400px',
      }}>
        {isSuccess
          ? `Welcome! Opening ${eventTitle}...`
          : `Enter the 4-digit PIN to view "${eventTitle}" photos and use AI face search.`
        }
      </p>

      {/* PIN Display Dots */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '36px',
        animation: isWrong ? 'shake 0.4s ease' : undefined,
      }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: enteredPin.length > i
                ? (isWrong ? '#f43f5e' : isSuccess ? '#10b981' : '#8b5cf6')
                : 'rgba(255, 255, 255, 0.12)',
              border: `2px solid ${enteredPin.length > i
                ? (isWrong ? '#f43f5e' : isSuccess ? '#10b981' : '#a855f7')
                : 'rgba(255, 255, 255, 0.2)'
              }`,
              transition: 'all 0.15s ease',
              transform: enteredPin.length > i ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Numpad Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 72px)',
        gap: '12px',
      }}>
        {numpadDigits.map((key, idx) => {
          if (key === '') return <div key={idx} />;
          if (key === 'del') {
            return (
              <button
                key={idx}
                onClick={handleDelete}
                style={{
                  width: '72px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <Delete size={20} />
              </button>
            );
          }
          return (
            <button
              key={idx}
              onClick={() => handleDigit(key)}
              style={{
                width: '72px',
                height: '56px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#fff',
                fontSize: '1.3rem',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              }}
            >
              {key}
            </button>
          );
        })}
      </div>

      {/* Wrong PIN Feedback */}
      {isWrong && (
        <p style={{
          marginTop: '20px',
          fontSize: '0.85rem',
          color: '#f43f5e',
          fontWeight: 600,
        }}>
          Incorrect PIN. Please try again.
        </p>
      )}

      {/* Shake animation CSS */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-4px); }
        }
      `}</style>
    </div>
  );
}

/**
 * Helper to check if a guest already has PIN access for this session.
 *
 * USAGE (in event/[id]/page.tsx):
 *   const hasAccess = hasPinAccess(event.pinCode);
 *   if (event.pinCode && !hasAccess) {
 *     return <PinGate ... />;
 *   }
 */
export function hasPinAccess(pinCode: string | undefined): boolean {
  if (!pinCode) return true; // No PIN = public event
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(`eventlens_pin_${pinCode}`) === 'granted';
}
