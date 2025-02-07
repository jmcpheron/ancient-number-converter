import React, { useState } from 'react';

const AncientNumberConverter = () => {
  const [base10Number, setBase10Number] = useState('');
  const [activeTab, setActiveTab] = useState('mayan');
  const [showLegend, setShowLegend] = useState(false);

  const mayanSymbols = [
    '⠀', '•', '••', '•••', '••••',
    '－', '•－', '••－', '•••－', '••••－',
    '＝', '•＝', '••＝', '•••＝', '••••＝',
    '≡', '•≡', '••≡', '•••≡', '••••≡'
  ];

  const egyptianSymbols = {
    1: '𓏺', 10: '𓎆', 100: '𓍢', 1000: '𓆼', 10000: '𓂭', 100000: '𓁨', 1000000: '𓆐'
  };

  const babylonianSymbols = {
    1: '𒁹',   // Wedge
    10: '𒌋'  // Chevron
  };

  const romanSymbols = [
    { value: 1000, symbol: 'M' },
    { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' },
    { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' },
    { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' }
  ];

  const convertToMayan = (num) => {
    if (num < 0 || num > 7999999) return ['Invalid input'];
    
    const result = [];
    let remaining = num;

    while (remaining > 0 || result.length === 0) {
      result.push(mayanSymbols[remaining % 20]);
      remaining = Math.floor(remaining / 20);
    }

    return result;
  };

  const convertToEgyptian = (num) => {
    if (num < 1 || num > 9999999) return ['Invalid input'];

    const result = [];
    const values = Object.keys(egyptianSymbols).map(Number).sort((a, b) => b - a);

    for (let value of values) {
      while (num >= value) {
        result.push(egyptianSymbols[value]);
        num -= value;
      }
    }

    return result;
  };

  const convertToBabylonian = (num) => {
    if (num < 1 || num > 12959999) return ['Invalid input'];

    const result = [];
    let remaining = num;

    for (let i = 3; i >= 0; i--) {
      let powerOf60 = Math.pow(60, i);
      let quotient = Math.floor(remaining / powerOf60);
      remaining %= powerOf60;

      if (quotient > 0 || result.length > 0) {
        let groupResult = [];
        while (quotient > 0) {
          if (quotient >= 10) {
            groupResult.push(babylonianSymbols[10]);
            quotient -= 10;
          } else {
            groupResult.push(babylonianSymbols[1]);
            quotient -= 1;
          }
        }
        result.push(groupResult);
      }
    }

    return result;
  };

  const convertToRoman = (num) => {
    if (num < 1 || num > 3999) return ['Invalid input'];
    
    let result = '';
    for (let { value, symbol } of romanSymbols) {
      while (num >= value) {
        result += symbol;
        num -= value;
      }
    }
    return [result];
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setBase10Number(input);
  };

  const renderNumber = () => {
    const num = parseInt(base10Number, 10);
    if (isNaN(num)) return null;

    if (activeTab === 'mayan') {
      const mayanNumber = convertToMayan(num);
      return (
        <div className="flex justify-center">
          <div className="space-y-2">
            {mayanNumber.map((symbol, index) => (
              <div key={index} className="h-12 w-12 flex items-center justify-center border border-gray-300 rounded-md text-2xl">
                {symbol}
              </div>
            )).reverse()}
          </div>
        </div>
      );
    } else if (activeTab === 'egyptian') {
      const egyptianNumber = convertToEgyptian(num);
      return (
        <div className="flex flex-wrap justify-center gap-2">
          {egyptianNumber.map((symbol, index) => (
            <div key={index} className="h-12 min-w-12 px-2 flex items-center justify-center border border-gray-300 rounded-md text-2xl">
              {symbol}
            </div>
          ))}
        </div>
      );
    } else if (activeTab === 'roman') {
      const romanNumber = convertToRoman(num);
      return (
        <div className="flex flex-wrap justify-center gap-2">
          {romanNumber.map((symbol, index) => (
            <div key={index} className="h-12 min-w-12 px-2 flex items-center justify-center border border-gray-300 rounded-md text-xl font-serif">
              {symbol}
            </div>
          ))}
        </div>
      );
    } else {
      const babylonianNumber = convertToBabylonian(num);
      return (
        <div className="flex flex-col items-center space-y-2">
          {babylonianNumber.map((group, groupIndex) => (
            <div key={groupIndex} className="flex space-x-1">
              {group.map((symbol, symbolIndex) => (
                <div key={symbolIndex} className="h-12 min-w-8 px-1 flex items-center justify-center border border-gray-300 rounded-md text-2xl">
                  {symbol}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }
  };

  const renderLegend = () => {
    if (activeTab === 'mayan') {
      return (
        <div className="grid grid-cols-4 gap-2">
          {mayanSymbols.map((symbol, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="h-8 w-8 flex items-center justify-center border border-gray-300 rounded-md">
                {symbol}
              </div>
              <span>{index}</span>
            </div>
          ))}
        </div>
      );
    } else if (activeTab === 'egyptian') {
      return (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(egyptianSymbols).map(([value, symbol]) => (
            <div key={value} className="flex items-center space-x-2">
              <div className="h-8 min-w-8 px-1 flex items-center justify-center border border-gray-300 rounded-md">
                {symbol}
              </div>
              <span>{value}</span>
            </div>
          ))}
        </div>
      );
    } else if (activeTab === 'roman') {
      return (
        <div className="grid grid-cols-2 gap-2">
          {romanSymbols.map(({ value, symbol }) => (
            <div key={symbol} className="flex items-center space-x-2">
              <div className="h-8 min-w-8 px-1 flex items-center justify-center border border-gray-300 rounded-md font-serif">
                {symbol}
              </div>
              <span>{value}</span>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(babylonianSymbols).map(([value, symbol]) => (
            <div key={value} className="flex items-center space-x-2">
              <div className="h-8 min-w-8 px-1 flex items-center justify-center border border-gray-300 rounded-md">
                {symbol}
              </div>
              <span>{value}</span>
            </div>
          ))}
          <div className="col-span-2">
            <p>Babylonian numbers use base-60. Each group represents a power of 60, from right to left: 1, 60, 3600, 216000.</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold text-center">Ancient Number Converter</h1>
      <input
        type="number"
        value={base10Number}
        onChange={handleInputChange}
        placeholder="Enter a base 10 number"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'mayan' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('mayan')}
        >
          Mayan
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'egyptian' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('egyptian')}
        >
          Egyptian
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'roman' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('roman')}
        >
          Roman
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'babylonian' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('babylonian')}
        >
          Babylonian
        </button>
      </div>
      <div className="space-y-2">
        <h2 className="font-semibold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Representation:</h2>
        {renderNumber()}
      </div>
      <button
        onClick={() => setShowLegend(!showLegend)}
        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        {showLegend ? 'Hide' : 'Show'} Legend
      </button>
      {showLegend && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md">
          <h3 className="font-semibold mb-2">Legend:</h3>
          {renderLegend()}
        </div>
      )}
    </div>
  );
};

export default AncientNumberConverter;