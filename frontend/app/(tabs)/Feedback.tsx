import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@/components/ThemedText";
import StarRating from "react-native-star-rating-widget";
import { Dropdown } from "react-native-element-dropdown";

const API_URL = "https://gspbackend.vercel.app/api"; // Correct backend URL

export default function Feedback() {
  const [name, setName] = useState(""); // Name field
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;
  const [loading, setLoading] = useState(false);
  const [selectedStar, setSelectedStar] = useState(null); // Dropdown filter
  const starOptions = [
    { label: "All", value: null },
    { label: "⭐ 1 Star", value: 1 },
    { label: "⭐ 2 Stars", value: 2 },
    { label: "⭐ 3 Stars", value: 3 },
    { label: "⭐ 4 Stars", value: 4 },
    { label: "⭐ 5 Stars", value: 5 },
  ];

  // Fetch feedback on component mount
  useEffect(() => {
    fetchFeedback();
  }, []);

  // Handle filter change
  useEffect(() => {
    if (selectedStar === null) {
      setFilteredFeedbacks(allFeedbacks);
    } else {
      const filtered = allFeedbacks.filter((item) => item.rating === selectedStar);
      setFilteredFeedbacks(filtered);
    }
    setCurrentPage(1); // Reset to page 1 when filtering
  }, [selectedStar, allFeedbacks]);

  // Submit feedback
  const handleFeedbackSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/feedback`,
        {
          name,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Feedback submitted successfully!");
        setName("");
        setRating(0);
        setComment("");
        fetchFeedback(); // Refresh feedback list
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert("Failed to submit feedback.");
    }
  };

  // Fetch feedback
  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/feedback`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllFeedbacks(response.data);
      setFilteredFeedbacks(response.data);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert("Failed to fetch feedback.");
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const paginatedFeedback = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredFeedbacks.slice(startIndex, endIndex);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(filteredFeedbacks.length / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  const totalPages = Math.ceil(filteredFeedbacks.length / pageSize);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <LinearGradient colors={["#05002E", "#191540"]} style={styles.container}>
      <View style={styles.formContainer}>
        <ThemedText type="title" style={styles.title}>Rate Us</ThemedText>

        {/* Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#CCCCCC"
          value={name}
          onChangeText={setName}
        />

        {/* Star Rating Input */}
        <View style={styles.ratingContainer}>
          <StarRating
            rating={rating}
            onChange={setRating}
            starSize={60}
            color="#FFD700"
            emptyColor="#CCCCCC"
            enableHalfStar={false}
          />
        </View>

        {/* Comment Input */}
        <TextInput
          style={styles.input}
          placeholder="Comment"
          placeholderTextColor="#CCCCCC"
          value={comment}
          onChangeText={setComment}
          multiline
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleFeedbackSubmit}>
          <ThemedText style={styles.buttonText}>Submit</ThemedText>
        </TouchableOpacity>

        <ThemedText type="title" style={styles.feedbackTitle}>Feedback List</ThemedText>

        {/* Dropdown for Star Filtering */}
        <View style={styles.dropdownContainer}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={starOptions}
            labelField="label"
            valueField="value"
            placeholder="Filter by Stars"
            value={selectedStar}
            onChange={(item) => setSelectedStar(item.value)}
          />
        </View>

        {/* Pagination Control */}
        <View style={styles.pageSelectionContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {pageNumbers.map((pageNumber) => (
              <TouchableOpacity
                key={pageNumber}
                style={[
                  styles.pageNumberButton,
                  pageNumber === currentPage && styles.activePageNumberButton,
                ]}
                onPress={() => handlePageChange(pageNumber)}
              >
                <ThemedText style={styles.pageNumberText}>{pageNumber}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Feedback List */}
        {loading ? (
          <ActivityIndicator size="large" color="#3333FF" />
        ) : (
          <FlatList
            data={paginatedFeedback()}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={styles.feedbackItem}>
                <View style={styles.feedbackHeader}>
                  <ThemedText style={styles.feedbackName}>{item.name}</ThemedText>
                  <StarRating
                    rating={item.rating}
                    onChange={() => {}}
                    starSize={20}
                    color="#FFD700"
                    emptyColor="#CCCCCC"
                  />
                </View>
                <ThemedText style={styles.feedbackComment}>"{item.comment}"</ThemedText>
              </View>
            )}
          />
        )}
      </View>
    </LinearGradient>
  );
}

// Updated Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#0F1238",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#3333FF",
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    color: "#FFFFFF",
  },
  ratingContainer: {
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  submitButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#3333FF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  feedbackTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  feedbackItem: {
    backgroundColor: "#1A1A40",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  feedbackName: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  feedbackComment: {
    fontSize: 14,
    color: "#DDDDDD",
    fontStyle: "italic",
  },
  pageSelectionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  pageNumberButton: {
    backgroundColor: "#3333FF",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activePageNumberButton: {
    backgroundColor: "#FFD700",
  },
  pageNumberText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  dropdownContainer: {
    width: "100%",
    marginBottom: 10,
  },
  dropdown: {
    height: 45,
    backgroundColor: "#3333FF",
    borderRadius: 25,
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#CCCCCC",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#FFFFFF",
  },
});
