import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { 
  Camera, Brain, ShoppingBag, MessageCircle, Sparkles, TrendingUp, Zap, Heart, Star, Award, Users, Calendar, Eye,
  RotateCcw, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Shield, Lightbulb, ArrowLeft,
  Search, Filter
} from 'lucide-react-native';
import AnimatedButton from '@/components/AnimatedButton';
import PulseAnimation from '@/components/PulseAnimation';

const { width } = Dimensions.get('window');

const services = [
  {
    id: 1,
    title: 'فحص الصورة الذكي',
    description: 'فحص صحة الفم بالذكاء الاصطناعي',
    icon: Camera,
    color: '#9C27B0',
    type: 'photo-check',
    features: ['كشف تراكم البلاك', 'فحص احمرار اللثة', 'البحث عن التسوس', 'نصائح شخصية'],
    duration: '5 دقائق',
    accuracy: '85%',
  },
  {
    id: 2,
    title: 'فحص الأولوية الذكي',
    description: 'تحديد أولوية الموعد بالذكاء الاصطناعي',
    icon: TrendingUp,
    color: '#E8B4B8',
    route: '/urgency-check',
    features: ['تقييم الأعراض', 'تحديد مستوى الأولوية', 'توصيات مخصصة', 'إرشادات العناية'],
    duration: '3 دقائق',
    accuracy: '92%',
  },
  {
    id: 3,
    title: 'حجز موعد ذكي',
    description: 'احجز مع الخبراء بنظام ذكي',
    icon: Calendar,
    color: '#D4AF37',
    route: '/appointment',
    features: ['اختيار الطبيب المناسب', 'جدولة مرنة', 'تذكيرات تلقائية', 'متابعة الحالة'],
    duration: 'فوري',
    accuracy: '100%',
  },
  {
    id: 4,
    title: 'استشارة مباشرة',
    description: 'تحدث مع أطباء الأسنان المعتمدين',
    icon: MessageCircle,
    color: '#4CAF50',
    route: '/chat',
    features: ['استشارة فورية', 'أطباء معتمدين', 'محادثة آمنة', 'توصيات مهنية'],
    duration: '24/7',
    accuracy: '100%',
  },
  {
    id: 5,
    title: 'تحليل البشرة بالذكاء الاصطناعي',
    description: 'فحص شامل للبشرة وتوصيات مخصصة',
    icon: Eye,
    color: '#FF6B6B',
    type: 'skin-ai',
    features: ['تحليل نوع البشرة', 'كشف المشاكل', 'توصيات علاجية', 'روتين مخصص'],
    duration: '3 دقائق',
    accuracy: '90%',
  },
  {
    id: 6,
    title: 'متجر المنتجات',
    description: 'منتجات عناية مختارة بعناية',
    icon: ShoppingBag,
    color: '#FF9800',
    type: 'products',
    features: ['منتجات معتمدة', 'توصيل سريع', 'ضمان الجودة', 'أسعار تنافسية'],
    duration: 'فوري',
    accuracy: '100%',
  },
];

// Products data
const categories = [
  { id: 'all', name: 'جميع المنتجات', color: '#D4AF37' },
  { id: 'skincare', name: 'العناية بالبشرة', color: '#7CB342' },
  { id: 'dental', name: 'العناية بالأسنان', color: '#E8B4B8' },
  { id: 'supplements', name: 'المكملات', color: '#9C27B0' },
  { id: 'tools', name: 'الأدوات', color: '#FF7043' },
];

const products = [
  {
    id: 1,
    name: 'سيروم فيتامين سي المشرق',
    price: 89,
    originalPrice: 120,
    rating: 4.8,
    reviews: 156,
    image: 'https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'skincare',
    isNew: true,
    description: 'سيروم مضاد للأكسدة قوي لبشرة مشرقة ونضرة',
  },
  {
    id: 2,
    name: 'معجون أسنان بالفلورايد',
    price: 25,
    originalPrice: 35,
    rating: 4.9,
    reviews: 203,
    image: 'https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'dental',
    isNew: false,
    description: 'حماية شاملة للأسنان واللثة',
  },
  {
    id: 3,
    name: 'مرطب حمض الهيالورونيك',
    price: 65,
    originalPrice: 85,
    rating: 4.7,
    reviews: 89,
    image: 'https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'skincare',
    isNew: false,
    description: 'ترطيب عميق لجميع أنواع البشرة',
  },
];

