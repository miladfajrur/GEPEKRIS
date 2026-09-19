import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useChurchContent } from '../context/ChurchContentContext';

export function Contact() {
  const { content } = useChurchContent();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: content.info.phone,
      subtitle: "Call us anytime"
    },
    {
      icon: Mail,
      title: "Email",
      details: content.info.email,
      subtitle: "Send us a message"
    },
    {
      icon: MapPin,
      title: "Address",
      details: content.info.address,
      subtitle: "Come visit us"
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: content.info.officeHours,
      subtitle: "Saturday & Sunday: Closed"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 bg-gray-50 border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you. Reach out with any questions or to learn more about our church
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Contact Information</h3>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((info) => {
                const IconComponent = info.icon;
                return (
                  <Card key={info.title} className="hover:shadow-md transition-shadow bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="mr-4 mt-0.5">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1 text-gray-900">{info.title}</h4>
                          <p className="text-gray-900 text-sm mb-1">{info.details}</p>
                          <p className="text-xs text-gray-500">{info.subtitle}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Interactive Map */}
            <div className="bg-gray-100 rounded-xl h-64 overflow-hidden border border-gray-200 relative shadow-inner">
              <iframe
                title="Church Location Map"
                src={content.info.mapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
              />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-sm text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{content.info.address}</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">Send us a Message</h3>
                
                {submitted ? (
                  <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl font-bold text-emerald-900">Thank you, {formData.firstName}!</h4>
                    <p className="text-sm text-emerald-700 leading-relaxed">
                      Your message has been received. Our ministry staff will get back to you within 24–48 hours.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          firstName: '',
                          lastName: '',
                          email: '',
                          phone: '',
                          subject: '',
                          message: ''
                        });
                      }}
                      className="mt-2"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-gray-700">
                          First Name *
                        </label>
                        <Input
                          id="firstName"
                          required
                          placeholder="Your first name"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-gray-700">
                          Last Name
                        </label>
                        <Input
                          id="lastName"
                          placeholder="Your last name"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1 text-gray-700">
                        Phone (Optional)
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1 text-gray-700">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1 text-gray-700">
                        Message *
                      </label>
                      <Textarea 
                        id="message" 
                        required
                        placeholder="Tell us how we can help you..."
                        className="min-h-32"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full cursor-pointer">
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
