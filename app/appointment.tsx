import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Calendar, Clock, User, Star, CircleCheck as CheckCircle, ArrowLeft, Stethoscope } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const doctors = [
  {
    id: 1,
    name: 'د. سارة جونسون',
    specialty: 'طبيبة جلدية',
    rating: 4.9,
    experience: '15 سنة',
    price: 150,
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    specialties: ['علاج حب الشباب', 'مكافحة الشيخوخة', 'سرطان الجلد'],
  },
  {
    id: 2,
    name: 'د. أحمد حسن',
    specialty: 'طبيب جلدية تجميلي',
    rating: 4.8,
    experience: '12 سنة',
    price: 200,
    image: 'https://images.pexels.com/photos/6749235/pexels-photo-6749235.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    specialties: ['البوتوكس', 'الفيلر', 'العلاج بالليزر'],
  },
  {
    id: 3,
    name: 'د. فاطمة الراشد',
    specialty: 'طبيبة جلدية أطفال',
    rating: 4.9,
    experience: '10 سنوات',
    price: 180,
    image: 'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    specialties: ['جلد الأطفال', 'الأكزيما', 'الحساسية'],
  },
];

const services = [
  {
    id: 1,
    name: 'استشارة عامة',
    duration: '30 دقيقة',
    price: 0,
    description: 'فحص شامل للبشرة وتقييم الحالة',
    icon: '🩺',
  },
  {
    id: 2,
    name: 'علاج حب الشباب',
    duration: '45 دقيقة',
    price: 50,
    description: 'علاج متخصص لحب الشباب والندبات',
    icon: '✨',
  },
  {
    id: 3,
    name: 'استشارة مكافحة الشيخوخة',
    duration: '60 دقيقة',
    price: 100,
    description: 'خطة شاملة لمكافحة علامات التقدم في السن',
    icon: '🌟',
  },
  {
    id: 4,
    name: 'تحليل البشرة بالذكاء الاصطناعي',
    duration: '30 دقيقة',
    price: 25,
    description: 'تحليل متقدم باستخدام التكنولوجيا الحديثة',
    icon: '🤖',
  },
];

const timeSlots = [
  '9:00 ص', '9:30 ص', '10:00 ص', '10:30 ص',
  '11:00 ص', '11:30 ص', '2:00 م', '2:30 م',
  '3:00 م', '3:30 م', '4:00 م', '4:30 م',
];

