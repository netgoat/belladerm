import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Brain, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Clock, Calendar, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const questions = [
  {
    id: 1,
    question: 'هل تعاني من نزيف في اللثة؟',
    icon: '🩸',
    urgencyWeight: 3,
  },
  {
    id: 2,
    question: 'هل تشعر بحساسية في الأسنان؟',
    icon: '❄️',
    urgencyWeight: 2,
  },
  {
    id: 3,
    question: 'هل تعاني من ألم في الأسنان؟',
    icon: '😣',
    urgencyWeight: 4,
  },
  {
    id: 4,
    question: 'هل تلاحظ تورم في اللثة؟',
    icon: '🔴',
    urgencyWeight: 3,
  },
  {
    id: 5,
    question: 'هل تعاني من رائحة كريهة في الفم؟',
    icon: '💨',
    urgencyWeight: 2,
  },
  {
    id: 6,
    question: 'هل تشعر بألم عند المضغ؟',
    icon: '🍎',
    urgencyWeight: 3,
  },
  {
    id: 7,
    question: 'هل لديك أسنان متحركة؟',
    icon: '🦷',
    urgencyWeight: 4,
  },
  {
    id: 8,
    question: 'هل تعاني من صداع متكرر؟',
    icon: '🤕',
    urgencyWeight: 2,
  },
];

const urgencyLevels = {
  low: {
    title: 'زيارة روتينية',
    subtitle: 'يمكن الحجز خلال 3 أشهر',
    description: 'حالتك مستقرة ولا تحتاج لتدخل عاجل. ننصح بزيارة دورية للفحص والوقاية.',
    color: '#4CAF50',
    icon: '✅',
    recommendation: 'احجز موعد روتيني خلال 3 أشهر',
    tips: [
      'حافظ على نظافة الأسنان اليومية',
      'استخدم خيط الأسنان',
      'تجنب السكريات الزائدة',
    ],
  },
  medium: {
    title: 'احجز خلال أسبوعين',
    subtitle: 'أعراض تحتاج متابعة',
    description: 'لديك بعض الأعراض التي تحتاج لفحص طبي. ننصح بالحجز خلال أسبوعين.',
    color: '#FF9800',
    icon: '⚠️',
    recommendation: 'احجز موعد خلال أسبوعين',
    tips: [
      'تجنب الأطعمة الصلبة',
      'استخدم غسول فم مطهر',
      'راقب تطور الأعراض',
    ],
  },
  high: {
    title: 'احجز خلال أسبوع',
    subtitle: 'أعراض تحتاج عناية سريعة',
    description: 'لديك أعراض تحتاج لعناية طبية سريعة. ننصح بالحجز خلال أسبوع.',
    color: '#FF5722',
    icon: '🚨',
    recommendation: 'احجز موعد خلال أسبوع',
    tips: [
      'تجنب الأطعمة الساخنة والباردة',
      'استخدم مسكن ألم إذا لزم الأمر',
      'لا تؤجل الزيارة',
    ],
  },
  urgent: {
    title: 'احجز فوراً',
    subtitle: 'حالة طارئة',
    description: 'لديك أعراض طارئة تحتاج لتدخل فوري. ننصح بالحجز في أقرب وقت ممكن.',
    color: '#F44336',
    icon: '🆘',
    recommendation: 'احجز موعد طارئ اليوم',
    tips: [
      'اتصل بالعيادة فوراً',
      'تجنب الأطعمة تماماً إذا كان الألم شديد',
      'استخدم كمادات باردة للتورم',
    ],
  },
};

