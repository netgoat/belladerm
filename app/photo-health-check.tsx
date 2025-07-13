import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Camera, RotateCcw, Sparkles, CircleCheck as CheckCircle, TrendingUp, ArrowLeft, Brain, Eye, TriangleAlert as AlertTriangle, Shield, Lightbulb, Heart, Star } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Simulated AI analysis results
const analysisResults = {
  overall: 'جيد',
  score: 82,
  issues: [
    { 
      name: 'تراكم البلاك', 
      severity: 'منخفض', 
      confidence: 85,
      description: 'تراكم طفيف للبلاك على الأسنان الخلفية',
      recommendation: 'استخدم فرشاة أسنان ناعمة مع معجون يحتوي على الفلورايد'
    },
    { 
      name: 'احمرار اللثة', 
      severity: 'متوسط', 
      confidence: 78,
      description: 'احمرار طفيف في اللثة قد يشير لالتهاب مبكر',
      recommendation: 'استخدم غسول فم مطهر واستشر طبيب الأسنان'
    },
    { 
      name: 'تسوس محتمل', 
      severity: 'منخفض', 
      confidence: 65,
      description: 'بقع داكنة قد تشير لبداية تسوس',
      recommendation: 'فحص دوري مع طبيب الأسنان للتأكد'
    }
  ],
  healthyAspects: [
    'لون الأسنان طبيعي',
    'عدم وجود تورم واضح',
    'ترتيب الأسنان جيد'
  ],
  personalizedTips: [
    {
      category: 'التنظيف اليومي',
      tips: [
        'نظف أسنانك مرتين يومياً لمدة دقيقتين',
        'استخدم خيط الأسنان مرة واحدة يومياً على الأقل',
        'استخدم غسول فم يحتوي على الفلورايد'
      ]
    },
    {
      category: 'التغذية',
      tips: [
        'قلل من تناول السكريات والمشروبات الغازية',
        'تناول الأطعمة الغنية بالكالسيوم مثل الحليب والجبن',
        'اشرب الماء بكثرة لتنظيف الفم طبيعياً'
      ]
    },
    {
      category: 'العادات الصحية',
      tips: [
        'تجنب قضم الأظافر أو الأقلام',
        'لا تستخدم أسنانك لفتح الأشياء',
        'احجز فحص دوري كل 6 أشهر'
      ]
    }
  ]
};

