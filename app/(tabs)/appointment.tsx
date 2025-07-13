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
import { Calendar, Clock, User, Star, CircleCheck as CheckCircle, Stethoscope, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const doctors = [
  {
    id: 1,
    name: 'د. سارة جونسون',
    specialty: 'طبيبة أسنان عامة',
    rating: 4.9,
    experience: '15 سنة',
    price: 150,
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    specialties: ['تنظيف الأسنان', 'علاج التسوس', 'تبييض الأسنان'],
  },
  {
    id: 2,
    name: 'د. أحمد حسن',
    specialty: 'طبيب أسنان تجميلي',
    rating: 4.8,
    experience: '12 سنة',
    price: 200,
    image: 'https://images.pexels.com/photos/6749235/pexels-photo-6749235.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    specialties: ['تقويم الأسنان', 'زراعة الأسنان', 'الفينير'],
  },
  {
    id: 3,
    name: 'د. فاطمة الراشد',
    specialty: 'طبيبة أسنان أطفال',
    rating: 4.9,
    experience: '10 سنوات',
    price: 180,
    image: 'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    specialties: ['أسنان الأطفال', 'العلاج الوقائي', 'التخدير الآمن'],
  },
];

const services = [
  {
    id: 1,
    name: 'فحص شامل',
    duration: '30 دقيقة',
    price: 0,
    description: 'فحص شامل للفم والأسنان',
    icon: '🔍',
  },
  {
    id: 2,
    name: 'تنظيف الأسنان',
    duration: '45 دقيقة',
    price: 80,
    description: 'تنظيف عميق وإزالة الجير',
    icon: '✨',
  },
  {
    id: 3,
    name: 'علاج التسوس',
    duration: '60 دقيقة',
    price: 120,
    description: 'حشو الأسنان المتضررة',
    icon: '🦷',
  },
  {
    id: 4,
    name: 'تبييض الأسنان',
    duration: '90 دقيقة',
    price: 300,
    description: 'تبييض احترافي للأسنان',
    icon: '⭐',
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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
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

  const generateCalendarDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today && !isToday;
      const isWeekend = date.getDay() === 5 || date.getDay() === 6;
      
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        isPast,
        isWeekend,
        fullDate: date,
      });
    }
    
    return dates;
  };

  const navigateStep = (step: number) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDoctorSelect = (doctor: any) => {
    setSelectedDoctor(doctor);
    nextStep();
  };

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    nextStep();
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    nextStep();
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
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

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(currentMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const renderStepNavigation = () => (
    <View style={styles.stepNavigation}>
      <View style={styles.stepIndicators}>
        {[1, 2, 3, 4].map((step) => (
          <TouchableOpacity
            key={step}
            style={[
              styles.stepDot,
              currentStep >= step && styles.stepDotActive,
              currentStep === step && styles.stepDotCurrent,
            ]}
            onPress={() => navigateStep(step)}
            disabled={
              (step === 2 && !selectedDoctor) ||
              (step === 3 && (!selectedDoctor || !selectedService)) ||
              (step === 4 && (!selectedDoctor || !selectedService || !selectedDate))
            }>
            <Text style={[
              styles.stepDotText,
              currentStep >= step && styles.stepDotTextActive,
            ]}>
              {step}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.stepControls}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.stepButton} onPress={prevStep}>
            <ArrowLeft size={16} color="#D4AF37" />
            <Text style={styles.stepButtonText}>السابق</Text>
          </TouchableOpacity>
        )}
        
        <Text style={styles.stepTitle}>
          {currentStep === 1 && 'اختر الطبيب'}
          {currentStep === 2 && 'اختر الخدمة'}
          {currentStep === 3 && 'اختر التاريخ'}
          {currentStep === 4 && 'اختر الوقت'}
        </Text>
        
        {currentStep < 4 && selectedDoctor && (currentStep !== 2 || selectedService) && (currentStep !== 3 || selectedDate) && (
          <TouchableOpacity style={styles.stepButton} onPress={nextStep}>
            <Text style={styles.stepButtonText}>التالي</Text>
            <ChevronLeft size={16} color="#D4AF37" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderDoctorStep = () => (
    <View style={styles.stepContent}>
      {doctors.map((doctor) => (
        <TouchableOpacity
          key={doctor.id}
          style={[
            styles.doctorCard,
            selectedDoctor?.id === doctor.id && styles.selectedCard,
          ]}
          onPress={() => handleDoctorSelect(doctor)}
          activeOpacity={0.8}>
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
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderServiceStep = () => (
    <View style={styles.stepContent}>
      {services.map((service) => (
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
      ))}
    </View>
  );

  const renderCalendarStep = () => {
    const dates = generateCalendarDates();
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    const dayNames = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

    return (
      <View style={styles.stepContent}>
        <View style={styles.calendarContainer}>
          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity 
              style={styles.monthNavButton}
              onPress={() => navigateMonth('next')}>
              <ChevronLeft size={24} color="#D4AF37" />
            </TouchableOpacity>
            
            <Text style={styles.monthTitle}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            
            <TouchableOpacity 
              style={styles.monthNavButton}
              onPress={() => navigateMonth('prev')}>
              <ChevronRight size={24} color="#D4AF37" />
            </TouchableOpacity>
          </View>

          {/* Day Names */}
          <View style={styles.dayNamesRow}>
            {dayNames.map((day) => (
              <Text key={day} style={styles.dayName}>{day}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {dates.map((dateObj, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateCell,
                  !dateObj.isCurrentMonth && styles.dateCellInactive,
                  dateObj.isToday && styles.dateCellToday,
                  selectedDate === dateObj.date && styles.dateCellSelected,
                  dateObj.isPast && styles.dateCellPast,
                  dateObj.isWeekend && dateObj.isCurrentMonth && styles.dateCellWeekend,
                ]}
                onPress={() => !dateObj.isPast && dateObj.isCurrentMonth && handleDateSelect(dateObj.date)}
                disabled={dateObj.isPast || !dateObj.isCurrentMonth}
                activeOpacity={0.7}>
                <Text style={[
                  styles.dateCellText,
                  !dateObj.isCurrentMonth && styles.dateCellTextInactive,
                  dateObj.isToday && styles.dateCellTextToday,
                  selectedDate === dateObj.date && styles.dateCellTextSelected,
                  dateObj.isPast && styles.dateCellTextPast,
                ]}>
                  {dateObj.day}
                </Text>
                {dateObj.isToday && (
                  <View style={styles.todayDot} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderTimeStep = () => (
    <View style={styles.stepContent}>
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
        <Text style={styles.headerTitle}>حجز موعد</Text>
        <Text style={styles.headerSubtitle}>احجز موعدك مع أفضل الأطباء</Text>
      </LinearGradient>

      {/* Step Navigation */}
      {renderStepNavigation()}

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        <Animated.View
          style={[
            styles.stepContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}>
          
          {currentStep === 1 && renderDoctorStep()}
          {currentStep === 2 && renderServiceStep()}
          {currentStep === 3 && renderCalendarStep()}
          {currentStep === 4 && renderTimeStep()}

          {/* Booking Summary */}
          {selectedTime && renderBookingSummary()}
        </Animated.View>
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
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  stepNavigation: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    gap: 15,
  },
  stepDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E1E8ED',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  stepDotActive: {
    backgroundColor: '#D4AF37',
  },
  stepDotCurrent: {
    borderColor: '#4CAF50',
    transform: [{ scale: 1.1 }],
  },
  stepDotText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7F8C8D',
  },
  stepDotTextActive: {
    color: '#FFFFFF',
  },
  stepControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#D4AF37',
    gap: 5,
  },
  stepButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D4AF37',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 180, // Space for fixed tab bar and booking footer
  },
  stepContainer: {
    flex: 1,
  },
  stepContent: {
    padding: 20,
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
    marginLeft: 15,
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
    marginLeft: 15,
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
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7F8C8D',
    textAlign: 'center',
    width: (width - 80) / 7,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCell: {
    width: (width - 80) / 7,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderRadius: 8,
    position: 'relative',
  },
  dateCellInactive: {
    opacity: 0.3,
  },
  dateCellToday: {
    backgroundColor: '#FFF8F0',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  dateCellSelected: {
    backgroundColor: '#4CAF50',
  },
  dateCellPast: {
    opacity: 0.3,
  },
  dateCellWeekend: {
    backgroundColor: '#FFF0F0',
  },
  dateCellText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  dateCellTextInactive: {
    color: '#BDC3C7',
  },
  dateCellTextToday: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  dateCellTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dateCellTextPast: {
    color: '#BDC3C7',
  },
  todayDot: {
    position: 'absolute',
    bottom: 5,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D4AF37',
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
    margin: 20,
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
    marginLeft: 15,
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