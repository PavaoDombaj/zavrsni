import React from "react";
import Navbar2 from "./Navbar2";

const Prices = () => {
  // Podaci o planovima
  const plans = [
    {
      name: "Basic",
      price: "$9.99",
      features: ["1 User", "Basic Support", "Limited Features"],
    },
    {
      name: "Standard",
      price: "$19.99",
      features: ["5 Workers", "Standard Support", "Medium Features"],
    },
    {
      name: "Premium",
      price: "$29.99",
      features: ["Unlimited Workers", "Premium Support", "Full Features"],
    },
  ];

  return (
    <div>
      <Navbar2></Navbar2>
    
    <div className="flex justify-center mt-10">
      
      {plans.map((plan, index) => (
        <div key={index} className="w-1/3 px-6">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              {plan.name}
            </h2>
            <div className="text-3xl font-bold text-center text-gray-800 mb-4">
              {plan.price}
            </div>
            <ul className="text-gray-700 mb-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="mb-2">
                  {feature}
                </li>
              ))}
            </ul>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full">
              Choose Plan
            </button>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default Prices;