export default function UrgencyCheckScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: boolean }>({});
  const [showResult, setShowResult] = useState(false);
  const [urgencyScore, setUrgencyScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start entrance animations
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

    // Update progress animation
    Animated.timing(progressAnim, {
      toValue: currentQuestion / questions.length,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Pulse animation for AI analysis
    if (isAnalyzing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [currentQuestion, isAnalyzing]);

  const handleAnswer = (answer: boolean) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate urgency score
      analyzeSymptoms(newAnswers);
    }
  };

  const analyzeSymptoms = (finalAnswers: { [key: number]: boolean }) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      let score = 0;
      questions.forEach((question) => {
        if (finalAnswers[question.id]) {
          score += question.urgencyWeight;
        }
      });

      setUrgencyScore(score);
      setIsAnalyzing(false);
      setShowResult(true);
    }, 2000);
  };

  const getUrgencyLevel = () => {
    if (urgencyScore >= 12) return urgencyLevels.urgent;
    if (urgencyScore >= 8) return urgencyLevels.high;
    if (urgencyScore >= 4) return urgencyLevels.medium;
    return urgencyLevels.low;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setUrgencyScore(0);
    setIsAnalyzing(false);
    progressAnim.setValue(0);
  };

  const handleBookAppointment = () => {
    const urgency = getUrgencyLevel();
    Alert.alert(
      'حجز موعد',
      `سيتم توجيهك لحجز موعد ${urgency.title.toLowerCase()}`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'احجز الآن', 
          onPress: () => router.push('/appointment')
        },
      ]
    );
  };

  if (isAnalyzing) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#D4AF37', '#E8B4B8', '#7CB342']}
          style={styles.analyzingContainer}>
          <Animated.View
            style={[
              styles.aiIcon,
              {
                transform: [{ scale: pulseAnim }],
              }
            ]}>
            <Brain size={80} color="#FFFFFF" />
          </Animated.View>
          <Text style={styles.analyzingTitle}>الذكاء الاصطناعي يحلل أعراضك</Text>
          <Text style={styles.analyzingSubtitle}>جاري تقييم حالتك وتحديد مستوى الأولوية...</Text>
          
          <View style={styles.loadingDots}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -10],
                      })
                    }]
                  }
                ]}
              />
            ))}
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (showResult) {
    const urgency = getUrgencyLevel();
    
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#D4AF37', '#E8B4B8']}
          style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>نتيجة التحليل</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetQuiz}>
            <Text style={styles.resetButtonText}>إعادة</Text>
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.resultCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}>
            <LinearGradient
              colors={[urgency.color, `${urgency.color}80`]}
              style={styles.resultHeader}>
              <Text style={styles.resultIcon}>{urgency.icon}</Text>
              <Text style={styles.resultTitle}>{urgency.title}</Text>
              <Text style={styles.resultSubtitle}>{urgency.subtitle}</Text>
            </LinearGradient>

            <View style={styles.resultContent}>
              <Text style={styles.resultDescription}>{urgency.description}</Text>
              
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>نقاط الأولوية</Text>
                <Text style={[styles.scoreValue, { color: urgency.color }]}>
                  {urgencyScore} / {questions.length * 4}
                </Text>
              </View>

              <View style={styles.recommendationCard}>
                <View style={styles.recommendationHeader}>
                  <Calendar size={24} color={urgency.color} />
                  <Text style={styles.recommendationTitle}>التوصية</Text>
                </View>
                <Text style={styles.recommendationText}>{urgency.recommendation}</Text>
              </View>

              <View style={styles.tipsSection}>
                <Text style={styles.tipsTitle}>نصائح مهمة:</Text>
                {urgency.tips.map((tip, index) => (
                  <View key={index} style={styles.tipItem}>
                    <CheckCircle size={16} color={urgency.color} />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.bookButton}
                onPress={handleBookAppointment}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={[urgency.color, `${urgency.color}CC`]}
                  style={styles.bookButtonGradient}>
                  <Calendar size={20} color="#FFFFFF" />
                  <Text style={styles.bookButtonText}>احجز موعد الآن</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Symptoms Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>ملخص الأعراض</Text>
            {questions.map((question) => (
              <View key={question.id} style={styles.symptomItem}>
                <View style={styles.symptomStatus}>
                  {answers[question.id] ? (
                    <CheckCircle size={16} color="#F44336" />
                  ) : (
                    <View style={styles.noSymptom} />
                  )}
                </View>
                <Text style={styles.symptomText}>{question.question}</Text>
                <Text style={styles.symptomIcon}>{question.icon}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  const question = questions[currentQuestion];
  const progress = (currentQuestion / questions.length) * 100;

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
        <Text style={styles.headerTitle}>فحص الأولوية الذكي</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentQuestion + 1} من {questions.length}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* AI Badge */}
        <Animated.View
          style={[
            styles.aiBadge,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}>
          <Brain size={20} color="#FFFFFF" />
          <Text style={styles.aiBadgeText}>مدعوم بالذكاء الاصطناعي</Text>
          <Sparkles size={16} color="#FFFFFF" />
        </Animated.View>

        {/* Question Card */}
        <Animated.View
          style={[
            styles.questionCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionIcon}>{question.icon}</Text>
            <Text style={styles.questionNumber}>سؤال {currentQuestion + 1}</Text>
          </View>
          
          <Text style={styles.questionText}>{question.question}</Text>
          
          <View style={styles.answerButtons}>
            <TouchableOpacity
              style={[styles.answerButton, styles.noButton]}
              onPress={() => handleAnswer(false)}
              activeOpacity={0.8}>
              <LinearGradient
                colors={['#4CAF50', '#66BB6A']}
                style={styles.answerButtonGradient}>
                <Text style={styles.answerButtonText}>لا</Text>
                <CheckCircle size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.answerButton, styles.yesButton]}
              onPress={() => handleAnswer(true)}
              activeOpacity={0.8}>
              <LinearGradient
                colors={['#FF5722', '#FF7043']}
                style={styles.answerButtonGradient}>
                <Text style={styles.answerButtonText}>نعم</Text>
                <AlertTriangle size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Info Card */}
        <Animated.View
          style={[
            styles.infoCard,
            {
              opacity: fadeAnim,
            }
          ]}>
          <View style={styles.infoHeader}>
            <Shield size={20} color="#D4AF37" />
            <Text style={styles.infoTitle}>كيف يعمل التحليل؟</Text>
          </View>
          <Text style={styles.infoText}>
            يستخدم نظامنا الذكي خوارزميات متقدمة لتحليل أعراضك وتحديد مستوى الأولوية المناسب لحالتك.
          </Text>
          <View style={styles.infoFeatures}>
            <View style={styles.infoFeature}>
              <TrendingUp size={16} color="#7CB342" />
              <Text style={styles.infoFeatureText}>تحليل دقيق</Text>
            </View>
            <View style={styles.infoFeature}>
              <Zap size={16} color="#FF9800" />
              <Text style={styles.infoFeatureText}>نتائج فورية</Text>
            </View>
            <View style={styles.infoFeature}>
              <Clock size={16} color="#9C27B0" />
              <Text style={styles.infoFeatureText}>توصيات مخصصة</Text>
            </View>
          </View>
        </Animated.View>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 34,
  },
  resetButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E1E8ED',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7CB342',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginVertical: 20,
    alignSelf: 'center',
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginHorizontal: 8,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  questionIcon: {
    fontSize: 40,
  },
  questionNumber: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 28,
  },
  answerButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  answerButton: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  answerButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  answerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 15,
    textAlign: 'right',
  },
  infoFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoFeatureText: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '600',
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  aiIcon: {
    marginBottom: 30,
  },
  analyzingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  analyzingSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 40,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  resultHeader: {
    padding: 30,
    alignItems: 'center',
  },
  resultIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  resultContent: {
    padding: 25,
  },
  resultDescription: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  recommendationCard: {
    backgroundColor: '#F0F8F0',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginRight: 10,
  },
  recommendationText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
    textAlign: 'right',
  },
  tipsSection: {
    marginBottom: 25,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
    textAlign: 'right',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#2C3E50',
    marginRight: 10,
    flex: 1,
    textAlign: 'right',
  },
  bookButton: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  bookButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'center',
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  symptomIcon: {
    fontSize: 20,
    marginLeft: 15,
  },
  symptomText: {
    flex: 1,
    fontSize: 14,
    color: '#2C3E50',
    textAlign: 'right',
    marginRight: 10,
  },
  symptomStatus: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSymptom: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E1E8ED',
  },
});