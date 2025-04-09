import { useState } from 'react';

type AIFlightSearchProps = {
  from: string;
  to: string;
  onClose: () => void;
};

const AIFlightSearch = ({ from, to, onClose }: AIFlightSearchProps) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchFlights = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a helpful travel assistant that provides accurate, up-to-date flight information. 
              Today's date is ${new Date().toLocaleDateString()}. 
              Provide real, current flight information for the requested route. 
              Format your response with clear sections and use current dates and realistic prices.`
            },
            {
              role: "user",
              content: `Please provide information about the next available flight from ${from} to ${to}. 
              Include:
              1. The next available date (must be a future date)
              2. Approximate price range in USD
              3. Flight duration
              4. Possible airlines
              5. Any relevant travel tips for this route
              
              Make sure all dates are in the future and prices are realistic for the current market.`
            }
          ],
          temperature: 0.7,
          max_tokens: 250
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from API');
      }

      const message = data.choices[0].message.content;
      setResult(message);
    } catch (err) {
      console.error('Error fetching flight information:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch flight information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-3xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">AI Flight Search</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="Close search"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Searching flights from:</p>
          <p className="font-medium text-base">{from} → {to}</p>
        </div>

        {!loading && !result && !error && (
          <button
            onClick={searchFlights}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            AI: Find Next Flight
          </button>
        )}

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Searching for flights...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-600 font-medium mb-2 text-sm">Error</p>
            <p className="text-red-500 text-sm">{error}</p>
            <button
              onClick={searchFlights}
              className="mt-4 w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {result && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-3 text-base">Flight Information:</h3>
            <div className="prose prose-sm text-gray-600 text-sm space-y-2">
              {result.split('\n').map((line, index) => (
                <p key={index} className="mb-2">{line}</p>
              ))}
            </div>
            <button
              onClick={searchFlights}
              className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Search Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIFlightSearch; 