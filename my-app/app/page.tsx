"use client";
import { useState } from 'react';

export default function Home() {
  const [destination, setDestination] = useState('');
  const [age, setAge] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleSearch = () => {
    if (!destination || !age) {
      alert("Bro, please select both destination and age!");
      return;
    }

    // 1. Weather & Gear Logic
    const dest = destination.toLowerCase();
    let weatherData = { temp: '22°C', condition: 'Pleasant 🌤️', gear1: 'Travel Backpack', gear2: 'Universal Adapter' };
    
    if (dest.includes('dubai') || dest.includes('bali') || dest.includes('maldives')) {
      weatherData = { temp: '34°C', condition: 'Scorching Hot ☀️', gear1: 'SPF 50 Sunscreen', gear2: 'Polarized Sunglasses' };
    } else if (dest.includes('london') || dest.includes('paris') || dest.includes('canada')) {
      weatherData = { temp: '4°C', condition: 'Freezing Cold ❄️', gear1: 'Winter Trench Coat', gear2: 'Thermal Wear' };
    }

    // 2. Credit Card Logic based on Age
    let cardData = { name: 'IDFC First Wealth', perks: ['1.5% Forex Markup', 'Free Lounges', 'Good Rewards'] };
    
    if (age === '18-24') {
      cardData = { name: 'Scapia Federal Card', perks: ['0% Forex Markup', 'Zero Annual Fee', 'Budget Travel Focus'] };
    } else if (age === '25-40') {
      cardData = { name: 'HDFC Regalia Gold', perks: ['Global Lounge Access', 'Flight Milestone Rewards', 'Premium Lifestyle'] };
    } else if (age === '41-60') {
      cardData = { name: 'HDFC Infinia (Metal)', perks: ['Unlimited Global Lounges', 'Golf Access & Concierge', 'Luxury Travel'] };
    }

    // Set final result
    setResult({ weather: weatherData, card: cardData });
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <header className="p-6 bg-white shadow-sm flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">BestCreditCard<span className="text-slate-800">.dev</span></h1>
        <p className="text-sm font-semibold text-slate-500 hidden sm:block">Smart Travel & Finance Engine</p>
      </header>

      <section className="max-w-5xl mx-auto mt-16 p-6 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
          Find the Perfect Card <br/> for Your Next Trip.
        </h2>
        
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 items-center justify-center max-w-4xl mx-auto border border-slate-100 mt-10">
          <input
            type="text"
            placeholder="Where to? (e.g., London, Dubai)"
            className="w-full md:w-1/3 p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-black"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <select
            className="w-full md:w-1/3 p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white text-black"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          >
            <option value="">Select Age Group</option>
            <option value="18-24">18 - 24 Years (Student / First Job)</option>
            <option value="25-40">25 - 40 Years (Professional)</option>
            <option value="41-60">41 - 60+ Years (Established)</option>
          </select>
          <button 
            onClick={handleSearch}
            className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Show My Perks
          </button>
        </div>
      </section>

      {/* Dynamic Results Section */}
      {result && (
        <section className="max-w-5xl mx-auto mt-8 p-6">
          <div className="grid md:grid-cols-2 gap-8">
            
            <div className="bg-white p-8 rounded-3xl shadow-lg border-t-4 border-blue-500">
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase tracking-wider">Top Card Pick</span>
              <h3 className="text-2xl font-black mt-4 mb-2">{result.card.name}</h3>
              <p className="text-slate-600 mb-6">Perfect match for your profile. Enjoy smart perks for {destination}.</p>
              
              <ul className="space-y-3 mb-8">
                {result.card.perks.map((perk: string, index: number) => (
                  <li key={index} className="flex items-center text-sm font-medium text-slate-700">
                    <span className="text-green-500 mr-2 text-lg">✔</span> {perk}
                  </li>
                ))}
              </ul>
              
              <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition">
                Apply Now (Earn ₹2000 Cashback)
              </button>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-3xl shadow-lg text-white">
              <span className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full uppercase tracking-wider">Weather & Gear</span>
              <h3 className="text-2xl font-black mt-4 mb-2">It's {result.weather.condition} in {destination}</h3>
              <p className="text-indigo-100 mb-6">Expected temp: {result.weather.temp}. Don't forget to pack these essentials.</p>
              
              <div className="space-y-4">
                <div className="bg-white/10 hover:bg-white/20 cursor-pointer transition p-4 rounded-xl border border-white/10 flex justify-between items-center">
                  <div>
                    <p className="font-bold">{result.weather.gear1}</p>
                    <p className="text-sm text-indigo-200">Amazon Bestseller</p>
                  </div>
                  <span className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold border border-white">Buy</span>
                </div>
                
                <div className="bg-white/10 hover:bg-white/20 cursor-pointer transition p-4 rounded-xl border border-white/10 flex justify-between items-center">
                  <div>
                    <p className="font-bold">{result.weather.gear2}</p>
                    <p className="text-sm text-indigo-200">Must-have for travel</p>
                  </div>
                  <span className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold border border-white">Buy</span>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}
    </main>
  );
}