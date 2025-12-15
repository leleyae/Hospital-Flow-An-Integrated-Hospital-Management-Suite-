// src/pages/pharmacist/DrugInfo.jsx
import { useState } from 'react';
import {
    FaSearch,
    FaPills,
    FaFlask,
    FaExclamationTriangle,
    FaInfoCircle,
    FaTablets,
    FaCapsules,
    FaSyringe
} from 'react-icons/fa';
import { pharmacistService } from '../../services/pharmacist.service';

const DrugInfo = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [drugInfo, setDrugInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [showInteractions, setShowInteractions] = useState(false);
    const [selectedDrugs, setSelectedDrugs] = useState([]);

    const commonDrugs = [
        { name: 'Amoxicillin', category: 'antibiotic', form: 'tablet' },
        { name: 'Ibuprofen', category: 'analgesic', form: 'tablet' },
        { name: 'Lisinopril', category: 'antihypertensive', form: 'tablet' },
        { name: 'Metformin', category: 'diabetic', form: 'tablet' },
        { name: 'Atorvastatin', category: 'cholesterol', form: 'tablet' },
        { name: 'Omeprazole', category: 'antacid', form: 'capsule' },
        { name: 'Cetirizine', category: 'antihistamine', form: 'tablet' },
        { name: 'Salbutamol', category: 'bronchodilator', form: 'inhaler' }
    ];

    const drugCategories = [
        { name: 'Antibiotics', icon: FaFlask, count: 45, color: 'bg-blue-100 text-blue-800' },
        { name: 'Analgesics', icon: FaTablets, count: 32, color: 'bg-red-100 text-red-800' },
        { name: 'Antihypertensives', icon: FaCapsules, count: 28, color: 'bg-green-100 text-green-800' },
        { name: 'Diabetic Drugs', icon: FaSyringe, count: 18, color: 'bg-yellow-100 text-yellow-800' },
        { name: 'Psychiatric', icon: FaSyringe, count: 22, color: 'bg-purple-100 text-purple-800' }
    ];

    const handleSearch = async (drugName) => {
        if (!drugName.trim()) return;

        try {
            setLoading(true);
            const data = await pharmacistService.getDrugInformation(drugName);
            setDrugInfo(data.data?.drugInfo);

            // Add to recent searches
            setRecentSearches(prev => {
                const newSearches = [drugName, ...prev.filter(s => s !== drugName)];
                return newSearches.slice(0, 5);
            });
        } catch (error) {
            console.error('Error fetching drug info:', error);
            setDrugInfo(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckInteractions = async () => {
        if (selectedDrugs.length < 2) {
            alert('Please select at least 2 drugs to check interactions');
            return;
        }

        try {
            const medications = selectedDrugs.map(name => ({ medicineName: name }));
            const data = await pharmacistService.checkDrugInteractions(medications, []);
            setShowInteractions(true);
            // You could display interaction results in a modal or section
            alert(`Interaction check complete. Found ${data.data?.interactions?.length || 0} interactions.`);
        } catch (error) {
            console.error('Error checking interactions:', error);
            alert('Failed to check drug interactions');
        }
    };

    const getDrugFormIcon = (form) => {
        switch (form.toLowerCase()) {
            case 'tablet': return <FaTablets className="text-blue-500" />;
            case 'capsule': return <FaCapsules className="text-green-500" />;
            case 'injection': return <FaSyringe className="text-red-500" />;
            case 'liquid': return <FaSyringe className="text-purple-500" />;
            default: return <FaPills className="text-gray-500" />;
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'antibiotic': 'bg-blue-100 text-blue-800',
            'analgesic': 'bg-red-100 text-red-800',
            'antihypertensive': 'bg-green-100 text-green-800',
            'diabetic': 'bg-yellow-100 text-yellow-800',
            'cholesterol': 'bg-purple-100 text-purple-800',
            'antacid': 'bg-pink-100 text-pink-800',
            'antihistamine': 'bg-indigo-100 text-indigo-800',
            'bronchodilator': 'bg-cyan-100 text-cyan-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    const formatStorageInfo = (storage) => {
        if (!storage) return 'Store at room temperature';
        if (storage.includes('2-8') || storage.includes('refrigerate')) {
            return 'Refrigerate (2-8°C)';
        }
        return storage;
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Drug Information</h1>
                <p className="text-gray-600">Access detailed information about medicines and check interactions</p>
            </div>

            {/* Main Search */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                                placeholder="Search for a drug name (e.g., Amoxicillin, Ibuprofen)..."
                                className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => handleSearch(searchQuery)}
                        disabled={loading || !searchQuery.trim()}
                        className={`px-6 py-3 rounded-lg font-medium ${loading || !searchQuery.trim() ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors`}
                    >
                        {loading ? 'Searching...' : 'Search Drug'}
                    </button>
                </div>
            </div>

            {/* Drug Categories */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {drugCategories.map((category, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => {
                                setSearchQuery(category.name);
                                handleSearch(category.name);
                            }}
                        >
                            <category.icon className={`text-2xl mx-auto mb-2 ${category.color.split(' ')[1]}`} />
                            <h3 className="font-medium text-gray-900">{category.name}</h3>
                            <p className="text-lg text-gray-500">{category.count} drugs</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Selected Drugs for Interaction Check */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Drug Interaction Check</h2>
                    <button
                        onClick={handleCheckInteractions}
                        disabled={selectedDrugs.length < 2}
                        className={`px-4 py-2 rounded-lg ${selectedDrugs.length < 2 ? 'bg-gray-300 text-gray-500' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                    >
                        Check Interactions
                    </button>
                </div>
                <p className="text-gray-600 mb-4">Select drugs to check for potential interactions:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {commonDrugs.map((drug, index) => {
                        const isSelected = selectedDrugs.includes(drug.name);
                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    if (isSelected) {
                                        setSelectedDrugs(selectedDrugs.filter(d => d !== drug.name));
                                    } else {
                                        setSelectedDrugs([...selectedDrugs, drug.name]);
                                    }
                                }}
                                className={`flex items-center px-3 py-2 rounded-lg ${isSelected ? 'bg-blue-100 border border-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                {getDrugFormIcon(drug.form)}
                                <span className="ml-2">{drug.name}</span>
                                {isSelected && (
                                    <span className="ml-2 text-blue-600">✓</span>
                                )}
                            </button>
                        );
                    })}
                </div>
                {selectedDrugs.length > 0 && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-lg text-blue-700">
                            Selected: {selectedDrugs.join(', ')}
                        </p>
                    </div>
                )}
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h2>
                    <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setSearchQuery(search);
                                    handleSearch(search);
                                }}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                {search}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Access Common Drugs */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Commonly Searched Drugs</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {commonDrugs.map((drug, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                                setSearchQuery(drug.name);
                                handleSearch(drug.name);
                            }}
                        >
                            <div className="flex items-center mb-2">
                                {getDrugFormIcon(drug.form)}
                                <h3 className="font-medium text-gray-900 ml-2">{drug.name}</h3>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(drug.category)}`}>
                                {drug.category}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Drug Information Display */}
            {drugInfo && (
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{drugInfo.name}</h2>
                                {drugInfo.genericName && (
                                    <p className="text-gray-600">Generic: {drugInfo.genericName}</p>
                                )}
                            </div>
                            <button
                                onClick={() => setDrugInfo(null)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div>
                                <h3 className="font-medium text-gray-900 mb-4">Basic Information</h3>
                                <div className="space-y-3">
                                    {drugInfo.manufacturer && (
                                        <div className="flex">
                                            <span className="w-32 text-gray-500">Manufacturer:</span>
                                            <span className="font-medium">{drugInfo.manufacturer}</span>
                                        </div>
                                    )}

                                    {drugInfo.category && (
                                        <div className="flex">
                                            <span className="w-32 text-gray-500">Category:</span>
                                            <span className={`px-2 py-1 rounded text-lg font-medium ${getCategoryColor(drugInfo.category.toLowerCase())}`}>
                                                {drugInfo.category}
                                            </span>
                                        </div>
                                    )}

                                    {drugInfo.description && (
                                        <div className="flex">
                                            <span className="w-32 text-gray-500">Description:</span>
                                            <span className="flex-1">{drugInfo.description}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Storage and Stock */}
                            <div>
                                <h3 className="font-medium text-gray-900 mb-4">Storage & Availability</h3>
                                <div className="space-y-3">
                                    {drugInfo.storageConditions && (
                                        <div className="flex items-center">
                                            <FaInfoCircle className="text-blue-500 mr-2" />
                                            <div>
                                                <span className="text-gray-500">Storage: </span>
                                                <span className="font-medium">{formatStorageInfo(drugInfo.storageConditions)}</span>
                                            </div>
                                        </div>
                                    )}

                                    {drugInfo.currentStock !== undefined && (
                                        <div className="flex">
                                            <span className="w-32 text-gray-500">Current Stock:</span>
                                            <span className={`font-medium ${drugInfo.currentStock <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                                                {drugInfo.currentStock} units
                                            </span>
                                        </div>
                                    )}

                                    {drugInfo.expiryDate && (
                                        <div className="flex">
                                            <span className="w-32 text-gray-500">Expiry Date:</span>
                                            <span className="font-medium">{new Date(drugInfo.expiryDate).toLocaleDateString()}</span>
                                        </div>
                                    )}

                                    {drugInfo.unitPrice && (
                                        <div className="flex">
                                            <span className="w-32 text-gray-500">Unit Price:</span>
                                            <span className="font-medium">
                                                ${parseFloat(drugInfo.unitPrice).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Side Effects and Contraindications */}
                        {(drugInfo.commonSideEffects || drugInfo.contraindications) && (
                            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {drugInfo.commonSideEffects && (
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <FaExclamationTriangle className="text-yellow-500 mr-2" />
                                            <h4 className="font-medium text-yellow-800">Common Side Effects</h4>
                                        </div>
                                        <ul className="list-disc list-inside text-yellow-700">
                                            {drugInfo.commonSideEffects.map((effect, index) => (
                                                <li key={index} className="mb-1">{effect}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {drugInfo.contraindications && (
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <FaExclamationTriangle className="text-red-500 mr-2" />
                                            <h4 className="font-medium text-red-800">Contraindications</h4>
                                        </div>
                                        <ul className="list-disc list-inside text-red-700">
                                            {drugInfo.contraindications.map((contra, index) => (
                                                <li key={index} className="mb-1">{contra}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Supplier Information */}
                        {drugInfo.supplier && (
                            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-medium text-blue-800 mb-2">Supplier Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-blue-700">Name: </span>
                                        <span className="font-medium">{drugInfo.supplier.name || drugInfo.supplier}</span>
                                    </div>
                                    {drugInfo.supplier.contact && (
                                        <div>
                                            <span className="text-blue-700">Contact: </span>
                                            <span>{drugInfo.supplier.contact}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Interaction Check for this drug */}
                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    if (!selectedDrugs.includes(drugInfo.name)) {
                                        setSelectedDrugs([...selectedDrugs, drugInfo.name]);
                                    }
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Add to Interaction Check
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Interaction Results Modal */}
            {showInteractions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Drug Interaction Results</h3>
                                <button
                                    onClick={() => setShowInteractions(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">Selected Drugs:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedDrugs.map((drug, index) => (
                                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-lg">
                                            {drug}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                                <div className="flex">
                                    <FaInfoCircle className="text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-yellow-800">Important Notice</h4>
                                        <p className="text-yellow-700 mt-1 text-lg">
                                            This interaction check is for informational purposes only. Always consult
                                            with a healthcare professional before making any changes to medication regimens.
                                            Some interactions may require dosage adjustments or medical supervision.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="font-medium text-gray-900 mb-4">Next Steps:</h4>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                        Review each medication's individual profile for complete information
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                        Consult with the prescribing doctor about potential interactions
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                        Monitor patients for adverse effects when starting new combinations
                                    </li>
                                </ul>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setShowInteractions(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Information Panel */}
            {!drugInfo && !loading && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start">
                        <FaInfoCircle className="text-blue-500 text-xl mr-3 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-gray-900 mb-2">How to Use This Tool</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Search for any drug by its brand or generic name</li>
                                <li>• Click on common drugs for quick access to information</li>
                                <li>• Select multiple drugs to check for potential interactions</li>
                                <li>• Browse drugs by category for related medications</li>
                                <li>• Check storage conditions and expiry information</li>
                                <li>• Review side effects and contraindications before dispensing</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DrugInfo;