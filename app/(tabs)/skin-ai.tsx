import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, RotateCcw, Sparkles, CircleCheck as CheckCircle, TrendingUp, Brain, Eye, Shield, Lightbulb } from 'lucide-react-native';

const skinAnalysisResults = {
  overall: 'جيد',
  score: 78,
  skinType: 'مختلطة',
  issues: [
    { name: 'حب الشباب', level: 'خفيف', severity: 'low', confidence: 85 },
    { name: 'التصبغات', level: 'متوسط', severity: 'medium', confidence: 78 },
    { name: 'الخطوط الدقيقة', level: 'علامات مبكرة', severity: 'low', confidence: 72 },
    { name: 'المسام الواسعة', level: 'ظاهرة', severity: 'medium', confidence: 80 },
  ],
  recommendations: [
    {
      id: 1,
      title: 'سيروم فيتامين سي',
      description: 'يحارب التصبغات ويوحد لون البشرة',
      price: 89,
      image: 'https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'مضادات الأكسدة',
    },
    {
      id: 2,
      title: 'كريم حمض الساليسيليك',
      description: 'ينظف المسام ويقلل من حب الشباب',
      price: 65,
      image: 'https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'علاج حب الشباب',
    },
    {
      id: 3,
      title: 'سيروم الريتينول',
      description: 'يحفز تجديد الخلايا ويقلل الخطوط الدقيقة',
      price: 120,
      image: 'https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'مكافحة الشيخوخة',
    },
  ],
  skinCareRoutine: {
    morning: [
      'منظف لطيف',
      'تونر مرطب',
      'سيروم فيتامين سي',
      'مرطب خفيف',
      'واقي الشمس SPF 30+',
    ],
    evening: [
      'منظف عميق',
      'تونر مقشر (3 مرات أسبوعياً)',
      'سيروم الريتينول (تدريجياً)',
      'مرطب ليلي',
      'كريم العين',
    ],
  },
};

