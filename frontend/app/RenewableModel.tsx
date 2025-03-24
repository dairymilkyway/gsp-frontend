import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Corrected import
import { useRouter } from 'expo-router'; // For navigation
import Header from './header'; // Corrected import
import { calculateTotalCost, PRICES } from './utils'; // Import utility functions

const customFont = {
  fontFamily: 'Poppins-Regular',
};

// Conversion rate: 1 USD = 57 PHP
const USD_TO_PHP_RATE = 57;

// Renewable Energy Data
const renewableEnergyData = [
  {
    type: "Solar Energy",
    name: "Solar Roof Tiles",
    image: require("../assets/images/SolarRoofTiles.png"),
    details:
      "Harness the power of the sun with solar roof tiles. These innovative tiles blend seamlessly into your roof, converting sunlight into clean energy while maintaining the aesthetic appeal of your home.",
  },
  {
    type: "Solar Energy",
    name: "Solar Panels",
    image: require("../assets/images/SolarPanel.png"),
    details:
      "Maximize your energy efficiency with solar panels. Designed for optimal sunlight exposure, these panels generate electricity to power your home sustainably.",
  },
  {
    type: "Solar Energy",
    name: "Solar Water Heating",
    image: require("../assets/images/SolarWaterHeating.png"),
    details:
      "Reduce your reliance on conventional heating systems with solar water heating. This eco-friendly solution uses solar collectors to provide hot water for your household needs.",
  },
  {
    type: "Geothermal Energy",
    name: "Heat Pump",
    image: require("../assets/images/HeatPump.png"),
    details:
      "Tap into the earth's natural energy with geothermal heat pumps. These systems use stable underground temperatures to efficiently heat and cool your home year-round.",
  },
  {
    type: "Wind Energy",
    name: "Small Wind Turbines",
    image: require("../assets/images/SmallWindTurbine.png"),
    details:
      "Generate your own electricity with small wind turbines. Perfect for properties with sufficient wind flow, these turbines provide an off-grid energy solution.",
  },
  {
    type: "Wind Energy",
    name: "Vertical Axis Wind Turbines",
    image: require("../assets/images/VerticalAxisWindTurbine.png"),
    details:
      "Compact and versatile, vertical axis wind turbines are ideal for urban or variable-wind environments. They generate sustainable energy without requiring large open spaces.",
  },
  {
    type: "HydroPower Energy",
    name: "Micro Hydropower System",
    image: require("../assets/images/MicroHydroPowerSystem.png"),
    details:
      "Turn flowing water into renewable energy with micro hydropower systems. These systems are perfect for homes near streams or rivers, providing consistent and eco-friendly electricity.",
  },
  {
    type: "HydroPower Energy",
    name: "Pico Hydropower",
    image: require("../assets/images/PicoHydroPower.png"),
    details:
      "Ideal for off-grid homes, pico hydropower systems generate sustainable energy from low-flow water sources. Minimal infrastructure modifications make them an accessible choice.",
  },
  {
    type: "Urban Farming",
    name: "Vertical Farming",
    image: require("../assets/images/VerticalFarming.png"),
    details:
      "Grow fresh produce in limited spaces with vertical farming. This innovative approach enhances food sustainability and self-sufficiency, utilizing walls or greenhouses to maximize yield.",
  },
];

