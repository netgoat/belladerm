import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Calendar, Star, Users, Award, Sparkles, MessageCircle, Camera, TrendingUp } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const services = [
  {
    id: 1,
    title: 'فحص الصورة الذكي',
    description: 'فحص صحة الفم بالذكاء الاصطناعي',
    icon: Camera,
    color: '#9C27B0',
    route: '/photo-health-check',
  },
  {
    id: 2,
    title: 'فحص الأولوية',
    description: 'تحديد أولوية الموعد بالذكاء الاصطناعي',
    icon: TrendingUp,
    color: '#E8B4B8',
    route: '/urgency-check',
  },
  {
    id: 3,
    title: 'حجز موعد',
    description: 'احجز مع الخبراء',
    icon: Calendar,
    color: '#D4AF37',
    route: '/appointment',
  },
  {
    id: 4,
    title: 'محادثة مباشرة',
    description: 'تحدث مع أطباء الأسنان',
    icon: MessageCircle,
    color: '#4CAF50',
    route: '/chat',
  },
];

const testimonials = [
  {
    id: 1,
    name: 'سارة أحمد',
    rating: 5,
    text: 'نتائج مذهلة! أسناني لم تكن أفضل من ذلك أبداً.',
    image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 2,
    name: 'ليلى محمد',
    rating: 5,
    text: 'خدمة مهنية ومنتجات ممتازة.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderServiceCard = (service: any) => (
    <TouchableOpacity
      key={service.id}
      style={styles.serviceCard}
      onPress={() => router.push(service.route)}
      activeOpacity={0.8}>
      <LinearGradient
        colors={[service.color, `${service.color}80`]}
        style={styles.serviceGradient}>
        <View style={styles.serviceIcon}>
          <service.icon size={28} color="#FFFFFF" />
        </View>
        <Text style={styles.serviceTitle}>{service.title}</Text>
        <Text style={styles.serviceDescription}>{service.description}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderTestimonialCard = (testimonial: any) => (
    <View key={testimonial.id} style={styles.testimonialCard}>
      <View style={styles.testimonialHeader}>
        <Image source={{ uri: testimonial.image }} style={styles.testimonialImage} />
        <View style={styles.testimonialInfo}>
          <Text style={styles.testimonialName}>{testimonial.name}</Text>
          <View style={styles.testimonialRating}>
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} size={14} color="#FFD700" fill="#FFD700" />
            ))}
          </View>
        </View>
      </View>
      <Text style={styles.testimonialText}>{testimonial.text}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#D4AF37', '#E8B4B8']}
        style={styles.header}>
        <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
          <Text style={styles.welcomeText}>أهلاً بك في</Text>
          <Text style={styles.brandText}>عيادات رويال للعناية بالأسنان</Text>
          <Text style={styles.taglineText}>رحلتك نحو ابتسامة مشرقة تبدأ هنا</Text>
        </Animated.View>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Users size={24} color="#4CAF50" />
          <Text style={styles.statNumber}>50K+</Text>
          <Text style={styles.statLabel}>مريض سعيد</Text>
        </View>
        <View style={styles.statCard}>
          <Award size={24} color="#FF9800" />
          <Text style={styles.statNumber}>98%</Text>
          <Text style={styles.statLabel}>معدل النجاح</Text>
        </View>
        <View style={styles.statCard}>
          <Star size={24} color="#FFD700" />
          <Text style={styles.statNumber}>4.9</Text>
          <Text style={styles.statLabel}>التقييم</Text>
        </View>
      </View>

      {/* Services */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>خدماتنا</Text>
          <Sparkles size={20} color="#D4AF37" />
        </View>
        <View style={styles.servicesGrid}>
          {services.map(renderServiceCard)}
        </View>
      </View>

      {/* Testimonials */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>آراء عملائنا</Text>
          <Star size={20} color="#D4AF37" />
        </View>
        <View style={styles.testimonialsContainer}>
          {testimonials.map(renderTestimonialCard)}
        </View>
      </View>

      {/* CTA */}
      <View style={styles.ctaSection}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/appointment')}
          activeOpacity={0.8}>
          <LinearGradient
            colors={['#4CAF50', '#66BB6A']}
            style={styles.ctaGradient}>
            <Text style={styles.ctaTitle}>هل أنت مستعد لتحويل ابتسامتك؟</Text>
            <Text style={styles.ctaSubtitle}>احجز استشارتك اليوم</Text>
            <View style={styles.ctaButtonInner}>
              <Calendar size={18} color="#FFFFFF" />
              <Text style={styles.ctaButtonText}>احجز الآن</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '400',
  },
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 8,
    textAlign: 'center',
  },
  taglineText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: -15,
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 80,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  serviceCard: {
    width: (width - 52) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  serviceGradient: {
    padding: 20,
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceIcon: {
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  serviceDescription: {
    fontSize: 11,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 16,
  },
  testimonialsContainer: {
    gap: 16,
  },
  testimonialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testimonialImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'right',
  },
  testimonialRating: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  testimonialText: {
    fontSize: 13,
    color: '#7F8C8D',
    lineHeight: 18,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Space for tab bar
  },
  ctaButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  ctaGradient: {
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});