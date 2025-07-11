import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'series' | 'episode'>('all');
  const [loading, setLoading] = useState(false);
  const [frameWidth, setFrameWidth] = useState(Dimensions.get('window').width);

  const inputWidth = useRef(new Animated.Value(48)).current;
  const inputOpacity = useRef(new Animated.Value(0)).current;

  const carouselRef = useRef<FlatList>(null);
  const carouselIndex = useRef(0);
  const isTouched = useRef(false); // ✅ NEW
  const router = useRouter();

  const carouselData = [
    { id: '1', title: 'Hobbit', poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjQfWF1QCraNzDnaB7E3GfCGh4w8hpV5lZIg&s' },
    { id: '2', title: 'Joker', poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_p2wwUMhPtnScrgxHCwGQvZjj33UXf90AOQ&s' },
    { id: '3', title: 'Muna', poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSinMr3VZrVPOiBn-5bxRynnm4vhsx3iISMGw&s' },
    { id: '4', title: 'Inception', poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzntaXKEV3MjHabZii2L6jle9GYCA5dpz7YA&s' },
    { id: '5', title: 'Mortal Kombat', poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQls4Jyj2aY8kJzcr5I4TVqbV8wSw1l--Gmnw&s' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTouched.current) return; // ✅ Skip auto-scroll if touched

      carouselIndex.current = (carouselIndex.current + 1) % carouselData.length;
      carouselRef.current?.scrollToOffset({
        offset: frameWidth * carouselIndex.current,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [frameWidth]);

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setFrameWidth(window.width);
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) handleSearch();
  }, [selectedType]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    let url = `https://www.omdbapi.com/?apikey=b45dad4f&s=${searchQuery}`;
    if (selectedType !== 'all') url += `&type=${selectedType}`;

    setTimeout(async () => {
      try {
        const res = await fetch(url);
        const json = await res.json();
        setSearchResults(json.Response === 'True' ? json.Search : []);
      } catch (err) {
        console.error('Search failed:', err);
      }
      setLoading(false);
    }, 1500);
  };

  const expandSearch = () => {
    setSearchExpanded(true);
    Animated.parallel([
      Animated.timing(inputWidth, {
        toValue: frameWidth - 32,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(inputOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const collapseSearch = () => {
    Keyboard.dismiss();
    Animated.parallel([
      Animated.timing(inputWidth, {
        toValue: 48,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(inputOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setSearchExpanded(false);
    });
  };

  const renderFilterButton = (label: string, value: typeof selectedType) => (
    <TouchableOpacity
      onPress={() => setSelectedType(value)}
      style={[styles.filterButton, selectedType === value && styles.activeFilter]}
    >
      <Text style={{ color: selectedType === value ? 'white' : '#4caf50', fontWeight: 'bold' }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={collapseSearch}>
      <SafeAreaView style={styles.container}>
        {/* 🔍 Search Bar */}
        <View style={styles.searchRow}>
          <Animated.View style={[styles.animatedSearchWrapper, { width: inputWidth }]}>
            {searchExpanded ? (
              <Animated.View style={{ flexDirection: 'row', alignItems: 'center', opacity: inputOpacity }}>
                <TextInput
                  style={styles.searchBar}
                  placeholder="Search movies, series..."
                  placeholderTextColor="#555"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                  autoFocus
                />
                <TouchableOpacity
                  onPress={handleSearch}
                  disabled={!searchQuery.trim()}
                  style={[styles.searchIconButton, { opacity: searchQuery.trim() ? 1 : 0.5 }]}
                >
                  <Image
                    source={{ uri: 'https://img.icons8.com/ios-filled/50/search--v1.png' }}
                    style={styles.searchIcon}
                  />
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <TouchableOpacity onPress={expandSearch} style={styles.searchIconWrapper}>
                <Image
                  source={{ uri: 'https://img.icons8.com/ios-filled/50/search--v1.png' }}
                  style={styles.searchIcon}
                />
              </TouchableOpacity>
            )}
          </Animated.View>
          {!searchExpanded && (
            <Text style={styles.title}>M E M O R Y   L A N E</Text>
          )}
        </View>

        {/* 🎞️ Carousel */}
        <View style={styles.filmStrip}>
          <FlatList
            ref={carouselRef}
            horizontal
            pagingEnabled
            scrollEnabled
            scrollEventThrottle={16}
            data={carouselData}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.carouselContent}
            showsHorizontalScrollIndicator={false}
            snapToInterval={frameWidth}
            snapToAlignment="start"
            getItemLayout={(_, index) => ({
              length: frameWidth,
              offset: frameWidth * index,
              index,
            })}
            onScrollToIndexFailed={(info) => {
              console.warn('Scroll to index failed', info);
            }}
            onTouchStart={() => (isTouched.current = true)}
            onTouchEnd={() => (isTouched.current = false)}
            onScrollBeginDrag={() => (isTouched.current = true)}
            onScrollEndDrag={() => (isTouched.current = false)}
            renderItem={({ item }) => (
              <View style={[styles.frame, { width: frameWidth }]}>
                <View style={styles.holeRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <View key={i} style={styles.hole} />
                  ))}
                </View>
                <Image source={{ uri: item.poster }} style={styles.poster} resizeMode="cover" />
                <View style={styles.holeRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <View key={i} style={styles.hole} />
                  ))}
                </View>
              </View>
            )}
          />
        </View>

        {/* 🧃 Filter Section */}
        <View style={styles.filterSection}>
          <View style={styles.divider} />
          <View style={styles.filterRow}>
            {renderFilterButton('All', 'all')}
            {renderFilterButton('Movie', 'movie')}
            {renderFilterButton('Series', 'series')}
            {renderFilterButton('Episode', 'episode')}
          </View>
          <View style={styles.divider} />
        </View>

        {/* 📋 Search Results */}
        {loading ? (
          <View style={styles.noDataContainer}>
            <ActivityIndicator size="large" color="#4caf50" />
            <Text style={{ marginTop: 8 }}>Loading...</Text>
          </View>
        ) : searchQuery.trim() === '' ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No Data is Found, Please Search First</Text>
          </View>
        ) : searchResults.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No Data is Found</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.resultList}>
            {searchResults.map((movie) => (
              <View key={movie.imdbID} style={styles.movieCard}>
                <View style={[styles.notch, styles.leftNotch]} />
                <View style={[styles.notch, styles.rightNotch]} />
                <View style={styles.cardContent}>
                  <View style={styles.ticketLeft}>
                    <Image source={{ uri: movie.Poster }} style={styles.resultPoster} />
                  </View>
                  <View style={styles.ticketDivider} />
                  <View style={styles.ticketRight}>
                    <Text style={styles.resultTitle}>{movie.Title}</Text>
                    <Text>Year: {movie.Year}</Text>
                    <Text>Type: {movie.Type}</Text>
                    <TouchableOpacity
                      style={styles.detailButton}
                      onPress={() => router.push(`/_menu/detail?imdbID=${movie.imdbID}`)}
                    >
                      <Text style={{ color: 'white', textAlign: 'center' }}>View Detail</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e7ffe0', paddingTop: 60 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  animatedSearchWrapper: {
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden',
    elevation: 3,
  },
  searchBar: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  searchIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  searchIconButton: {
    marginRight: 8,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#333',
    paddingRight: 50,
  },
  filmStrip: {
    backgroundColor: 'black',
    paddingVertical: 20,
    width: '100%',
    alignSelf: 'center',
    elevation: 10,
  },
  carouselContent: { alignItems: 'center' },
  frame: { alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  holeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 10,
    marginTop: 4,
  },
  hole: { width: 25, height: 20, backgroundColor: 'white', borderRadius: 2 },
  poster: { width: '100%', height: 180, borderRadius: 8, marginVertical: 12 },
  filterSection: { backgroundColor: 'white', marginBottom: 12 },
  divider: { height: 5, backgroundColor: '#ccc' },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  activeFilter: { backgroundColor: '#4caf50' },
  resultList: { paddingHorizontal: 16, paddingBottom: 40 },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'relative',
  },
  cardContent: {
    flexDirection: 'row',
    paddingLeft: 20,
    flex: 1,
  },
  notch: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#e7ffe0',
    top: '50%',
    marginTop: -10,
    zIndex: 2,
  },
  leftNotch: { left: -13 },
  rightNotch: { right: -13 },
  ticketLeft: {
    backgroundColor: '#eee',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketRight: {
    flex: 1,
    padding: 12,
  },
  resultPoster: {
    width: 70,
    height: 100,
    borderRadius: 6,
  },
  ticketDivider: {
    width: 8,
  },
  resultTitle: { fontSize: 16, fontWeight: 'bold' },
  detailButton: {
    marginTop: 8,
    backgroundColor: '#2196f3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  noDataContainer: { alignItems: 'center', marginTop: 30 },
  noDataText: { color: '#555', fontSize: 16 },
});
