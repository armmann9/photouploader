'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  PlusCircle,
  Calendar,
  MapPin,
  Image as ImageIcon,
  UploadCloud,
  QrCode,
  Eye,
  Settings,
  X,
  Sparkles,
  Cloud,
  Lock,
  Globe,
  Layers,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { getAllEvents, createEvent } from '@/lib/db';
import { EventItem } from '@/lib/types';
import EventCard from '@/components/EventCard';
import CloudConfigModal from '@/components/CloudConfigModal';
import { isCloudConfigured } from '@/lib/supabase';

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [cloudActive, setCloudActive] = useState(false);

  // New Event Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState<EventItem['category']>('Wedding');
  const [description, setDescription] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [photographerName, setPhotographerName] = useState('Event Photography Studio');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadEvents();
    setCloudActive(isCloudConfigured());

    if (searchParams && searchParams.get('new') === 'true') {
      setShowCreateModal(true);
    }
  }, [searchParams]);

  const loadEvents = async () => {
    setLoading(true);
    const data = await getAllEvents();
    setEvents(data);
    setLoading(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    setIsSubmitting(true);
    try {
      await createEvent({
        title,
        slug: slug || `event-${Date.now()}`,
        date,
        location,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
        category,
        description,
        pinCode: pinCode || undefined,
        isPublic: true,
        photographerName,
      });

      setShowCreateModal(false);
      resetForm();
      await loadEvents();
    } catch (err) {
      console.error('Error creating event:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setDate(new Date().toISOString().split('T')[0]);
    setLocation('');
    setCoverImage('');
    setDescription('');
    setPinCode('');
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Dashboard Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '36px',
          paddingBottom: '24px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-event">Event Management</span>
              <span className="badge badge-ai"><Sparkles size={11} /> AI Indexing Active</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Photographer & Host Portal</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Create event galleries, bulk upload 200+ photos, and generate instant venue QR codes.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setShowConfigModal(true)}
              className="btn-secondary"
              style={{ padding: '10px 18px', fontSize: '0.85rem' }}
            >
              <Cloud size={16} />
              <span>{cloudActive ? 'Cloud Storage: Connected' : 'Connect Supabase'}</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.9rem' }}
            >
              <PlusCircle size={18} />
              <span>New Event</span>
            </button>
          </div>
        </div>

        {/* Cloud Status Info Callout */}
        {!cloudActive && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '14px',
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Cloud size={22} color="#f59e0b" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fbbf24' }}>
                  Running in Instant Demo / Local Storage Mode
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  To save unlimited photos permanently in the cloud, connect your free Supabase URL & Key.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowConfigModal(true)}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', background: '#f59e0b' }}
            >
              Connect Supabase Cloud
            </button>
          </div>
        )}

        {/* Events Grid */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
              Your Managed Events ({events.length})
            </h2>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              Loading dashboard events...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '28px',
            }}>
              {events.map((evt) => (
                <EventCard key={evt.id} event={evt} isAdminView={true} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div className="glass-panel" style={{
            maxWidth: '620px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowCreateModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                color: 'var(--text-muted)',
                padding: '6px',
                borderRadius: '50%',
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <PlusCircle size={22} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Create New Event Gallery</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Set up your event page and prepare for bulk photo uploading.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram & Priya Royal Wedding 2026"
                  value={title}
                  onChange={handleTitleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: '#121826',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontSize: '0.9rem',
                    }}
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate">Corporate Summit</option>
                    <option value="Birthday">Birthday / Anniversary</option>
                    <option value="Concert">Concert / Festival</option>
                    <option value="Fashion">Fashion / Gala</option>
                    <option value="Other">Other Celebration</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Venue / Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Taj Lake Palace, Udaipur"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Cover Banner Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Custom Web Link Slug
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0 12px',
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>/event/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="my-awesome-event"
                    style={{
                      flex: 1,
                      padding: '12px 6px',
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ flex: 1, padding: '14px' }}
                >
                  {isSubmitting ? 'Creating Event...' : 'Create Event & Proceed'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                  style={{ padding: '14px 20px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cloud Config Modal */}
      {showConfigModal && (
        <CloudConfigModal
          onClose={() => {
            setShowConfigModal(false);
            setCloudActive(isCloudConfigured());
          }}
        />
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '120px 0', color: 'var(--text-muted)' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 16px', color: '#6366f1' }} />
        <p>Loading Admin Portal...</p>
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}
