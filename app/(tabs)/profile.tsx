import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { User, Calendar, ShoppingBag, Heart, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, CreditCard as Edit, Star, Award, TrendingUp, ChevronRight } from 'lucide-react-native';

const userProfile = {
  name: 'سارة أحمد',
  email: 'sarah.ahmed@email.com',
  image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
  joinDate: 'مارس 2024',
  level: 'عضو ذهبي',
  points: 1250,
  completedTreatments: 8,
  savedProducts: 15,
  consultations: 12,
};

const achievements = [
  { id: 1, name: 'عاشق العناية بالبشرة', icon: '🌟', unlocked: true },
  { id: 2, name: 'خبير الاستشارات', icon: '💬', unlocked: true },
  { id: 3, name: 'محب المنتجات', icon: '🛍️', unlocked: true },
  { id: 4, name: 'سيد الروتين', icon: '📅', unlocked: false },
];

const recentOrders = [
  {
    id: 1,
    items: 'سيروم فيتامين سي + مرطب',
    date: '15 يناير 2024',
    status: 'تم التوصيل',
    amount: '154 ريال',
  },
  {
    id: 2,
    items: 'علاج الريتينول الليلي',
    date: '10 يناير 2024',
    status: 'تم التوصيل',
    amount: '95 ريال',
  },
];

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleLogout = () => {
    // Direct logout navigation
    router.replace('/');
  };

  const menuItems = [
    { id: 1, title: 'طلباتي', icon: ShoppingBag, route: '/orders' },
    { id: 2, title: 'المواعيد', icon: Calendar, route: '/appointments' },
    { id: 3, title: 'المفضلة', icon: Heart, route: '/favorites' },
    { id: 4, title: 'الإعدادات', icon: Settings, route: '/settings' },
    { id: 5, title: 'الخصوصية والأمان', icon: Shield, route: '/privacy' },
    { id: 6, title: 'المساعدة والدعم', icon: HelpCircle, route: '/support' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
      {/* Profile Header */}
      <LinearGradient
        colors={['#D4AF37', '#E8B4B8']}
        style={styles.header}>
        <View style={styles.profileInfo}>
          <TouchableOpacity style={styles.editButton}>
            <Edit size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <Text style={styles.profileEmail}>{userProfile.email}</Text>
            <View style={styles.membershipBadge}>
              <Award size={16} color="#FFFFFF" />
              <Text style={styles.membershipText}>{userProfile.level}</Text>
            </View>
          </View>
          <Image source={{ uri: userProfile.image }} style={styles.profileImage} />
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <TrendingUp size={24} color="#D4AF37" />
          <Text style={styles.statNumber}>{userProfile.points}</Text>
          <Text style={styles.statLabel}>النقاط</Text>
        </View>
        <View style={styles.statCard}>
          <Calendar size={24} color="#E8B4B8" />
          <Text style={styles.statNumber}>{userProfile.consultations}</Text>
          <Text style={styles.statLabel}>الاستشارات</Text>
        </View>
        <View style={styles.statCard}>
          <Heart size={24} color="#7CB342" />
          <Text style={styles.statNumber}>{userProfile.savedProducts}</Text>
          <Text style={styles.statLabel}>العناصر المحفوظة</Text>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الإنجازات</Text>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                !achievement.unlocked && styles.achievementLocked,
              ]}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <Text style={styles.achievementName}>{achievement.name}</Text>
              {achievement.unlocked && (
                <View style={styles.achievementBadge}>
                  <Text style={styles.achievementBadgeText}>✓</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>عرض الكل</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>الطلبات الأخيرة</Text>
        </View>
        {recentOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderStatus}>
              <Text style={styles.orderAmount}>{order.amount}</Text>
              <View style={[styles.statusBadge, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.statusText}>{order.status}</Text>
              </View>
            </View>
            <View style={styles.orderInfo}>
              <Text style={styles.orderItems}>{order.items}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الإعدادات</Text>
        
        <View style={styles.settingCard}>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#E1E8ED', true: '#D4AF37' }}
          />
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>الإشعارات</Text>
            <Bell size={24} color="#7F8C8D" />
          </View>
        </View>

        <View style={styles.settingCard}>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: '#E1E8ED', true: '#D4AF37' }}
          />
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>الوضع الداكن</Text>
            <Settings size={24} color="#7F8C8D" />
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.section}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => router.push(item.route)}>
            <ChevronRight size={20} color="#7F8C8D" />
            <Text style={styles.menuItemText}>{item.title}</Text>
            <item.icon size={24} color="#7F8C8D" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.logoutGradient}>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
          <LogOut size={20} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Bottom Spacing */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Space for fixed tab bar
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileDetails: {
    flex: 1,
    marginRight: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'right',
  },
  profileEmail: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 10,
    textAlign: 'right',
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-end',
  },
  membershipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    minWidth: 100,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 5,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'right',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    color: '#D4AF37',
    fontWeight: '600',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    position: 'relative',
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  achievementBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  orderInfo: {
    flex: 1,
  },
  orderItems: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
    textAlign: 'right',
  },
  orderDate: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'right',
  },
  orderStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#2C3E50',
    marginRight: 15,
    textAlign: 'right',
    flex: 1,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  menuItemText: {
    fontSize: 16,
    color: '#2C3E50',
    flex: 1,
    textAlign: 'right',
    marginRight: 15,
  },
  logoutButton: {
    marginHorizontal: 20,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 10,
  },
});