export default function RenewableModels() {
  const router = useRouter(); // For navigation
  const [selectedItem, setSelectedItem] = useState(null);
  const closeModal = () => setSelectedItem(null);

  // Add metrics to renewable energy data
  const renewableEnergyDataWithMetrics = renewableEnergyData.map((item) => {
    const normalizedSource = item.name.toLowerCase().replace(/\s+/g, '');
    const quantity = 1; // Assuming one unit of each product is being considered
    const metrics = calculateTotalCost(normalizedSource, quantity);

    return {
      ...item,
      totalCost: metrics.totalCost,
      annualSavings: metrics.annualSavings,
      paybackPeriod: metrics.paybackPeriod,
      totalCarbonEmissions: metrics.totalCarbonEmissions,
    };
  });

  return (
    <View style={styles.container}>
      <Header />
      {/* Title */}
      <Text style={styles.title}>Renewable Energy Solutions</Text>
      {/* Scrollable Cards */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.cardContainer}>
          {renewableEnergyDataWithMetrics.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, styles.cardShadow]}
              onPress={() => setSelectedItem(item)}
            >
              <Image source={item.image} style={styles.cardImage} />
              <View style={styles.cardGradientOverlay}>
                <Text style={styles.cardName}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {/* Modal */}
      <Modal transparent visible={!!selectedItem} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Go Back Button on Modal */}
            <TouchableOpacity
              style={styles.modalGoBackButton}
              onPress={closeModal}
            >
              <Icon name="arrow-left" size={24} color="#FFFFFF" />
              <Text style={styles.goBackButtonText}>Go Back</Text>
            </TouchableOpacity>
            {/* Modal Content */}
            <View style={styles.modalSplitLayout}>
              <Image source={selectedItem?.image} style={styles.modalImage} />
              <View style={styles.modalTextContainer}>
                <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
                <Text style={styles.modalType}>{selectedItem?.type}</Text>
                <Text style={styles.modalDetails}>{selectedItem?.details}</Text>
              </View>
            </View>
            {/* Stats Section - Improved Design */}
            <View style={styles.statsContainer}>
              <Text style={styles.statsHeader}>Project Economics & Environmental Impact</Text>
              
              {/* Cards Grid Layout */}
              <View style={styles.statsGrid}>
                {/* Total Cost Card */}
                <View style={styles.statCard}>
                  <Icon name="currency-usd" size={24} color="#4CAF50" style={styles.statIcon} />
                  <View style={styles.statTextContainer}>
                    <Text style={styles.statLabel}>Total Cost</Text>
                    <Text style={styles.statValue}>{`₱${selectedItem?.totalCost.toLocaleString()}`}</Text>
                  </View>
                </View>

                {/* Annual Savings Card */}
                <View style={styles.statCard}>
                  <Icon name="piggy-bank" size={24} color="#2196F3" style={styles.statIcon} />
                  <View style={styles.statTextContainer}>
                    <Text style={styles.statLabel}>Annual Savings</Text>
                    <Text style={styles.statValue}>{`₱${selectedItem?.annualSavings.toLocaleString()}/year`}</Text>
                  </View>
                </View>

                {/* Payback Period Card */}
                <View style={styles.statCard}>
                  <Icon name="calendar-clock" size={24} color="#FF9800" style={styles.statIcon} />
                  <View style={styles.statTextContainer}>
                    <Text style={styles.statLabel}>Payback Period</Text>
                    <Text style={styles.statValue}>{`${selectedItem?.paybackPeriod.toFixed(1)} years`}</Text>
                  </View>
                </View>

                {/* Carbon Emissions Card */}
                <View style={styles.statCard}>
                  <Icon name="leaf" size={24} color="#8BC34A" style={styles.statIcon} />
                  <View style={styles.statTextContainer}>
                    <Text style={styles.statLabel}>Carbon Reduction</Text>
                    <Text style={styles.statValue}>{`${selectedItem?.totalCarbonEmissions} kg CO₂`}</Text>
                  </View>
                </View>
              </View>

              {/* Compare Button */}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1238",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  goBackButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  modalGoBackButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  goBackButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: 'Poppins-Bold',
  },
  scrollView: {
    flex: 1,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1A1A40",
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  cardGradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Gradient overlay
  },
  cardName: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
    fontFamily: 'Poppins-SemiBold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#1A1A40",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  modalSplitLayout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  modalImage: {
    width: "45%",
    height: 200,
    borderRadius: 16,
    resizeMode: "cover",
  },
  modalTextContainer: {
    width: "50%",
    paddingLeft: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "left",
    fontFamily: 'Poppins-Bold',
  },
  modalType: {
    fontSize: 16,
    color: "#4CAF50",
    marginBottom: 10,
    textAlign: "left",
    fontFamily: 'Poppins-Regular',
  },
  modalDetails: {
    fontSize: 14,
    color: "#D3D3D3",
    textAlign: "left",
    lineHeight: 20,
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
  },
  statsContainer: {
    marginTop: 20,
    width: "100%",
  },
  statsHeader: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: 'Poppins-Bold',
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "#2A2A50",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  statIcon: {
    marginRight: 10,
  },
  statTextContainer: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: "#D3D3D3",
    fontFamily: 'Poppins-Regular',
  },
  statValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: 'Poppins-Bold',
  },
  compareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 20,
  },
  compareButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 8,
    fontFamily: 'Poppins-Bold',
  },
});