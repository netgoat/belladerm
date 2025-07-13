import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { User, Mail, Lock, Eye, EyeOff, Star, Award, Users } from 'lucide-react-native';
import AnimatedInput from '@/components/AnimatedInput';

const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = async () => {
    setIsLoading(true);
    
    if (!email.trim() || !password.trim()) {
      setIsLoading(false);
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleGuestLogin = () => {
    router.replace('/(tabs)');
  };

  if (Platform.OS === 'web' && width > 768) {
    // Web Layout - Side by side for desktop
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.webContainer}>
          {/* Left Side - Branding */}
          <View style={styles.webLeftSide}>
            <LinearGradient
              colors={['#D4AF37', '#E8B4B8', '#7CB342']}
              style={styles.webBrandingSection}>
              
              <View style={styles.webLogosContainer}>
                {/* Royal Clinics Logo */}
                <View style={styles.webLogoWrapper}>
                  <View style={styles.webLogoContainer}>
                    <Image 
                      source={require('../assets/images/WhatsApp Image 2025-07-09 at 12.57.03.jpeg')}
                      style={styles.webLogoImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.webBrandName}>عيادات رويال</Text>
                  <Text style={styles.webBrandSubtitle}>ROYAL CLINICS</Text>
                </View>

                {/* Partnership Indicator */}
                <View style={styles.webPartnershipIndicator}>
                  <Text style={styles.webPartnershipText}>×</Text>
                </View>

                {/* Almeswak Logo */}
                <View style={styles.webLogoWrapper}>
                  <View style={styles.webLogoContainer}>
                    <Image 
                      source={require('../assets/images/WhatsApp Image 2025-07-09 at 12.58.00.jpeg')}
                      style={styles.webLogoImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.webBrandName}>المسواك</Text>
                  <Text style={styles.webBrandSubtitle}>ALMESWAK</Text>
                </View>
              </View>

              <View style={styles.webWelcomeContainer}>
                <Text style={styles.webWelcomeTitle}>مرحباً بك في عالم الجمال</Text>
                <Text style={styles.webWelcomeSubtitle}>رحلتك نحو بشرة مشرقة تبدأ هنا</Text>
              </View>

              {/* Stats */}
              <View style={styles.webStatsContainer}>
                <View style={styles.webStatItem}>
                  <Users size={24} color="#FFFFFF" />
                  <Text style={styles.webStatNumber}>50K+</Text>
                  <Text style={styles.webStatLabel}>عميل</Text>
                </View>
                <View style={styles.webStatItem}>
                  <Award size={24} color="#FFFFFF" />
                  <Text style={styles.webStatNumber}>98%</Text>
                  <Text style={styles.webStatLabel}>نجاح</Text>
                </View>
                <View style={styles.webStatItem}>
                  <Star size={24} color="#FFFFFF" />
                  <Text style={styles.webStatNumber}>4.9</Text>
                  <Text style={styles.webStatLabel}>تقييم</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Right Side - Auth Form */}
          <View style={styles.webRightSide}>
            <View style={styles.webFormContainer}>
              
              <Text style={styles.webFormTitle}>
                {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </Text>
              <Text style={styles.webFormSubtitle}>
                {isLogin ? 'أهلاً بعودتك! سجل دخولك للمتابعة' : 'انضم إلينا واستمتع بخدماتنا المتميزة'}
              </Text>

              <View style={styles.webTabContainer}>
                <TouchableOpacity
                  style={[styles.webTab, isLogin && styles.webActiveTab]}
                  onPress={() => setIsLogin(true)}
                  activeOpacity={0.8}>
                  <Text style={[styles.webTabText, isLogin && styles.webActiveTabText]}>
                    دخول
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.webTab, !isLogin && styles.webActiveTab]}
                  onPress={() => setIsLogin(false)}
                  activeOpacity={0.8}>
                  <Text style={[styles.webTabText, !isLogin && styles.webActiveTabText]}>
                    تسجيل
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.webForm}>
                {!isLogin && (
                  <View style={styles.webInputContainer}>
                    <AnimatedInput
                      label="الاسم الكامل"
                      value={name}
                      onChangeText={setName}
                      leftIcon={<User size={18} color="#7F8C8D" />}
                      containerStyle={styles.webInput}
                    />
                  </View>
                )}

                <View style={styles.webInputContainer}>
                  <AnimatedInput
                    label="البريد الإلكتروني"
                    value={email}
                    onChangeText={setEmail}
                    leftIcon={<Mail size={18} color="#7F8C8D" />}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    containerStyle={styles.webInput}
                  />
                </View>

                <View style={styles.webInputContainer}>
                  <AnimatedInput
                    label="كلمة المرور"
                    value={password}
                    onChangeText={setPassword}
                    leftIcon={<Lock size={18} color="#7F8C8D" />}
                    rightIcon={showPassword ? (
                      <EyeOff size={18} color="#7F8C8D" />
                    ) : (
                      <Eye size={18} color="#7F8C8D" />
                    )}
                    onRightIconPress={() => setShowPassword(!showPassword)}
                    secureTextEntry={!showPassword}
                    containerStyle={styles.webInput}
                  />
                </View>

                {isLogin && (
                  <TouchableOpacity 
                    style={styles.webForgotPassword}
                    activeOpacity={0.7}>
                    <Text style={styles.webForgotPasswordText}>نسيت كلمة المرور؟</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.webAuthButton}
                  onPress={handleAuth}
                  disabled={isLoading}
                  activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#D4AF37', '#E8B4B8']}
                    style={styles.webAuthButtonGradient}>
                    <Text style={styles.webAuthButtonText}>
                      {isLoading 
                        ? 'جاري التحضير...' 
                        : isLogin 
                          ? 'تسجيل الدخول' 
                          : 'إنشاء حساب'
                      }
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.webDivider}>
                  <View style={styles.webDividerLine} />
                  <Text style={styles.webDividerText}>أو</Text>
                  <View style={styles.webDividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.webGuestButton}
                  onPress={handleGuestLogin}
                  activeOpacity={0.8}>
                  <Text style={styles.webGuestButtonText}>متابعة كضيف 👤</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.webFooterText}>
                بالمتابعة، أنت توافق على شروط الخدمة وسياسة الخصوصية
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Mobile Layout - FIXED AND VISIBLE
  return (
    <SafeAreaView style={styles.mobileContainer}>
      <KeyboardAvoidingView 
        style={styles.mobileKeyboardContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        
        <ScrollView 
          style={styles.mobileScrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mobileScrollContent}
          bounces={false}>

          {/* Mobile Header - STATIC LOGOS */}
          <View style={styles.mobileHeader}>
            <View style={styles.mobileLogosContainer}>
              {/* Royal Clinics Logo - STATIC */}
              <View style={styles.mobileLogoWrapper}>
                <View style={styles.mobileLogoContainer}>
                  <Image 
                    source={require('../assets/images/WhatsApp Image 2025-07-09 at 12.57.03.jpeg')}
                    style={styles.mobileLogoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.mobileBrandName}>عيادات رويال</Text>
              </View>

              {/* Partnership Indicator - STATIC */}
              <View style={styles.mobilePartnershipIndicator}>
                <Text style={styles.mobilePartnershipText}>×</Text>
              </View>

              {/* Almeswak Logo - STATIC */}
              <View style={styles.mobileLogoWrapper}>
                <View style={styles.mobileLogoContainer}>
                  <Image 
                    source={require('../assets/images/WhatsApp Image 2025-07-09 at 12.58.00.jpeg')}
                    style={styles.mobileLogoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.mobileBrandName}>المسواك</Text>
              </View>
            </View>

            <View style={styles.mobileWelcomeContainer}>
              <Text style={styles.mobileWelcomeTitle}>مرحباً بك</Text>
              <Text style={styles.mobileWelcomeSubtitle}>رحلتك نحو بشرة مشرقة تبدأ هنا</Text>
            </View>
          </View>

          {/* Mobile Auth Form - PROPERLY VISIBLE */}
          <View style={styles.mobileFormContainer}>
            <View style={styles.mobileFormCard}>
              <View style={styles.mobileTabContainer}>
                <TouchableOpacity
                  style={[styles.mobileTab, isLogin && styles.mobileActiveTab]}
                  onPress={() => setIsLogin(true)}
                  activeOpacity={0.8}>
                  <Text style={[styles.mobileTabText, isLogin && styles.mobileActiveTabText]}>
                    دخول
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.mobileTab, !isLogin && styles.mobileActiveTab]}
                  onPress={() => setIsLogin(false)}
                  activeOpacity={0.8}>
                  <Text style={[styles.mobileTabText, !isLogin && styles.mobileActiveTabText]}>
                    تسجيل
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.mobileForm}>
                {!isLogin && (
                  <View style={styles.mobileInputContainer}>
                    <AnimatedInput
                      label="الاسم الكامل"
                      value={name}
                      onChangeText={setName}
                      leftIcon={<User size={18} color="#7F8C8D" />}
                      containerStyle={styles.mobileInput}
                    />
                  </View>
                )}

                <View style={styles.mobileInputContainer}>
                  <AnimatedInput
                    label="البريد الإلكتروني"
                    value={email}
                    onChangeText={setEmail}
                    leftIcon={<Mail size={18} color="#7F8C8D" />}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    containerStyle={styles.mobileInput}
                  />
                </View>

                <View style={styles.mobileInputContainer}>
                  <AnimatedInput
                    label="كلمة المرور"
                    value={password}
                    onChangeText={setPassword}
                    leftIcon={<Lock size={18} color="#7F8C8D" />}
                    rightIcon={showPassword ? (
                      <EyeOff size={18} color="#7F8C8D" />
                    ) : (
                      <Eye size={18} color="#7F8C8D" />
                    )}
                    onRightIconPress={() => setShowPassword(!showPassword)}
                    secureTextEntry={!showPassword}
                    containerStyle={styles.mobileInput}
                  />
                </View>

                {isLogin && (
                  <TouchableOpacity 
                    style={styles.mobileForgotPassword}
                    activeOpacity={0.7}>
                    <Text style={styles.mobileForgotPasswordText}>نسيت كلمة المرور؟</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.mobileAuthButton}
                  onPress={handleAuth}
                  disabled={isLoading}
                  activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#D4AF37', '#E8B4B8']}
                    style={styles.mobileAuthButtonGradient}>
                    <Text style={styles.mobileAuthButtonText}>
                      {isLoading 
                        ? 'جاري التحضير...' 
                        : isLogin 
                          ? 'تسجيل الدخول' 
                          : 'إنشاء حساب'
                      }
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.mobileDivider}>
                  <View style={styles.mobileDividerLine} />
                  <Text style={styles.mobileDividerText}>أو</Text>
                  <View style={styles.mobileDividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.mobileGuestButton}
                  onPress={handleGuestLogin}
                  activeOpacity={0.8}>
                  <Text style={styles.mobileGuestButtonText}>متابعة كضيف 👤</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Mobile Footer */}
          <View style={styles.mobileFooter}>
            <Text style={styles.mobileFooterText}>
              بالمتابعة، أنت توافق على شروط الخدمة وسياسة الخصوصية
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D4AF37',
  },
  
  // Web-specific styles
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    minHeight: '100vh',
  },
  webLeftSide: {
    flex: 1,
    minWidth: 500,
  },
  webBrandingSection: {
    flex: 1,
    padding: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webLogosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  webLogoWrapper: {
    alignItems: 'center',
    minWidth: 120,
  },
  webLogoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  webLogoImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  webBrandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  webBrandSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
  webPartnershipIndicator: {
    marginHorizontal: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webPartnershipText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  webWelcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  webWelcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  webWelcomeSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 26,
  },
  webStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    width: '100%',
  },
  webStatItem: {
    alignItems: 'center',
  },
  webStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  webStatLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
  webRightSide: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 60,
    justifyContent: 'center',
    minWidth: 500,
  },
  webFormContainer: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  webFormTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  webFormSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  webTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 4,
    marginBottom: 30,
  },
  webTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  webActiveTab: {
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  webTabText: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  webActiveTabText: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  webForm: {
    gap: 20,
  },
  webInputContainer: {
    // Container for inputs
  },
  webInput: {
    // Input styles will be handled by AnimatedInput
  },
  webForgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -10,
    paddingVertical: 5,
  },
  webForgotPasswordText: {
    fontSize: 14,
    color: '#D4AF37',
    fontWeight: '600',
  },
  webAuthButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  webAuthButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  webAuthButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  webDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  webDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E8ED',
  },
  webDividerText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginHorizontal: 15,
    fontWeight: '500',
  },
  webGuestButton: {
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  webGuestButtonText: {
    fontSize: 16,
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  webFooterText: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 18,
  },

  // Mobile styles - COMPLETELY FIXED
  mobileContainer: {
    flex: 1,
    backgroundColor: '#D4AF37',
  },
  mobileKeyboardContainer: {
    flex: 1,
  },
  mobileScrollView: {
    flex: 1,
  },
  mobileScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  mobileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mobileLogosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  mobileLogoWrapper: {
    alignItems: 'center',
    minWidth: 80,
  },
  mobileLogoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  mobileLogoImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  mobileBrandName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  mobilePartnershipIndicator: {
    marginHorizontal: 15,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobilePartnershipText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mobileWelcomeContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  mobileWelcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  mobileWelcomeSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 20,
  },
  mobileFormContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 20,
  },
  mobileFormCard: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 20,
    padding: 25,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    minHeight: 400,
  },
  mobileTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 4,
    marginBottom: 25,
  },
  mobileTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  mobileActiveTab: {
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  mobileTabText: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  mobileActiveTabText: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  mobileForm: {
    gap: 20,
  },
  mobileInputContainer: {
    width: '100%',
  },
  mobileInput: {
    width: '100%',
    maxWidth: '100%',
  },
  mobileForgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -10,
    paddingVertical: 5,
  },
  mobileForgotPasswordText: {
    fontSize: 12,
    color: '#D4AF37',
    fontWeight: '600',
  },
  mobileAuthButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  mobileAuthButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mobileAuthButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mobileDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  mobileDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E8ED',
  },
  mobileDividerText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginHorizontal: 15,
    fontWeight: '500',
  },
  mobileGuestButton: {
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  mobileGuestButtonText: {
    fontSize: 14,
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  mobileFooter: {
    alignItems: 'center',
    marginTop: 20,
  },
  mobileFooterText: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 20,
  },
});