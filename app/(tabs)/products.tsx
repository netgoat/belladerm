import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Search, ShoppingCart, Filter, Star, Heart } from 'lucide-react-native';

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
  {
    id: 4,
    name: 'فرشاة أسنان كهربائية',
    price: 150,
    originalPrice: 200,
    rating: 4.6,
    reviews: 124,
    image: 'https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'tools',
    isNew: true,
    description: 'تنظيف متقدم بتقنية الاهتزاز',
  },
  {
    id: 5,
    name: 'كولاجين للبشرة والشعر',
    price: 120,
    originalPrice: 150,
    rating: 4.8,
    reviews: 167,
    image: 'https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'supplements',
    isNew: false,
    description: 'مكمل غذائي لصحة البشرة والشعر',
  },
  {
    id: 6,
    name: 'غسول فم مطهر',
    price: 35,
    originalPrice: 45,
    rating: 4.9,
    reviews: 98,
    image: 'https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'dental',
    isNew: true,
    description: 'حماية من البكتيريا ورائحة منعشة',
  },
];

export default function ProductsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);

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

  const renderCategoryChip = (category: any) => (
    <TouchableOpacity
      key={category.id}
      onPress={() => setSelectedCategory(category.id)}
      style={[
        styles.categoryChip,
        selectedCategory === category.id && styles.selectedCategoryChip,
      ]}>
      <LinearGradient
        colors={
          selectedCategory === category.id
            ? [category.color, `${category.color}80`]
            : ['#FFFFFF', '#FFFFFF']
        }
        style={styles.categoryChipGradient}>
        <Text
          style={[
            styles.categoryChipText,
            selectedCategory === category.id && styles.selectedCategoryChipText,
          ]}>
          {category.name}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderProductCard = (product: any) => (
    <View key={product.id} style={styles.productCard}>
      <TouchableOpacity
        onPress={() => router.push(`/product-detail?id=${product.id}`)}
        style={styles.productImageContainer}>
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
            <ShoppingCart size={18} color="#FFFFFF" />
            <Text style={styles.addToCartText}>أضف للسلة</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#D4AF37', '#E8B4B8']}
        style={styles.header}>
        <Text style={styles.headerTitle}>متجر المنتجات</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Filter size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/checkout')}>
            <ShoppingCart size={24} color="#FFFFFF" />
            {cart.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
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
          {categories.map(renderCategoryChip)}
        </ScrollView>

        {/* Products Grid */}
        <View style={styles.productsGrid}>
          {filteredProducts.map(renderProductCard)}
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  headerButton: {
    position: 'relative',
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
    paddingBottom: 120, // Space for fixed tab bar
  },
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
    marginRight: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  selectedCategoryChip: {
    transform: [{ scale: 1.05 }],
  },
  categoryChipGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E1E8ED',
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
});