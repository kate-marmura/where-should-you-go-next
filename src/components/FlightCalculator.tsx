import { useState } from 'react';
import AIFlightSearch from './AIFlightSearch';

type Airport = {
  code: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

type FlightCalculatorProps = {
  destination: string;
  budgetLevel: string;
  onClose: () => void;
};

const airports: Record<string, Airport> = {
  'Warsaw': {
    code: 'WAW',
    city: 'Warsaw',
    country: 'Poland',
    coordinates: { lat: 52.1657, lng: 20.9671 }
  },
  'London': {
    code: 'LHR',
    city: 'London',
    country: 'England',
    coordinates: { lat: 51.4700, lng: -0.4543 }
  },
  'Rome': {
    code: 'FCO',
    city: 'Rome',
    country: 'Italy',
    coordinates: { lat: 41.8003, lng: 12.2389 }
  },
  'Paris': {
    code: 'CDG',
    city: 'Paris',
    country: 'France',
    coordinates: { lat: 49.0097, lng: 2.5478 }
  },
  'Barcelona': {
    code: 'BCN',
    city: 'Barcelona',
    country: 'Spain',
    coordinates: { lat: 41.2974, lng: 2.0833 }
  },
  'Dubai': {
    code: 'DXB',
    city: 'Dubai',
    country: 'UAE',
    coordinates: { lat: 25.2528, lng: 55.3644 }
  },
  'Singapore': {
    code: 'SIN',
    city: 'Singapore',
    country: 'Singapore',
    coordinates: { lat: 1.3502, lng: 103.9940 }
  },
  'Tokyo': {
    code: 'HND',
    city: 'Tokyo',
    country: 'Japan',
    coordinates: { lat: 35.5494, lng: 139.7798 }
  },
  'Osaka': {
    code: 'KIX',
    city: 'Osaka',
    country: 'Japan',
    coordinates: { lat: 34.4273, lng: 135.2441 }
  },
  'Seoul': {
    code: 'ICN',
    city: 'Seoul',
    country: 'South Korea',
    coordinates: { lat: 37.4602, lng: 126.4407 }
  },
  'Vancouver': {
    code: 'YVR',
    city: 'Vancouver',
    country: 'Canada',
    coordinates: { lat: 49.1939, lng: -123.1844 }
  },
  'Quito': {
    code: 'UIO',
    city: 'Quito',
    country: 'Ecuador',
    coordinates: { lat: -0.1807, lng: -78.4678 }
  },
  'Lima': {
    code: 'LIM',
    city: 'Lima',
    country: 'Peru',
    coordinates: { lat: -12.0218, lng: -77.1143 }
  },
  'Buenos Aires': {
    code: 'EZE',
    city: 'Buenos Aires',
    country: 'Argentina',
    coordinates: { lat: -34.8222, lng: -58.5358 }
  },
  'Cairo': {
    code: 'CAI',
    city: 'Cairo',
    country: 'Egypt',
    coordinates: { lat: 30.1219, lng: 31.4056 }
  },
  'Manaus': {
    code: 'MAO',
    city: 'Manaus',
    country: 'Brazil',
    coordinates: { lat: -3.0389, lng: -60.0497 }
  },
  'Reykjavik': {
    code: 'KEF',
    city: 'Reykjavik',
    country: 'Iceland',
    coordinates: { lat: 63.9850, lng: -22.6056 }
  },
  'Santorini': {
    code: 'JTR',
    city: 'Santorini',
    country: 'Greece',
    coordinates: { lat: 36.3992, lng: 25.4793 }
  },
  'Kyoto': {
    code: 'UKY',
    city: 'Kyoto',
    country: 'Japan',
    coordinates: { lat: 35.0116, lng: 135.7681 }
  },
  'Queenstown': {
    code: 'ZQN',
    city: 'Queenstown',
    country: 'New Zealand',
    coordinates: { lat: -45.0211, lng: 168.7392 }
  },
  'Bali': {
    code: 'DPS',
    city: 'Bali',
    country: 'Indonesia',
    coordinates: { lat: -8.7482, lng: 115.1672 }
  },
  'Marrakech': {
    code: 'RAK',
    city: 'Marrakech',
    country: 'Morocco',
    coordinates: { lat: 31.6069, lng: -8.0363 }
  },
  'Galapagos': {
    code: 'GPS',
    city: 'Galapagos',
    country: 'Ecuador',
    coordinates: { lat: -0.4538, lng: -90.2659 }
  },
  'Bangkok': {
    code: 'BKK',
    city: 'Bangkok',
    country: 'Thailand',
    coordinates: { lat: 13.6811, lng: 100.7475 }
  },
  'Swiss Alps': {
    code: 'ZRH',
    city: 'Zurich',
    country: 'Switzerland',
    coordinates: { lat: 47.4647, lng: 8.5492 }
  }
};

const FlightCalculator = ({ destination, budgetLevel, onClose }: FlightCalculatorProps) => {
  const [currentLocation, setCurrentLocation] = useState<string>('Warsaw');
  const [showResults, setShowResults] = useState(false);
  const [showAISearch, setShowAISearch] = useState(false);

  const handleCalculate = () => {
    setShowResults(true);
  };

  const getFlightEstimate = () => {
    const fromAirport = airports[currentLocation];
    const destinationCity = destination.split(',')[0].trim();
    const destinationCountry = destination.split(',')[1]?.trim() || '';
    
    // First try exact city match
    let toAirport = Object.values(airports).find(a => 
      a.city.toLowerCase() === destinationCity.toLowerCase()
    );

    // If no exact match, try finding a nearby major city in the same country
    if (!toAirport) {
      toAirport = Object.values(airports).find(a => 
        a.country.toLowerCase() === destinationCountry.toLowerCase()
      );
    }

    // If still no match, try finding the closest major city in the same region
    if (!toAirport) {
      const regionMap: Record<string, string> = {
        'Ecuador': 'Quito',
        'Peru': 'Lima',
        'Argentina': 'Buenos Aires',
        'Japan': 'Tokyo',
        'South Korea': 'Seoul',
        'Canada': 'Vancouver',
        'Spain': 'Barcelona',
        'France': 'Paris',
        'Italy': 'Rome',
        'England': 'London',
        'Poland': 'Warsaw',
        'UAE': 'Dubai',
        'Singapore': 'Singapore',
        'Egypt': 'Cairo',
        'Brazil': 'Manaus',
        'Iceland': 'Reykjavik',
        'Greece': 'Santorini',
        'New Zealand': 'Queenstown',
        'Indonesia': 'Bali',
        'Morocco': 'Marrakech',
        'Thailand': 'Bangkok',
        'Switzerland': 'Swiss Alps'
      };

      const defaultCity = regionMap[destinationCountry];
      if (defaultCity) {
        toAirport = airports[defaultCity];
      }
    }

    if (!fromAirport || !toAirport) {
      console.log('No match found for:', destinationCity, 'in', destinationCountry);
      return null;
    }

    const distance = calculateDistance(
      fromAirport.coordinates.lat,
      fromAirport.coordinates.lng,
      toAirport.coordinates.lat,
      toAirport.coordinates.lng
    );

    const cost = estimateFlightCost(distance, budgetLevel);

    return {
      from: `${fromAirport.city} (${fromAirport.code})`,
      to: `${toAirport.city} (${toAirport.code})`,
      distance: Math.round(distance),
      cost
    };
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const toRad = (value: number) => {
    return value * Math.PI / 180;
  };

  const estimateFlightCost = (distance: number, budgetLevel: string) => {
    const baseCostPerKm = {
      'budget': 0.15,
      'mid-range': 0.25,
      'luxury': 0.4
    }[budgetLevel] || 0.2;

    const cost = distance * baseCostPerKm;
    return Math.round(cost);
  };

  const flightInfo = showResults ? getFlightEstimate() : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Flight Calculator</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="Close calculator"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Current Location</label>
          <select
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            {Object.keys(airports).map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {!showResults ? (
          <button
            onClick={handleCalculate}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Calculate Flight Cost
          </button>
        ) : flightInfo ? (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Route:</span>
                <span>{flightInfo.from} → {flightInfo.to}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Distance:</span>
                <span>{flightInfo.distance} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Estimated Cost:</span>
                <span className="text-xl font-bold text-blue-600">${flightInfo.cost}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResults(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Calculate Again
              </button>
              <button
                onClick={() => setShowAISearch(true)}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Find Next Flight
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600">
            No flight information available for this destination.
          </div>
        )}
      </div>

      {showAISearch && (
        <AIFlightSearch
          from={currentLocation}
          to={destination.split(',')[0].trim()}
          onClose={() => setShowAISearch(false)}
        />
      )}
    </div>
  );
};

export default FlightCalculator; 