export default function SkinAIScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [showCamera, setShowCamera] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const startAnalysis = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('إذن مطلوب', 'نحتاج إلى إذن الكاميرا لتحليل البشرة');
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
        
        // Simulate AI analysis
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }).start();
        
        setTimeout(() => {
          setAnalyzing(false);
          setShowResults(true);
        }, 3000);
      } catch (error) {
        Alert.alert('خطأ', 'فشل في التقاط الصورة');
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const resetAnalysis = () => {
    setShowResults(false);
    setCapturedImage(null);
    progressAnim.setValue(0);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#7F8C8D';
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
              <Text style={styles.scanText}>ضع وجهك في الإطار</Text>
              <Text style={styles.scanSubtext}>للحصول على أفضل تحليل للبشرة</Text>
            </View>
            
            <View style={styles.cameraControls}>
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
          <Brain size={80} color="#FFFFFF" />
          <Text style={styles.analyzingTitle}>الذكاء الاصطناعي يحلل بشرتك</Text>
          <Text style={styles.analyzingSubtitle}>تحليل شامل لنوع البشرة والمشاكل الجلدية...</Text>
          
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
          
          <Text style={styles.progressText}>يرجى الانتظار...</Text>
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
          <Text style={styles.resultsTitle}>تحليل البشرة مكتمل</Text>
          <View style={styles.overallScore}>
            <Text style={styles.scoreText}>{skinAnalysisResults.score}</Text>
            <Text style={styles.scoreLabel}>نقاط صحة البشرة</Text>
          </View>
          <Text style={styles.overallText}>نوع البشرة: {skinAnalysisResults.skinType}</Text>
        </LinearGradient>

        <View style={styles.resultsContent}>
          {capturedImage && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: capturedImage }} style={styles.analyzedImage} />
            </View>
          )}

          {/* Skin Issues */}
          <View style={styles.issuesSection}>
            <Text style={styles.sectionTitle}>تحليل مشاكل البشرة</Text>
            {skinAnalysisResults.issues.map((issue, index) => (
              <View key={index} style={styles.issueCard}>
                <View style={styles.issueHeader}>
                  <View style={styles.issueInfo}>
                    <Text style={styles.issueName}>{issue.name}</Text>
                    <Text style={styles.issueLevel}>المستوى: {issue.level}</Text>
                  </View>
                  <View style={styles.issueSeverity}>
                    <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(issue.severity) }]}>
                      <Text style={styles.severityText}>{issue.confidence}%</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Skin Care Routine */}
          <View style={styles.routineSection}>
            <Text style={styles.sectionTitle}>روتين العناية المقترح</Text>
            
            <View style={styles.routineCard}>
              <Text style={styles.routineTitle}>🌅 الروتين الصباحي</Text>
              {skinAnalysisResults.skinCareRoutine.morning.map((step, index) => (
                <View key={index} style={styles.routineStep}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>

            <View style={styles.routineCard}>
              <Text style={styles.routineTitle}>🌙 الروتين المسائي</Text>
              {skinAnalysisResults.skinCareRoutine.evening.map((step, index) => (
                <View key={index} style={styles.routineStep}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Product Recommendations */}
          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>المنتجات الموصى بها</Text>
            {skinAnalysisResults.recommendations.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle}>{product.title}</Text>
                  <Text style={styles.productCategory}>{product.category}</Text>
                  <Text style={styles.productDescription}>{product.description}</Text>
                  <Text style={styles.productPrice}>{product.price} ريال</Text>
                </View>
                <TouchableOpacity style={styles.addButton}>
                  <LinearGradient
                    colors={['#7CB342', '#8BC34A']}
                    style={styles.addButtonGradient}>
                    <Text style={styles.addButtonText}>إضافة</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={resetAnalysis}>
            <LinearGradient
              colors={['#D4AF37', '#E8B4B8']}
              style={styles.retryButtonGradient}>
              <Text style={styles.retryButtonText}>تحليل مرة أخرى</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#D4AF37', '#E8B4B8', '#7CB342']}
        style={styles.welcomeContainer}>
        <Brain size={80} color="#FFFFFF" />
        <Text style={styles.welcomeTitle}>تحليل البشرة بالذكاء الاصطناعي</Text>
        <Text style={styles.welcomeSubtitle}>
          احصل على تحليل شامل لبشرتك وتوصيات مخصصة للعناية والعلاج
        </Text>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Eye size={24} color="#FFFFFF" />
            <Text style={styles.featureText}>تحليل نوع البشرة</Text>
          </View>
          <View style={styles.featureItem}>
            <CheckCircle size={24} color="#FFFFFF" />
            <Text style={styles.featureText}>كشف المشاكل الجلدية</Text>
          </View>
          <View style={styles.featureItem}>
            <TrendingUp size={24} color="#FFFFFF" />
            <Text style={styles.featureText}>توصيات علاجية</Text>
          </View>
          <View style={styles.featureItem}>
            <Lightbulb size={24} color="#FFFFFF" />
            <Text style={styles.featureText}>روتين عناية مخصص</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.startButton}
          onPress={startAnalysis}>
          <LinearGradient
            colors={['#FFFFFF', '#F8F9FA']}
            style={styles.startButtonGradient}>
            <Camera size={24} color="#D4AF37" />
            <Text style={styles.startButtonText}>ابدأ تحليل البشرة</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.disclaimerContainer}>
          <Shield size={20} color="#FFFFFF" />
          <Text style={styles.disclaimerText}>
            تحليل مدعوم بالذكاء الاصطناعي للإرشاد فقط
          </Text>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 20,
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
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
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
    width: '100%',
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
    paddingVertical: 15,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginLeft: 12,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 10,
    opacity: 0.9,
    textAlign: 'center',
    flex: 1,
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
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  scanSubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  cameraControls: {
    alignItems: 'center',
    paddingBottom: 50,
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
  analyzingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 20,
  },
  analyzingSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 40,
  },
  progressContainer: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginBottom: 20,
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
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  overallScore: {
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  overallText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  resultsContent: {
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  analyzedImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#D4AF37',
  },
  issuesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'right',
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
    alignItems: 'center',
  },
  issueInfo: {
    flex: 1,
  },
  issueName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
    textAlign: 'right',
  },
  issueLevel: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'right',
  },
  issueSeverity: {
    alignItems: 'center',
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  severityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  routineSection: {
    marginBottom: 30,
  },
  routineCard: {
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
  routineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'right',
  },
  routineStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepNumber: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#D4AF37',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 25,
    marginLeft: 10,
  },
  stepText: {
    fontSize: 14,
    color: '#2C3E50',
    flex: 1,
    textAlign: 'right',
  },
  recommendationsSection: {
    marginBottom: 30,
  },
  productCard: {
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
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
    marginHorizontal: 15,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 3,
    textAlign: 'right',
  },
  productCategory: {
    fontSize: 12,
    color: '#7CB342',
    marginBottom: 5,
    textAlign: 'right',
    fontWeight: '600',
  },
  productDescription: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 5,
    textAlign: 'right',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'right',
  },
  addButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  addButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  retryButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 20,
  },
  retryButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});