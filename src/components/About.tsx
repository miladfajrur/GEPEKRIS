import { Heart, Users, Book, Star, Shield } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useChurchContent } from '../context/ChurchContentContext';

export function About() {
  const { content } = useChurchContent();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users':
        return Users;
      case 'Book':
        return Book;
      case 'Star':
        return Star;
      case 'Shield':
        return Shield;
      case 'Heart':
      default:
        return Heart;
    }
  };

  return (
    <section id="about" className="py-16 bg-white border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <ImageWithFallback
              src={content.about.image}
              alt="Community gathering"
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
              {content.about.heading}
            </h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              {content.about.paragraph1}
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {content.about.paragraph2}
            </p>

            {/* Values Grid */}
            <div className="grid grid-cols-2 gap-6">
              {content.about.values.map((value) => {
                const IconComponent = getIcon(value.iconName);
                return (
                  <div key={value.title} className="text-center p-3 rounded-lg bg-gray-50/70 border border-gray-100">
                    <div className="mb-2">
                      <IconComponent className="h-7 w-7 text-primary mx-auto" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{value.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