// Skin AI analysis results
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
    }
  ]
};

export default function ServicesScreen() {
  const [currentView, setCurrentView] = useState('services'); // 'services', 'skin-ai', 'products', 'photo-check'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  
  // Camera states
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [showCamera, setShowCamera] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleServicePress = (service: any) => {
    if (service.type === 'skin-ai') {
      setCurrentView('skin-ai');
    } else if (service.type === 'products') {
      setCurrentView('products');
    } else if (service.type === 'photo-check') {
      setCurrentView('photo-check');
    } else if (service.route) {
      router.push(service.route);
    }
  };

  const goBackToServices = () => {
    setCurrentView('services');
    setShowCamera(false);
    setAnalyzing(false);
    setShowResults(false);
    setCapturedImage(null);
  };

  // Photo check functions
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

  // Products functions
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (productId: number) => {
    setCart(prev => [...prev, productId]);
    Alert.alert('تم الإضافة للسلة', 'تم إضافة المنتج إلى سلة التسوق!');
  };

  // Render functions
  const renderServiceCard = (service: any, index: number) => (
    <AnimatedButton
      key={service.id}
      onPress={() => handleServicePress(service)}
      style={styles.serviceCard}>
      <PulseAnimation duration={1500 + index * 200}>
        <LinearGradient
          colors={[service.color, `${service.color}80`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.serviceGradient}>
          
          <View style={styles.serviceHeader}>
            <View style={styles.serviceIconContainer}>
              <service.icon size={32} color="#FFFFFF" />
            </View>
            <View style={styles.serviceMetrics}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{service.duration}</Text>
                <Text style={styles.metricLabel}>المدة</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{service.accuracy}</Text>
                <Text style={styles.metricLabel}>الدقة</Text>
              </View>
            </View>
          </View>

          <View style={styles.serviceContent}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            
            <View style={styles.featuresContainer}>
              {service.features.slice(0, 2).map((feature: string, idx: number) => (
                <View key={idx} style={styles.featureItem}>
                  <View style={styles.featureBullet} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
              {service.features.length > 2 && (
                <Text style={styles.moreFeatures}>+{service.features.length - 2} المزيد</Text>
              )}
            </View>

            <View style={styles.serviceAction}>
              <Text style={styles.actionText}>ابدأ الآن</Text>
              <Sparkles size={16} color="#FFFFFF" />
            </View>
          </View>
        </LinearGradient>
      </PulseAnimation>
    </AnimatedButton>
  );

  const renderProductCard = (product: any) => (
    <View key={product.id} style={styles.productCard}>
      <TouchableOpacity style={styles.productImageContainer}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        {product.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>جديد</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(product.id)}>
          <Heart
            size={20}
            color={favorites.includes(product.id) ? '#FF6B6B' : '#8E8E93'}
            fill={favorites.includes(product.id) ? '#FF6B6B' : 'none'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        
        <View style={styles.ratingContainer}>
          <Star size={16} color="#FFD700" fill="#FFD700" />
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.reviewsText}>({product.reviews} تقييم)</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>{product.originalPrice} ريال</Text>
          <Text style={styles.currentPrice}>{product.price} ريال</Text>
        </View>
        
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => addToCart(product.id)}>
          <LinearGradient
            colors={['#D4AF37', '#E8B4B8']}
            style={styles.addToCartGradient}>
            <ShoppingBag size={18} color="#FFFFFF" />
            <Text style={styles.addToCartText}>أضف للسلة</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Camera view for photo check
  if (currentView === 'photo-check' && showCamera) {
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
                onPress={goBackToServices}>
                <Text style={styles.cameraButtonText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={toggleCameraFacing}>
                <RotateCcw size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.scanFrame}>
              <Text style={styles.scanText}>📸 ضع الكاميرا أمام فمك</Text>
              <Text style={styles.scanSubtext}>تأكد من الإضاءة الجيدة</Text>
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

  // Analyzing view for photo check
  if (currentView === 'photo-check' && analyzing) {
    return (
      <View style={styles.analyzingContainer}>
        <LinearGradient
          colors={['#D4AF37', '#E8B4B8', '#7CB342']}
          style={styles.analyzingGradient}>
          <Brain size={80} color="#FFFFFF" />
          <Text style={styles.analyzingTitle}>الذكاء الاصطناعي يحلل صورتك</Text>
          <Text style={styles.analyzingSubtitle}>تحليل متقدم لصحة الفم والأسنان</Text>
          <Text style={styles.progressText}>يرجى الانتظار...</Text>
        </LinearGradient>
      </View>
    );
  }

  // Results view for photo check
  if (currentView === 'photo-check' && showResults) {
    return (
      <ScrollView style={styles.resultsContainer}>
        <LinearGradient
          colors={['#D4AF37', '#E8B4B8']}
          style={styles.resultsHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBackToServices}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.resultsTitle}>نتائج الفحص الذكي</Text>
        </LinearGradient>

        <View style={styles.resultsContent}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreNumber}>{analysisResults.score}</Text>
            <Text style={styles.scoreLabel}>نقاط الصحة</Text>
          </View>

          {capturedImage && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: capturedImage }} style={styles.analyzedImage} />
            </View>
          )}

          <View style={styles.issuesSection}>
            <Text style={styles.sectionTitle}>المشاكل المكتشفة</Text>
            {analysisResults.issues.map((issue, index) => (
              <View key={index} style={styles.issueCard}>
                <Text style={styles.issueName}>{issue.name}</Text>
                <Text style={styles.issueDescription}>{issue.description}</Text>
                <Text style={styles.recommendationText}>{issue.recommendation}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/appointment')}>
            <LinearGradient
              colors={['#4CAF50', '#66BB6A']}
              style={styles.actionButtonGradient}>
              <Text style={styles.actionButtonText}>احجز موعد للفحص</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Photo check start view
  if (currentView === 'photo-check') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#D4AF37', '#E8B4B8', '#7CB342']}
          style={styles.welcomeContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBackToServices}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Camera size={60} color="#FFFFFF" />
            <Brain size={40} color="#FFFFFF" style={styles.brainIcon} />
          </View>
          
          <Text style={styles.welcomeTitle}>فحص صحة الفم بالذكاء الاصطناعي</Text>
          <Text style={styles.welcomeSubtitle}>
            التقط صورة لأسنانك واحصل على تحليل فوري وتوصيات شخصية لصحة فمك
          </Text>
          
          <TouchableOpacity
            style={styles.startButton}
            onPress={startPhotoCheck}>
            <LinearGradient
              colors={['#FFFFFF', '#F8F9FA']}
              style={styles.startButtonGradient}>
              <Camera size={24} color="#D4AF37" />
              <Text style={styles.startButtonText}>ابدأ الفحص الذكي</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  // Skin AI view
  if (currentView === 'skin-ai') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#D4AF37', '#E8B4B8']}
          style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBackToServices}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>تحليل البشرة بالذكاء الاصطناعي</Text>
        </LinearGradient>

        <ScrollView style={styles.content}>
          <View style={styles.skinAiContent}>
            <View style={styles.iconContainer}>
              <Eye size={60} color="#D4AF37" />
            </View>
            <Text style={styles.skinAiTitle}>تحليل البشرة المتقدم</Text>
            <Text style={styles.skinAiDescription}>
              احصل على تحليل شامل لبشرتك وتوصيات مخصصة للعناية والعلاج
            </Text>
            
            <TouchableOpacity style={styles.startButton}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E8E']}
                style={styles.startButtonGradient}>
                <Camera size={24} color="#FFFFFF" />
                <Text style={styles.startButtonText}>ابدأ تحليل البشرة</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Products view
  if (currentView === 'products') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#D4AF37', '#E8B4B8']}
          style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBackToServices}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>متجر المنتجات</Text>
          <TouchableOpacity style={styles.headerButton}>
            <ShoppingBag size={24} color="#FFFFFF" />
            {cart.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView style={styles.content}>
          {/* Search */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#8E8E93" />
              <TextInput
                style={styles.searchInput}
                placeholder="البحث عن المنتجات..."
                placeholderTextColor="#8E8E93"
                value={searchQuery}
                onChangeText={setSearchQuery}
                textAlign="right"
              />
            </View>
          </View>

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.selectedCategoryChip,
                ]}>
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category.id && styles.selectedCategoryChipText,
                  ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Products Grid */}
          <View style={styles.productsGrid}>
            {filteredProducts.map(renderProductCard)}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Main services view
  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#D4AF37', '#E8B4B8', '#7CB342']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}>
          <View style={styles.headerIcon}>
            <Sparkles size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.headerTitle}>خدماتنا الذكية</Text>
          <Text style={styles.headerSubtitle}>
            تقنيات متطورة لعناية أفضل بصحة الفم والأسنان
          </Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Services Section */}
        <Animated.View
          style={[
            styles.servicesSection,
            {
              opacity: fadeAnim,
            }
          ]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>الخدمات المتاحة</Text>
            <Heart size={24} color="#D4AF37" />
          </View>
          <View style={styles.servicesGrid}>
            {services.map((service, index) => renderServiceCard(service, index))}
          </View>
        </Animated.View>

        {/* AI Technology Section */}
        <Animated.View
          style={[
            styles.technologySection,
            {
              opacity: fadeAnim,
            }
          ]}>
          <View style={styles.techCard}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.techGradient}>
              <Brain size={50} color="#FFFFFF" />
              <Text style={styles.techTitle}>مدعوم بالذكاء الاصطناعي</Text>
              <Text style={styles.techDescription}>
                نستخدم أحدث تقنيات الذكاء الاصطناعي لتوفير تشخيص دقيق وتوصيات مخصصة لكل مريض
              </Text>
              <View style={styles.techFeatures}>
                <View style={styles.techFeature}>
                  <Award size={16} color="#FFFFFF" />
                  <Text style={styles.techFeatureText}>معتمد طبياً</Text>
                </View>
                <View style={styles.techFeature}>
                  <Zap size={16} color="#FFFFFF" />
                  <Text style={styles.techFeatureText}>نتائج فورية</Text>
                </View>
                <View style={styles.techFeature}>
                  <TrendingUp size={16} color="#FFFFFF" />
                  <Text style={styles.techFeatureText}>دقة عالية</Text>
                </View>
              </View>
            </LinearGradient>
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
    paddingBottom: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContent: {
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
    padding: 10,
    position: 'absolute',
    left: 20,
    top: 50,
    zIndex: 10,
  },
  headerButton: {
    position: 'absolute',
    right: 20,
    top: 50,
    zIndex: 10,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  servicesSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  servicesGrid: {
    gap: 20,
  },
  serviceCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  serviceGradient: {
    padding: 25,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  serviceIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 15,
  },
  serviceMetrics: {
    flexDirection: 'row',
    gap: 15,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  metricLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  serviceContent: {
    alignItems: 'flex-end',
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'right',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 15,
    textAlign: 'right',
    lineHeight: 20,
  },
  featuresContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    marginLeft: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'right',
  },
  moreFeatures: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.7,
    fontStyle: 'italic',
    marginTop: 4,
  },
  serviceAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  technologySection: {
    padding: 20,
    paddingBottom: 40,
  },
  techCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  techGradient: {
    padding: 30,
    alignItems: 'center',
  },
  techTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  techDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  techFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  techFeature: {
    alignItems: 'center',
    gap: 8,
  },
  techFeatureText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Skin AI styles
  skinAiContent: {
    padding: 40,
    alignItems: 'center',
  },
  skinAiTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  skinAiDescription: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  // Products styles
  searchContainer: {
    padding: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#2C3E50',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  selectedCategoryChip: {
    backgroundColor: '#D4AF37',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  selectedCategoryChipText: {
    color: '#FFFFFF',
  },
  productsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  newBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#7CB342',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  newBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
    textAlign: 'right',
  },
  productDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 10,
    textAlign: 'right',
  },
  ratingContainer: {
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
  reviewsText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'flex-end',
  },
  originalPrice: {
    fontSize: 14,
    color: '#7F8C8D',
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  addToCartButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  addToCartGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  // Photo check styles
  welcomeContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
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
    alignItems: 'center',
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
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 14,
    color: '#2C3E50',
    textAlign: 'right',
    backgroundColor: '#FFF8F0',
    padding: 10,
    borderRadius: 8,
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