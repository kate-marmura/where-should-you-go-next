import { useState } from 'react';
import { motion } from 'framer-motion';
import FlightCalculator from './FlightCalculator';

type BudgetCategory = {
  name: string;
  min: number;
  max: number;
  icon: string;
  isDaily?: boolean;
};

type BudgetCalculatorProps = {
  destination: string;
  duration: number;
  onClose: () => void;
};

const budgetCategories: BudgetCategory[] = [
  { name: "Accommodation", min: 50, max: 300, icon: "🏨", isDaily: true },
  { name: "Food & Drinks", min: 30, max: 150, icon: "🍽️", isDaily: true },
  { name: "Activities", min: 20, max: 100, icon: "🎭", isDaily: true },
  { name: "Transportation", min: 10, max: 50, icon: "🚇", isDaily: true }
];

const BudgetCalculator = ({ destination, duration, onClose }: BudgetCalculatorProps) => {
  const [budgetLevel, setBudgetLevel] = useState<'budget' | 'mid-range' | 'luxury'>('mid-range');
  const [showFlightCalculator, setShowFlightCalculator] = useState(false);
  const [flightCost, setFlightCost] = useState<number | null>(null);

  const handleFlightCostCalculated = (cost: number) => {
    setFlightCost(cost);
    setShowFlightCalculator(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Budget Calculator for {destination}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Close calculator"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Budget Level</label>
            <div className="flex gap-2">
              {['budget', 'mid-range', 'luxury'].map((level) => (
                <button
                  key={level}
                  onClick={() => setBudgetLevel(level as 'budget' | 'mid-range' | 'luxury')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                    budgetLevel === level
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-xl">✈️</span>
                <span className="font-medium">Flights</span>
              </div>
              <div className="text-right">
                {flightCost ? (
                  <div className="font-semibold">${flightCost}</div>
                ) : (
                  <button
                    onClick={() => setShowFlightCalculator(true)}
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    Calculate
                  </button>
                )}
              </div>
            </div>

            {budgetCategories.map((category) => {
              const dailyCost = budgetLevel === 'budget' 
                ? category.min 
                : budgetLevel === 'mid-range' 
                  ? (category.min + category.max) / 2 
                  : category.max;
              const totalCost = category.isDaily ? dailyCost * duration : dailyCost;

              return (
                <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${totalCost.toFixed(0)}</div>
                    {category.isDaily && (
                      <div className="text-xs text-gray-500">${dailyCost.toFixed(0)} per day</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Estimated Budget</span>
              <span className="text-2xl font-bold text-blue-600">
                ${(budgetCategories.reduce((total, category) => {
                  const dailyCost = budgetLevel === 'budget' 
                    ? category.min 
                    : budgetLevel === 'mid-range' 
                      ? (category.min + category.max) / 2 
                      : category.max;
                  return total + (category.isDaily ? dailyCost * duration : dailyCost);
                }, 0) + (flightCost || 0)).toFixed(0)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              For {duration} {duration === 1 ? 'day' : 'days'} in {destination}
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>

      {showFlightCalculator && (
        <FlightCalculator
          destination={destination}
          budgetLevel={budgetLevel}
          onClose={() => setShowFlightCalculator(false)}
        />
      )}
    </>
  );
};

export default BudgetCalculator; 