export default function AppointmentScreen() {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 21; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        month: date.toLocaleDateString('ar-SA', { month: 'short' }),
        weekday: date.toLocaleDateString('ar-SA', { weekday: 'short' }),
        isToday: i === 0,
        isWeekend: date.getDay() === 5 || date.getDay() === 6,
      });
    }
    return dates;
  };

  const dates = generateDates();

  const scrollToNextStep = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: currentStep * 300,
        animated: true,
      });
    }, 300);
  };

  const handleDoctorSelect = (doctor: any) => {
    setSelectedDoctor(doctor);
    setCurrentStep(2);
    scrollToNextStep();
  };

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setCurrentStep(3);
    scrollToNextStep();
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setCurrentStep(4);
    scrollToNextStep();
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentStep(5);
  };

  const handleBooking = () => {
    if (!selectedDoctor || !selectedService || !selectedDate || !selectedTime) {
      Alert.alert('اختيار غير مكتمل', 'يرجى اختيار جميع الخيارات المطلوبة');
      return;
    }

    const totalCost = selectedDoctor.price + selectedService.price;
    
    Alert.alert(
      'تم تأكيد الحجز! 🎉',
      `تم حجز موعدك مع ${selectedDoctor.name}\n\nالخدمة: ${selectedService.name}\nالتاريخ: ${selectedDate}\nالوقت: ${selectedTime}\n\nالتكلفة الإجمالية: ${totalCost} ريال`,
      [
        {
          text: 'رائع!',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((step) => (
        <View key={step} style={styles.stepIndicatorContainer}>
          <View style={[
            styles.stepCircle,
            currentStep >= step && styles.stepCircleActive,
            currentStep > step && styles.stepCircleCompleted,
          ]}>
            {currentStep > step ? (
              <CheckCircle size={16} color="#FFFFFF" />
            ) : (
              <Text style={[
                styles.stepNumber,
                currentStep >= step && styles.stepNumberActive,
              ]}>
                {step}
              </Text>
            )}
          </View>
          {step < 4 && (
            <View style={[
              styles.stepLine,
              currentStep > step && styles.stepLineCompleted,
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderDoctorCard = (doctor: any) => (
    <TouchableOpacity
      key={doctor.id}
      style={[
        styles.doctorCard,
        selectedDoctor?.id === doctor.id && styles.selectedCard,
      ]}
      onPress={() => handleDoctorSelect(doctor)}
      activeOpacity={0.8}>
      <Animated.View style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}>
        <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
          <View style={styles.doctorRating}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>{doctor.rating}</Text>
            <Text style={styles.experienceText}>• {doctor.experience}</Text>
          </View>
          <View style={styles.specialtiesContainer}>
            {doctor.specialties.slice(0, 2).map((specialty: string, index: number) => (
              <View key={index} style={styles.specialtyTag}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.doctorPrice}>من {doctor.price} ريال</Text>
        </View>
        {selectedDoctor?.id === doctor.id && (
          <View style={styles.selectedBadge}>
            <CheckCircle size={20} color="#4CAF50" />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );

  const renderServiceCard = (service: any) => (
    <TouchableOpacity
      key={service.id}
      style={[
        styles.serviceCard,
        selectedService?.id === service.id && styles.selectedCard,
      ]}
      onPress={() => handleServiceSelect(service)}
      activeOpacity={0.8}>
      <View style={styles.serviceIcon}>
        <Text style={styles.serviceEmoji}>{service.icon}</Text>
      </View>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.serviceDescription}>{service.description}</Text>
        <View style={styles.serviceDetails}>
          <Text style={styles.serviceDuration}>{service.duration}</Text>
          <Text style={styles.servicePrice}>
            {service.price > 0 ? `+${service.price} ريال` : 'مشمول'}
          </Text>
        </View>
      </View>
      {selectedService?.id === service.id && (
        <View style={styles.selectedBadge}>
          <CheckCircle size={20} color="#4CAF50" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderCalendarGrid = () => (
    <View style={styles.calendarGrid}>
      {dates.map((dateObj, index) => (
        <TouchableOpacity
          key={dateObj.date}
          style={[
            styles.dateCard,
            selectedDate === dateObj.date && styles.selectedDateCard,
            dateObj.isToday && styles.todayCard,
            dateObj.isWeekend && styles.weekendCard,
          ]}
          onPress={() => handleDateSelect(dateObj.date)}
          activeOpacity={0.8}>
          <Text style={[
            styles.dateWeekday,
            selectedDate === dateObj.date && styles.selectedDateText,
            dateObj.isToday && styles.todayText,
          ]}>
            {dateObj.weekday}
          </Text>
          <Text style={[
            styles.dateDay,
            selectedDate === dateObj.date && styles.selectedDateText,
            dateObj.isToday && styles.todayText,
          ]}>
            {dateObj.day}
          </Text>
          <Text style={[
            styles.dateMonth,
            selectedDate === dateObj.date && styles.selectedDateText,
            dateObj.isToday && styles.todayText,
          ]}>
            {dateObj.month}
          </Text>
          {dateObj.isToday && (
            <View style={styles.todayIndicator}>
              <Text style={styles.todayIndicatorText}>اليوم</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTimeSlots = () => (
    <View style={styles.timeSlotsGrid}>
      {timeSlots.map((time) => (
        <TouchableOpacity
          key={time}
          style={[
            styles.timeSlot,
            selectedTime === time && styles.selectedTimeSlot,
          ]}
          onPress={() => handleTimeSelect(time)}
          activeOpacity={0.8}>
          <LinearGradient
            colors={selectedTime === time ? ['#4CAF50', '#66BB6A'] : ['#FFFFFF', '#F8F9FA']}
            style={styles.timeSlotGradient}>
            <Clock size={16} color={selectedTime === time ? '#FFFFFF' : '#7F8C8D'} />
            <Text style={[
              styles.timeText,
              selectedTime === time && styles.selectedTimeText,
            ]}>
              {time}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderBookingSummary = () => (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>ملخص الحجز</Text>
      
      <View style={styles.summaryItem}>
        <View style={styles.summaryIcon}>
          <User size={20} color="#D4AF37" />
        </View>
        <View style={styles.summaryDetails}>
          <Text style={styles.summaryLabel}>الطبيب</Text>
          <Text style={styles.summaryValue}>{selectedDoctor?.name}</Text>
        </View>
      </View>

      <View style={styles.summaryItem}>
        <View style={styles.summaryIcon}>
          <Stethoscope size={20} color="#D4AF37" />
        </View>
        <View style={styles.summaryDetails}>
          <Text style={styles.summaryLabel}>الخدمة</Text>
          <Text style={styles.summaryValue}>{selectedService?.name}</Text>
        </View>
      </View>

      <View style={styles.summaryItem}>
        <View style={styles.summaryIcon}>
          <Calendar size={20} color="#D4AF37" />
        </View>
        <View style={styles.summaryDetails}>
          <Text style={styles.summaryLabel}>التاريخ والوقت</Text>
          <Text style={styles.summaryValue}>{selectedDate} - {selectedTime}</Text>
        </View>
      </View>

      <View style={styles.summaryDivider} />
      
      <View style={styles.summaryTotal}>
        <Text style={styles.summaryTotalLabel}>الإجمالي</Text>
        <Text style={styles.summaryTotalValue}>
          {(selectedDoctor?.price || 0) + (selectedService?.price || 0)} ريال
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#D4AF37', '#E8B4B8']}
        style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>حجز موعد</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      {/* Step Indicator */}
      {renderStepIndicator()}

      <ScrollView 
        ref={scrollViewRef}
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Step 1: Select Doctor */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={[styles.stepNumberText, currentStep >= 1 && styles.stepNumberActive]}>1</Text>
            </View>
            <Text style={styles.stepTitle}>اختر الطبيب</Text>
          </View>
          <View style={styles.doctorsGrid}>
            {doctors.map(renderDoctorCard)}
          </View>
        </Animated.View>

        {/* Step 2: Select Service */}
        {selectedDoctor && (
          <Animated.View style={styles.section}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumber}>
                <Text style={[styles.stepNumberText, currentStep >= 2 && styles.stepNumberActive]}>2</Text>
              </View>
              <Text style={styles.stepTitle}>اختر الخدمة</Text>
            </View>
            <View style={styles.servicesContainer}>
              {services.map(renderServiceCard)}
            </View>
          </Animated.View>
        )}

        {/* Step 3: Select Date */}
        {selectedService && (
          <Animated.View style={styles.section}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumber}>
                <Text style={[styles.stepNumberText, currentStep >= 3 && styles.stepNumberActive]}>3</Text>
              </View>
              <Text style={styles.stepTitle}>اختر التاريخ</Text>
            </View>
            {renderCalendarGrid()}
          </Animated.View>
        )}

        {/* Step 4: Select Time */}
        {selectedDate && (
          <Animated.View style={styles.section}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumber}>
                <Text style={[styles.stepNumberText, currentStep >= 4 && styles.stepNumberActive]}>4</Text>
              </View>
              <Text style={styles.stepTitle}>اختر الوقت</Text>
            </View>
            {renderTimeSlots()}
          </Animated.View>
        )}

        {/* Booking Summary */}
        {selectedTime && renderBookingSummary()}
      </ScrollView>

      {/* Book Button */}
      {selectedTime && (
        <View style={styles.bookingFooter}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBooking}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#4CAF50', '#66BB6A']}
              style={styles.bookButtonGradient}>
              <Calendar size={20} color="#FFFFFF" />
              <Text style={styles.bookButtonText}>تأكيد الحجز</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 34,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E1E8ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#D4AF37',
  },
  stepCircleCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7F8C8D',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E1E8ED',
    marginHorizontal: 8,
  },
  stepLineCompleted: {
    backgroundColor: '#4CAF50',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 30,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginRight: 15,
  },
  doctorsGrid: {
    gap: 15,
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#F8FFF8',
  },
  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
    textAlign: 'right',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 5,
    textAlign: 'right',
  },
  doctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'flex-end',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 5,
    marginRight: 5,
  },
  experienceText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  specialtyTag: {
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginLeft: 4,
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
  },
  doctorPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'right',
  },
  selectedBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  servicesContainer: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  serviceEmoji: {
    fontSize: 24,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
    textAlign: 'right',
  },
  serviceDescription: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 8,
    textAlign: 'right',
    lineHeight: 16,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceDuration: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  dateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: (width - 80) / 7,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedDateCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  todayCard: {
    borderColor: '#D4AF37',
  },
  weekendCard: {
    backgroundColor: '#FFF8F0',
  },
  dateWeekday: {
    fontSize: 10,
    color: '#7F8C8D',
    marginBottom: 4,
    fontWeight: '600',
  },
  dateDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  dateMonth: {
    fontSize: 9,
    color: '#7F8C8D',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  todayText: {
    color: '#D4AF37',
  },
  todayIndicator: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  todayIndicatorText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  timeSlot: {
    width: (width - 60) / 3,
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedTimeSlot: {
    transform: [{ scale: 1.02 }],
  },
  timeSlotGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 12,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 8,
  },
  selectedTimeText: {
    color: '#FFFFFF',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  summaryDetails: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 2,
    textAlign: 'right',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'right',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E1E8ED',
    marginVertical: 15,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  bookingFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  bookButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  bookButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
});