export default function PhotoHealthCheckScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [showCamera, setShowCamera] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  
  const cameraRef = useRef<CameraView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const analysisSteps = [
    { text: 'تحليل جودة الصورة...', icon: '📸' },
    { text: 'فحص تراكم البلاك...', icon: '🔍' },
    { text: 'تقييم صحة اللثة...', icon: '🩸' },
    { text: 'البحث عن التسوس...', icon: '🦷' },
    { text: 'إنشاء التوصيات الشخصية...', icon: '💡' },
    { text: 'اكتمل التحليل!', icon: '✅' }
  ];

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

    // Pulse animation for AI analysis
    if (analyzing) {
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
  }, [analyzing]);

  const startPhotoCheck = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('إذن مطلوب', 'نحتاج إلى إذن الكاميرا لفحص صحة الفم');
        return;
      }
    }
    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo?.uri || null);
        setShowCamera(false);
        setAnalyzing(true);
        
        // Simulate AI analysis with steps
        simulateAIAnalysis();
      } catch (error) {
        Alert.alert('خطأ', 'فشل في التقاط الصورة');
      }
    }
  };

  const simulateAIAnalysis = () => {
    let step = 0;
    const interval = setInterval(() => {
      setAnalysisStep(step);
      
      Animated.timing(progressAnim, {
        toValue: (step + 1) / analysisSteps.length,
        duration: 500,
        useNativeDriver: false,
      }).start();

      step++;
      
      if (step >= analysisSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setAnalyzing(false);
          setShowResults(true);
        }, 1000);
      }
    }, 800);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const resetAnalysis = () => {
    setShowResults(false);
    setCapturedImage(null);
    setAnalysisStep(0);
    progressAnim.setValue(0);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'عالي': return '#F44336';
      case 'متوسط': return '#FF9800';
      case 'منخفض': return '#4CAF50';
      default: return '#7F8C8D';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'عالي': return '🚨';
      case 'متوسط': return '⚠️';
      case 'منخفض': return '✅';
      default: return '❓';
    }
  };

  if (showCamera) {
    return (
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}>
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => setShowCamera(false)}>
                <Text style={styles.cameraButtonText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={toggleCameraFacing}>
                <RotateCcw size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.scanFrame}>
              <View style={styles.scanGuide}>
                <Text style={styles.scanText}>📸 ضع الكاميرا أمام فمك</Text>
                <Text style={styles.scanSubtext}>تأكد من الإضاءة الجيدة</Text>
              </View>
              <View style={styles.frameCorners}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
            </View>
            
            <View style={styles.cameraControls}>
              <View style={styles.cameraInstructions}>
                <Text style={styles.instructionText}>💡 نصائح للحصول على أفضل نتيجة:</Text>
                <Text style={styles.instructionItem}>• استخدم إضاءة طبيعية جيدة</Text>
                <Text style={styles.instructionItem}>• اجعل الكاميرا مستقرة</Text>
                <Text style={styles.instructionItem}>• اظهر أسنانك ولثتك بوضوح</Text>
              </View>
              
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}>
                <LinearGradient
                  colors={['#D4AF37', '#E8B4B8']}
                  style={styles.captureButtonGradient}>
                  <Camera size={30} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  if (analyzing) {
    return (
      <View style={styles.analyzingContainer}>
        <LinearGradient
          colors={['#D4AF37', '#E8B4B8', '#7CB342']}
          style={styles.analyzingGradient}>
          <Animated.View
            style={[
              styles.aiIcon,
              {
                transform: [{ scale: pulseAnim }],
              }
            ]}>
            <Brain size={80} color="#FFFFFF" />
          </Animated.View>
          
          <Text style={styles.analyzingTitle}>الذكاء الاصطناعي يحلل صورتك</Text>
          <Text style={styles.analyzingSubtitle}>تحليل متقدم لصحة الفم والأسنان</Text>
          
          <View style={styles.analysisStepContainer}>
            <Text style={styles.stepIcon}>{analysisSteps[analysisStep]?.icon}</Text>
            <Text style={styles.stepText}>{analysisSteps[analysisStep]?.text}</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
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
            {Math.round((analysisStep + 1) / analysisSteps.length * 100)}% مكتمل
          </Text>
        </LinearGradient>
      </View>
    );
  }

  if (showResults) {
    return (
      <ScrollView style={styles.resultsContainer}>
        <LinearGradient
          colors={['#D4AF37', '#E8B4B8']}
          style={styles.resultsHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.resultsTitle}>نتائج الفحص الذكي</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={resetAnalysis}>
            <Text style={styles.retryButtonText}>إعادة</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.resultsContent}>
          {/* Overall Score */}
          <View style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <Star size={30} color="#D4AF37" />
              <View style={styles.scoreInfo}>
                <Text style={styles.scoreNumber}>{analysisResults.score}</Text>
                <Text style={styles.scoreLabel}>نقاط الصحة</Text>
              </View>
              <Text style={styles.overallStatus}>{analysisResults.overall}</Text>
            </View>
          </View>

          {/* Captured Image */}
          {capturedImage && (
            <View style={styles.imageContainer}>
              <Text style={styles.sectionTitle}>الصورة المحللة</Text>
              <Image source={{ uri: capturedImage }} style={styles.analyzedImage} />
            </View>
          )}

          {/* Issues Found */}
          <View style={styles.issuesSection}>
            <Text style={styles.sectionTitle}>المشاكل المكتشفة</Text>
            {analysisResults.issues.map((issue, index) => (
              <View key={index} style={styles.issueCard}>
                <View style={styles.issueHeader}>
                  <View style={styles.issueInfo}>
                    <Text style={styles.issueName}>{issue.name}</Text>
                    <Text style={styles.issueDescription}>{issue.description}</Text>
                  </View>
                  <View style={styles.issueSeverity}>
                    <Text style={styles.severityIcon}>{getSeverityIcon(issue.severity)}</Text>
                    <Text style={[styles.severityText, { color: getSeverityColor(issue.severity) }]}>
                      {issue.severity}
                    </Text>
                    <Text style={styles.confidenceText}>{issue.confidence}% ثقة</Text>
                  </View>
                </View>
                <View style={styles.recommendationBox}>
                  <Lightbulb size={16} color="#D4AF37" />
                  <Text style={styles.recommendationText}>{issue.recommendation}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Healthy Aspects */}
          <View style={styles.healthySection}>
            <Text style={styles.sectionTitle}>الجوانب الصحية</Text>
            <View style={styles.healthyCard}>
              {analysisResults.healthyAspects.map((aspect, index) => (
                <View key={index} style={styles.healthyItem}>
                  <CheckCircle size={16} color="#4CAF50" />
                  <Text style={styles.healthyText}>{aspect}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Personalized Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.sectionTitle}>نصائح شخصية مخصصة لك</Text>
            {analysisResults.personalizedTips.map((category, index) => (
              <View key={index} style={styles.tipCategory}>
                <View style={styles.categoryHeader}>
                  <Heart size={20} color="#E8B4B8" />
                  <Text style={styles.categoryTitle}>{category.category}</Text>
                </View>
                {category.tips.map((tip, tipIndex) => (
                  <View key={tipIndex} style={styles.tipItem}>
                    <View style={styles.tipBullet} />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/appointment')}
              activeOpacity={0.8}>
              <LinearGradient
                colors={['#4CAF50', '#66BB6A']}
                style={styles.actionButtonGradient}>
                <Text style={styles.actionButtonText}>احجز موعد للفحص</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/products')}
              activeOpacity={0.8}>
              <LinearGradient
                colors={['#9C27B0', '#BA68C8']}
                style={styles.actionButtonGradient}>
                <Text style={styles.actionButtonText}>تسوق منتجات العناية</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#D4AF37', '#E8B4B8', '#7CB342']}
        style={styles.welcomeContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.welcomeContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}>
          <View style={styles.iconContainer}>
            <Camera size={60} color="#FFFFFF" />
            <Brain size={40} color="#FFFFFF" style={styles.brainIcon} />
          </View>
          
          <Text style={styles.welcomeTitle}>فحص صحة الفم بالذكاء الاصطناعي</Text>
          <Text style={styles.welcomeSubtitle}>
            التقط صورة لأسنانك واحصل على تحليل فوري وتوصيات شخصية لصحة فمك
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Eye size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>فحص تراكم البلاك</Text>
            </View>
            <View style={styles.featureItem}>
              <AlertTriangle size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>كشف احمرار اللثة</Text>
            </View>
            <View style={styles.featureItem}>
              <Shield size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>البحث عن التسوس</Text>
            </View>
            <View style={styles.featureItem}>
              <Lightbulb size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>نصائح شخصية</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.startButton}
            onPress={startPhotoCheck}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#FFFFFF', '#F8F9FA']}
              style={styles.startButtonGradient}>
              <Camera size={24} color="#D4AF37" />
              <Text style={styles.startButtonText}>ابدأ الفحص الذكي</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimerText}>
              ⚠️ هذا الفحص للإرشاد فقط ولا يغني عن استشارة طبيب الأسنان
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  welcomeContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 10,
    marginBottom: 20,
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  brainIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
    marginBottom: 40,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  featureText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 15,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
  startButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    marginBottom: 30,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 18,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginLeft: 12,
  },
  disclaimerContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  cameraButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scanFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
  },
  scanGuide: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  scanSubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
  },
  frameCorners: {
    position: 'absolute',
    width: 250,
    height: 200,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#D4AF37',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  cameraControls: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  cameraInstructions: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 30,
    maxWidth: width - 40,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionItem: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 4,
    textAlign: 'right',
  },
  captureButton: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  captureButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingContainer: {
    flex: 1,
  },
  analyzingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  aiIcon: {
    marginBottom: 30,
  },
  analyzingTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  analyzingSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 40,
  },
  analysisStepContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  stepIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  stepText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginBottom: 15,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  resultsHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  retryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resultsContent: {
    padding: 20,
  },
  scoreCard: {
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
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreInfo: {
    alignItems: 'center',
    flex: 1,
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 5,
  },
  overallStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  analyzedImage: {
    width: 200,
    height: 150,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#D4AF37',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'right',
  },
  issuesSection: {
    marginBottom: 30,
  },
  issueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  issueInfo: {
    flex: 1,
    marginLeft: 15,
  },
  issueName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
    textAlign: 'right',
  },
  issueDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    textAlign: 'right',
  },
  issueSeverity: {
    alignItems: 'center',
  },
  severityIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  severityText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  confidenceText: {
    fontSize: 10,
    color: '#7F8C8D',
  },
  recommendationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#D4AF37',
  },
  recommendationText: {
    fontSize: 14,
    color: '#2C3E50',
    marginRight: 10,
    flex: 1,
    textAlign: 'right',
  },
  healthySection: {
    marginBottom: 30,
  },
  healthyCard: {
    backgroundColor: '#F0F8F0',
    borderRadius: 15,
    padding: 20,
  },
  healthyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  healthyText: {
    fontSize: 14,
    color: '#2C3E50',
    marginRight: 10,
    textAlign: 'right',
    flex: 1,
  },
  tipsSection: {
    marginBottom: 30,
  },
  tipCategory: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginRight: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E8B4B8',
    marginLeft: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#2C3E50',
    flex: 1,
    textAlign: 'right',
    marginRight: 10,
  },
  actionButtons: {
    gap: 15,
    marginBottom: 20,
  },
  actionButton: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  actionButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});