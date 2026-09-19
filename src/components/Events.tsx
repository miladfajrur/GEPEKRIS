import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useChurchContent, ChurchEventItem } from '../context/ChurchContentContext';

interface EventsProps {
  onReadArticle?: (eventId: string) => void;
}

export function Events({ onReadArticle }: EventsProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { content } = useChurchContent();

  const categoryColors: Record<string, string> = {
    "Special Service": "bg-purple-100 text-purple-800",
    "Ibadah Khusus": "bg-purple-100 text-purple-800",
    "Outreach": "bg-green-100 text-green-800",
    "Diakonia": "bg-emerald-100 text-emerald-800",
    "Fellowship": "bg-blue-100 text-blue-800",
    "Retret": "bg-amber-100 text-amber-800",
    "Youth": "bg-orange-100 text-orange-800",
    "Special Event": "bg-red-100 text-red-800"
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
  };

  return (
    <section id="events" className="py-16 bg-white border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="text-left">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Warta & Kegiatan Jemaat</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Berita & Acara Terkini
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mt-2">
              Informasi lengkap kegiatan, warta jemaat, dan jadwal persekutuan di GEPEKRIS Tretes
            </p>
          </div>

          {onReadArticle && content.events.length > 0 && (
            <Button
              variant="outline"
              onClick={() => onReadArticle(content.events[0].id)}
              className="cursor-pointer self-start sm:self-auto gap-2 border-primary/30 text-primary hover:bg-primary/5"
            >
              <span>Buka Halaman Warta Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {content.events.map((event) => (
            <Card 
              key={event.id || event.title} 
              className={`overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col justify-between ${
                event.featured ? 'ring-2 ring-primary' : ''
              }`}
            >
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <Badge 
                      variant="secondary" 
                      className={categoryColors[event.category] || "bg-gray-100 text-gray-800"}
                    >
                      {event.category}
                    </Badge>
                    {event.featured && (
                      <Badge className="bg-primary text-white">Warta Utama</Badge>
                    )}
                  </div>
                  
                  <h3 
                    onClick={() => onReadArticle?.(event.id)}
                    className="text-xl font-bold mb-3 text-gray-900 hover:text-primary transition-colors cursor-pointer"
                  >
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{event.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2 text-primary shrink-0" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2 text-primary shrink-0" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2 text-primary shrink-0" />
                      {event.location}
                    </div>
                  </div>
                </div>
                
                <Button
                  className="w-full cursor-pointer gap-2"
                  onClick={() => onReadArticle?.(event.id)}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Baca Berita Selengkapnya</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gray-50 rounded-xl p-8 border border-gray-100 max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold mb-2 text-gray-900">Stay Updated</h3>
          <p className="text-gray-600 mb-6 text-sm">
            Get the latest news and event announcements delivered to your inbox
          </p>
          
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-2 border rounded-md text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-primary flex-1"
              />
              <Button type="submit" size="lg" className="cursor-pointer">
                Subscribe to Newsletter
              </Button>
            </form>
          ) : (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg text-sm inline-flex items-center gap-2 font-medium">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Thank you! You are subscribed to church newsletters.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
