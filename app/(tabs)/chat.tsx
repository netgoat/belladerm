import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Phone, Video, MoveHorizontal as MoreHorizontal, Star } from 'lucide-react-native';

const doctors = [
  {
    id: 1,
    name: 'د. سارة جونسون',
    specialty: 'طبيبة جلدية',
    rating: 4.9,
    experience: '15 سنة',
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'online',
    specialties: ['علاج حب الشباب', 'مكافحة الشيخوخة', 'سرطان الجلد'],
  },
  {
    id: 2,
    name: 'د. أحمد حسن',
    specialty: 'طبيب جلدية تجميلي',
    rating: 4.8,
    experience: '12 سنة',
    image: 'https://images.pexels.com/photos/6749235/pexels-photo-6749235.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'online',
    specialties: ['البوتوكس', 'الفيلر', 'العلاج بالليزر'],
  },
  {
    id: 3,
    name: 'د. فاطمة الراشد',
    specialty: 'طبيبة جلدية أطفال',
    rating: 4.9,
    experience: '10 سنوات',
    image: 'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'busy',
    specialties: ['جلد الأطفال', 'الأكزيما', 'الحساسية'],
  },
];

const chatMessages = [
  {
    id: 1,
    text: 'مرحباً! يمكنني مساعدتك في مشاكل البشرة. ما الذي تود مناقشته اليوم؟',
    sender: 'doctor',
    timestamp: '10:30 ص',
  },
  {
    id: 2,
    text: 'مرحباً دكتورة! أواجه مشاكل في ظهور حب الشباب مؤخراً.',
    sender: 'user',
    timestamp: '10:32 ص',
  },
  {
    id: 3,
    text: 'أفهم قلقك. هل يمكنك إخباري المزيد عن روتين العناية بالبشرة الحالي؟',
    sender: 'doctor',
    timestamp: '10:33 ص',
  },
  {
    id: 4,
    text: 'أستخدم منظف لطيف صباحاً ومساءً، ومرطب. هل يجب أن أفعل المزيد؟',
    sender: 'user',
    timestamp: '10:35 ص',
  },
  {
    id: 5,
    text: 'هذه بداية جيدة! للبشرة المعرضة لحب الشباب، أنصح بإضافة علاج بحمض الساليسيليك. هل تريدين أن أوصي ببعض المنتجات المحددة؟',
    sender: 'doctor',
    timestamp: '10:36 ص',
  },
];

export default function ChatScreen() {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [messages, setMessages] = useState(chatMessages);
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate doctor response
      setTimeout(() => {
        const doctorResponse = {
          id: messages.length + 2,
          text: 'شكراً لك على مشاركة هذه المعلومات. دعني أقدم لك بعض التوصيات الشخصية.',
          sender: 'doctor',
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, doctorResponse]);
      }, 1000);
    }
  };

  const renderDoctorCard = (doctor: any) => (
    <TouchableOpacity
      key={doctor.id}
      style={styles.doctorCard}
      onPress={() => setSelectedDoctor(doctor)}>
      <View style={styles.doctorImageContainer}>
        <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
        <View style={[styles.statusIndicator, { backgroundColor: doctor.status === 'online' ? '#4CAF50' : '#FF9800' }]} />
      </View>
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
        <View style={styles.doctorRating}>
          <Star size={16} color="#FFD700" fill="#FFD700" />
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
      </View>
      <View style={styles.doctorActions}>
        <Text style={[styles.statusText, { color: doctor.status === 'online' ? '#4CAF50' : '#FF9800' }]}>
          {doctor.status === 'online' ? 'متاح' : 'مشغول'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = (message: any) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.sender === 'user' ? styles.userMessage : styles.doctorMessage,
      ]}>
      <View
        style={[
          styles.messageBubble,
          message.sender === 'user' ? styles.userBubble : styles.doctorBubble,
        ]}>
        <Text style={[
          styles.messageText,
          message.sender === 'user' ? styles.userMessageText : styles.doctorMessageText,
        ]}>
          {message.text}
        </Text>
      </View>
      <Text style={[styles.messageTime, message.sender === 'user' ? styles.userMessageTime : styles.doctorMessageTime]}>
        {message.timestamp}
      </Text>
    </View>
  );

  if (selectedDoctor) {
    return (
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Chat Header */}
        <LinearGradient
          colors={['#D4AF37', '#E8B4B8']}
          style={styles.chatHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedDoctor(null)}>
            <Text style={styles.backButtonText}>← رجوع</Text>
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <Image source={{ uri: selectedDoctor.image }} style={styles.chatHeaderImage} />
            <View style={styles.chatHeaderText}>
              <Text style={styles.chatHeaderName}>{selectedDoctor.name}</Text>
              <Text style={styles.chatHeaderStatus}>
                {selectedDoctor.status === 'online' ? 'متصل' : 'مشغول'}
              </Text>
            </View>
          </View>
          <View style={styles.chatHeaderActions}>
            <TouchableOpacity style={styles.headerActionButton}>
              <Phone size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionButton}>
              <Video size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionButton}>
              <MoreHorizontal size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}>
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Chat Input */}
        <View style={styles.chatInputContainer}>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}>
            <LinearGradient
              colors={['#D4AF37', '#E8B4B8']}
              style={styles.sendButtonGradient}>
              <Send size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
          <TextInput
            style={styles.chatInput}
            placeholder="اكتب رسالتك..."
            placeholderTextColor="#8E8E93"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            textAlign="right"
          />
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#D4AF37', '#E8B4B8']}
        style={styles.header}>
        <Text style={styles.headerTitle}>محادثة مع الخبراء</Text>
        <Text style={styles.headerSubtitle}>تواصل مع أطباء الجلدية المعتمدين</Text>
      </LinearGradient>

      {/* Doctors List */}
      <ScrollView 
        style={styles.doctorsList} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الأطباء المتاحون</Text>
          {doctors.map(renderDoctorCard)}
        </View>

        {/* Quick Topics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>مواضيع سريعة</Text>
          <View style={styles.topicsGrid}>
            {[
              'علاج حب الشباب',
              'مكافحة الشيخوخة',
              'حساسية البشرة',
              'توصيات المنتجات',
              'نصائح الروتين',
              'تحليل البشرة',
            ].map((topic, index) => (
              <TouchableOpacity key={index} style={styles.topicCard}>
                <Text style={styles.topicText}>{topic}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
  doctorsList: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 120, // Space for fixed tab bar
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'right',
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  doctorImageContainer: {
    position: 'relative',
    marginLeft: 15,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
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
    marginBottom: 10,
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
  },
  specialtyTag: {
    backgroundColor: '#E8F5E8',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 5,
    marginBottom: 5,
  },
  specialtyText: {
    fontSize: 12,
    color: '#7CB342',
    fontWeight: '600',
  },
  doctorActions: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  topicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    width: '48%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  topicText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  chatHeader: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
  },
  chatHeaderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  chatHeaderText: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'right',
  },
  chatHeaderActions: {
    flexDirection: 'row',
    gap: 10,
  },
  headerActionButton: {
    padding: 5,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  messageContainer: {
    marginBottom: 15,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  doctorMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#D4AF37',
    borderBottomRightRadius: 5,
  },
  doctorBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
    textAlign: 'right',
  },
  doctorMessageText: {
    color: '#2C3E50',
    textAlign: 'right',
  },
  messageTime: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 5,
  },
  userMessageTime: {
    textAlign: 'right',
  },
  doctorMessageTime: {
    textAlign: 'left',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
  },
  chatInput: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 10,
    maxHeight: 100,
    fontSize: 16,
    color: '#2C3E50',
  },
  sendButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});