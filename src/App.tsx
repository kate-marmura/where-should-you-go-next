import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowPathIcon, ShareIcon } from '@heroicons/react/24/outline'
import destinationsData from './data/destinations.json'
import BudgetCalculator from './components/BudgetCalculator'

type Question = {
  id: number
  text: string
  options: {
    id: number
    text: string
    image: string
    value: string
  }[]
}

type Criteria = {
  weather: string[];
  activity: string[];
  palette: string[];
  pace: string[];
  food: string[];
};

type Destination = {
  id: string
  destination: string
  description: string
  image: string
  funFact: string
  criteria: Criteria
}

const questions: Question[] = [
  {
    id: 1,
    text: "What's your ideal weather?",
    options: [
      { id: 1, text: "Sunny and warm", image: "☀️", value: "sunny" },
      { id: 2, text: "Cool and misty", image: "🌫️", value: "misty" },
      { id: 3, text: "Tropical rain", image: "🌧️", value: "rainy" },
      { id: 4, text: "Snowy wonderland", image: "❄️", value: "snowy" },
      { id: 5, text: "Mild and breezy", image: "🍃", value: "mild" },
      { id: 6, text: "Desert heat", image: "🏜️", value: "desert" }
    ]
  },
  {
    id: 2,
    text: "What activities interest you most?",
    options: [
      { id: 1, text: "Cultural exploration", image: "🏯", value: "cultural" },
      { id: 2, text: "Beach relaxation", image: "🏖️", value: "beach" },
      { id: 3, text: "Adventure sports", image: "🏔️", value: "adventure" },
      { id: 4, text: "City exploration", image: "🌆", value: "urban" },
      { id: 5, text: "Wildlife watching", image: "🦁", value: "wildlife" },
      { id: 6, text: "Food exploration", image: "🍜", value: "food" }
    ]
  },
  {
    id: 3,
    text: "Which color palette speaks to you?",
    options: [
      { id: 1, text: "Pastel dreams", image: "🎨", value: "pastel" },
      { id: 2, text: "Earth tones", image: "🌳", value: "earthy" },
      { id: 3, text: "Vibrant colors", image: "🎪", value: "vibrant" },
      { id: 4, text: "Monochrome elegance", image: "⚫", value: "monochrome" },
      { id: 5, text: "Ocean blues", image: "🌊", value: "ocean" },
      { id: 6, text: "Sunset hues", image: "🌅", value: "sunset" }
    ]
  },
  {
    id: 4,
    text: "What's your ideal pace of travel?",
    options: [
      { id: 1, text: "Slow and relaxed", image: "🐢", value: "slow" },
      { id: 2, text: "Balanced and steady", image: "⚖️", value: "balanced" },
      { id: 3, text: "Fast and energetic", image: "⚡", value: "fast" },
      { id: 4, text: "Adventure seeker", image: "🏃", value: "adventurous" },
      { id: 5, text: "Luxury and comfort", image: "👑", value: "luxury" },
      { id: 6, text: "Backpacking spirit", image: "🎒", value: "backpacking" }
    ]
  },
  {
    id: 5,
    text: "What's your food preference?",
    options: [
      { id: 1, text: "Street food explorer", image: "🥘", value: "street" },
      { id: 2, text: "Fine dining", image: "🍽️", value: "fine" },
      { id: 3, text: "Fresh and healthy", image: "🥗", value: "healthy" },
      { id: 4, text: "Traditional cuisine", image: "👨‍🍳", value: "traditional" },
      { id: 5, text: "Seafood lover", image: "🦞", value: "seafood" },
      { id: 6, text: "Plant-based", image: "🌱", value: "vegan" }
    ]
  }
]

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<Destination | null>(null)
  const [showBudgetCalculator, setShowBudgetCalculator] = useState(false)
  const [tripDuration, setTripDuration] = useState(7) // Default 7 days

  const calculateDestinationScore = (destination: Destination, userAnswers: string[]) => {
    const [weather, activity, palette, pace, food] = userAnswers
    let score = 0

    // Weather match (highest weight)
    if (destination.criteria.weather.includes(weather)) score += 30

    // Activity match (high weight)
    if (destination.criteria.activity.includes(activity)) score += 25

    // Palette match (medium weight)
    if (destination.criteria.palette.includes(palette)) score += 15

    // Pace match (medium weight)
    if (destination.criteria.pace.includes(pace)) score += 15

    // Food match (medium weight)
    if (destination.criteria.food.includes(food)) score += 15

    return score
  }

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate scores for all destinations
      const destinationScores = destinationsData.destinations.map(destination => ({
        destination,
        score: calculateDestinationScore(destination, newAnswers)
      }))

      // Sort by score and get the best match
      const bestMatch = destinationScores.sort((a, b) => b.score - a.score)[0]
      setResult(bestMatch.destination)
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResult(false)
    setResult(null)
  }

  const handleSubmit = () => {
    if (answers.length !== questions.length) return;

    // Get the user's answers
    const userPreferences = {
      weather: answers[0],
      activity: answers[1],
      palette: answers[2],
      pace: answers[3],
      food: answers[4]
    };

    // Find the best matching destination
    const matchingDestination = destinationsData.destinations.find(destination => {
      const criteria = destination.criteria;
      return (
        criteria.weather.includes(userPreferences.weather) &&
        criteria.activity.includes(userPreferences.activity) &&
        criteria.palette.includes(userPreferences.palette) &&
        criteria.pace.includes(userPreferences.pace) &&
        criteria.food.includes(userPreferences.food)
      );
    });

    // If no exact match, find the closest match based on weather and activity
    if (!matchingDestination) {
      const closeMatch = destinationsData.destinations.find(destination => 
        destination.criteria.weather.includes(userPreferences.weather) &&
        destination.criteria.activity.includes(userPreferences.activity)
      );

      if (closeMatch) {
        setResult(closeMatch);
      } else {
        // Default to a random destination if no match found
        const randomDestination = destinationsData.destinations[Math.floor(Math.random() * destinationsData.destinations.length)];
        setResult(randomDestination);
      }
    } else {
      setResult(matchingDestination);
    }

    setShowResult(true);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-200 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
              >
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                  Where Should You Go Next?
                </h1>
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-700 text-center">
                    {questions[currentQuestion].text}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {questions[currentQuestion].options.map((option) => (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="option-card bg-white/90 hover:bg-white"
                        onClick={() => handleAnswer(option.value)}
                      >
                        <div className="text-4xl mb-2">{option.image}</div>
                        <p className="text-gray-700">{option.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
              >
                {result && (
                  <div className="space-y-6">
                    <div className="relative h-64 rounded-xl overflow-hidden">
                      <img
                        src={result.image}
                        alt={result.destination}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-3xl font-bold text-center text-gray-800">
                      {result.destination}
                    </h2>
                    <p className="text-gray-600 text-center">{result.description}</p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-800 font-medium">{result.funFact}</p>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-gray-700">Trip Duration:</label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={tripDuration}
                          onChange={(e) => setTripDuration(Number(e.target.value))}
                          className="w-20 px-2 py-1 border rounded-lg"
                        />
                        <span className="text-gray-600">days</span>
                      </div>
                      
                      <button
                        onClick={() => setShowBudgetCalculator(true)}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Calculate Budget
                      </button>
                    </div>

                    <div className="flex justify-center gap-4">
                      <button
                        onClick={resetQuiz}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <ArrowPathIcon className="w-5 h-5" />
                        Take Quiz Again
                      </button>
                      <button
                        onClick={() => {
                          const text = `I should visit ${result.destination}! Check out this travel quiz to find your perfect destination: ${window.location.href}`;
                          navigator.clipboard.writeText(text);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <ShareIcon className="w-5 h-5" />
                        Share Result
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showBudgetCalculator && result && (
        <BudgetCalculator
          destination={result.destination}
          duration={tripDuration}
          onClose={() => setShowBudgetCalculator(false)}
        />
      )}
    </div>
  )
}

export default App
