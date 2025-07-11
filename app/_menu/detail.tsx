import { Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DetailScreen() {
  const { imdbID } = useLocalSearchParams();
  const router = useRouter();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=b45dad4f&i=${imdbID}&plot=full`
        );
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (imdbID) fetchDetail();
  }, [imdbID]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  if (!movie || movie.Response === 'False') {
    return (
      <View style={styles.centered}>
        <Text>Movie not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      {/* 🔝 Header */}
      <SafeAreaView style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
  <AntDesign name="leftcircle" size={24} color="black" />
</TouchableOpacity>
        <Text style={styles.headerText}>
          {movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)} Detail
        </Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>
      <View style={styles.greySeparator} />

      {/* 🎞️ Horizontal Film Strip */}
      <View style={styles.filmStrip}>
        <View style={styles.holeRow}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={i} style={styles.hole} />
          ))}
        </View>

        <View style={styles.stripContent}>
          <Image source={{ uri: movie.Poster }} style={styles.poster} />
          <View style={styles.separator} />
          <View style={styles.stripInfo}>
            <View style={styles.rowSideBySide}>
              <Text style={styles.typeText}>{movie.Type.toUpperCase()}</Text>
              <Text style={styles.yearText}>{movie.Year}</Text>
            </View>
            <Text style={styles.titleText}>{movie.Title}</Text>

            <View style={styles.infoRow}>
              <MaterialIcons name="stars" size={18} color="#4caf50" />
              <Text style={styles.infoText}>{movie.Rated}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="event" size={18} color="#4caf50" />
              <Text style={styles.infoText}>{movie.Released}</Text>
            </View>
            <View style={styles.infoRow}>
              <FontAwesome5 name="film" size={18} color="#4caf50" />
              <Text style={styles.infoText}>{movie.Genre}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="access-time" size={18} color="#4caf50" />
              <Text style={styles.infoText}>{movie.Runtime}</Text>
            </View>
            <View style={styles.infoRow}>
              <Entypo name="language" size={18} color="#4caf50" />
              <Text style={styles.infoText}>{movie.Language} </Text>
            </View>
          </View>
        </View>

        <View style={styles.holeRow}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={i} style={styles.hole} />
          ))}
        </View>
      </View>

      {/* 🧾 Vertical Detail Strip */}
      <View style={styles.verticalFilmStrip}>
        <View style={styles.verticalHoleColumn}>
          {Array.from({ length: 15 }).map((_, i) => (
            <View key={i} style={styles.verticalHole} />
          ))}
        </View>

        <View style={styles.verticalStripContent}>
          {/* 🧠 Plot Section */}
<View style={styles.section}>
  <Text style={styles.label}>Plot:</Text>
  <Text style={styles.value}>{movie.Plot}</Text>
</View>

{/* 🎬 Crew Section */}
<View style={styles.section}>
  <View style={styles.sectionDivider} />
  {['Director', 'Writer', 'Actors'].map((key) => (
    <View key={key} style={styles.row}>
      <Text style={styles.label}>{key}:</Text>
      <Text style={styles.value}>{movie[key]}</Text>
    </View>
  ))}
</View>

{/* 🌍 Stats Section */}
<View style={styles.section}>
  <View style={styles.sectionDivider} />
  {['Country', 'Awards', 'Metascore', 'imdbRating', 'imdbVotes'].map((key) => (
    <View key={key} style={styles.row}>
      <Text style={styles.label}>{key}:</Text>
      <Text style={styles.value}>{movie[key]}</Text>
    </View>
  ))}
</View>

{/* 🏢 Production Section */}
<View style={styles.section}>
  <View style={styles.sectionDivider} />
  {['DVD', 'BoxOffice', 'Production', 'Website'].map((key) => (
    <View key={key} style={styles.row}>
      <Text style={styles.label}>{key}:</Text>
      <Text style={styles.value}>{movie[key]}</Text>
    </View>
  ))}
</View>

{/* ⭐ Ratings Section */}
<View style={styles.section}>
  <View style={styles.sectionDivider} />

  <View style={styles.ratingCardContainer}>
    {movie.Ratings.filter(r => r.Source !== 'Metacritic').map((r, i) => (
      <View key={i} style={styles.ratingCard}>
        <MaterialIcons name="star" size={16} color="#FFD700" />
        <Text style={styles.ratingSource}>{r.Source}</Text>
        <Text style={styles.ratingValue}>{r.Value}</Text>
      </View>
    ))}
  </View>

  {movie.Ratings.find(r => r.Source === 'Metacritic') && (
    <View style={styles.metacriticWrapper}>
      <View style={[styles.ratingCard, styles.metacriticCard]}>
        <MaterialIcons name="star" size={16} color="#FFD700" />
        <Text style={styles.ratingSource}>Metacritic</Text>
        <Text style={styles.ratingValue}>
          {movie.Ratings.find(r => r.Source === 'Metacritic').Value}
        </Text>
      </View>
    </View>
  )}
</View>

        </View>
        <View style={styles.verticalHoleColumn}>
          {Array.from({ length: 15 }).map((_, i) => (
            <View key={i} style={styles.verticalHole} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#e7ffe0',
    paddingBottom: 0,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#e7ffe0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
  fontSize: 24,               // slightly larger
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center',
  flex: 1,
  letterSpacing: 1.5,         // adds space between letters
  textTransform: 'uppercase', // optional: all caps if desired
},

  greySeparator: {
  height: 7,                  
  backgroundColor: '#b0b0b0', 
  borderRadius: 2,            
},

section: {
  marginBottom: 20,
},

sectionDivider: {
  height: 2,
  backgroundColor: '#ccc',
  width: '110%',
  marginHorizontal: -16,  // 👈 negate padding of parent
  marginBottom: 12,
},



  filmStrip: {
    backgroundColor: 'black',
    paddingVertical: 10,
  },
  holeRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 5,
  },
  hole: {
    width: 25,
    height: 14,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  stripContent: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 4,
    marginTop: 10,
    marginBottom: 10,
    minHeight: 150,
  },
  poster: {
    width: 150,
    height: '100%',
    resizeMode: 'cover',
  },
  separator: {
    width: 4,
    height: '100%',
    backgroundColor: '#4caf50',
    marginRight: 16,
  },
  stripInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  rowSideBySide: {
  flexDirection: 'row',
  justifyContent: 'space-between', // Push Type left, Year right
  alignItems: 'center',
  marginBottom: 6,
},
  typeText: {
    color: '#4caf50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  yearText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    fontSize: 15,
    textTransform: 'capitalize',
    color: '#333',
    flexShrink: 1,
    flexWrap: 'wrap',
  },

  // 📦 Vertical Strip
  verticalFilmStrip: {
    flexDirection: 'row',
    backgroundColor: 'black',
  },
  verticalHoleColumn: {
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  verticalHole: {
    width: 16,
    height: 25,
    backgroundColor: 'white',
    borderRadius: 2,
    marginVertical: 10,
    alignSelf: 'center',
  },
  verticalStripContent: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  // 📋 Key-Value Detail Rows
  row: {
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: '#333',
    flexWrap: 'wrap',
  },
  
  ratingSection: {
  marginTop: 12,
},
ratingCardContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  rowGap: 10,
  columnGap: 10,
  marginTop: 8,
},

ratingCard: {
  backgroundColor: '#f0fff0',
  borderColor: '#4caf50',
  borderWidth: 1,
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 12,
  alignItems: 'center',
  width: '47%',
  elevation: 3,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
},

metacriticCard: {
  width: '50%',
  alignSelf: 'center',
},
ratingSource: {
  fontWeight: '600',
  color: '#333',
  fontSize: 12,
  marginTop: 4,
  textAlign: 'center',
},
ratingValue: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#4caf50',
  marginTop: 2,
  textAlign: 'center',
},
metacriticWrapper: {
  alignItems: 'center',
  marginTop: 10,
},

});
