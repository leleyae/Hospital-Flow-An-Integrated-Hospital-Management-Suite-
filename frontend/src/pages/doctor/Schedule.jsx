// src/pages/doctor/Schedule.jsx
import { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Edit,
    Save,
    Plus,
    Trash2
} from 'lucide-react';
import doctorService from '../../services/doctorService';


const Schedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const daysOfWeek = [
        { id: 0, name: 'Sunday' },
        { id: 1, name: 'Monday' },
        { id: 2, name: 'Tuesday' },
        { id: 3, name: 'Wednesday' },
        { id: 4, name: 'Thursday' },
        { id: 5, name: 'Friday' },
        { id: 6, name: 'Saturday' },
    ];

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const response = await doctorService.getSchedule();
            if (response.data.schedule && Array.isArray(response.data.schedule)) {
                setSchedule(response.data.schedule);
            }
        } catch (err) {
            setError('Failed to load schedule');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDayToggle = (dayId) => {
        if (!editing) return;

        setSchedule(schedule.map(day => {
            if (day.dayOfWeek === dayId) {
                return { ...day, isAvailable: !day.isAvailable };
            }
            return day;
        }));
    };

    const handleTimeChange = (dayId, field, value) => {
        setSchedule(schedule.map(day => {
            if (day.dayOfWeek === dayId) {
                return { ...day, [field]: value };
            }
            return day;
        }));
    };

    const handleAddDay = () => {
        const existingDays = schedule.map(d => d.dayOfWeek);
        const availableDay = daysOfWeek.find(day => !existingDays.includes(day.id));

        if (availableDay) {
            setSchedule([
                ...schedule,
                {
                    dayOfWeek: availableDay.id,
                    startTime: '09:00',
                    endTime: '17:00',
                    isAvailable: true
                }
            ]);
        }
    };

    const handleRemoveDay = (dayId) => {
        setSchedule(schedule.filter(day => day.dayOfWeek !== dayId));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await doctorService.updateSchedule({ availability: schedule });
            setSuccess('Schedule updated successfully');
            setEditing(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to update schedule');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && schedule.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Doctor Schedule</h1>
                    <p className="text-gray-600 mt-2">Manage your availability and working hours</p>
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    {editing ? (
                        <>
                            <button
                                onClick={() => {
                                    setEditing(false);
                                    fetchSchedule();
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center disabled:opacity-50"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setEditing(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Schedule
                        </button>
                    )}
                </div>
            </div>

            {/* Schedule Grid */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                            <h2 className="text-xl font-bold text-gray-900">Weekly Schedule</h2>
                        </div>
                        {editing && (
                            <button
                                onClick={handleAddDay}
                                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Day
                            </button>
                        )}
                    </div>
                </div>

                <div className="divide-y divide-gray-200">
                    {daysOfWeek.map(day => {
                        const daySchedule = schedule.find(d => d.dayOfWeek === day.id);

                        return (
                            <div key={day.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                <div className="flex flex-col md:flex-row md:items-center justify-between">
                                    <div className="flex items-center mb-4 md:mb-0">
                                        <button
                                            onClick={() => handleDayToggle(day.id)}
                                            disabled={!editing}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full mr-4 ${daySchedule?.isAvailable ? 'bg-green-500' : 'bg-gray-300'
                                                } ${editing ? 'cursor-pointer' : 'cursor-default'}`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${daySchedule?.isAvailable ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                        <div className="flex items-center">
                                            <span className="font-medium text-gray-900 text-lg">{day.name}</span>
                                            <span className="ml-3">
                                                {daySchedule?.isAvailable ? (
                                                    <span className="flex items-center text-green-600">
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Available
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-red-600">
                                                        <XCircle className="w-4 h-4 mr-1" />
                                                        Not Available
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {daySchedule?.isAvailable ? (
                                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                                            <div className="flex items-center">
                                                <Clock className="w-5 h-5 text-gray-400 mr-2" />
                                                <div className="flex space-x-2">
                                                    <input
                                                        type="time"
                                                        value={daySchedule.startTime || '09:00'}
                                                        onChange={(e) => handleTimeChange(day.id, 'startTime', e.target.value)}
                                                        disabled={!editing}
                                                        className={`border rounded-lg px-3 py-2 w-32 ${editing
                                                            ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                            : 'border-transparent bg-transparent'
                                                            }`}
                                                    />
                                                    <span className="text-gray-500">to</span>
                                                    <input
                                                        type="time"
                                                        value={daySchedule.endTime || '17:00'}
                                                        onChange={(e) => handleTimeChange(day.id, 'endTime', e.target.value)}
                                                        disabled={!editing}
                                                        className={`border rounded-lg px-3 py-2 w-32 ${editing
                                                            ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                                            : 'border-transparent bg-transparent'
                                                            }`}
                                                    />
                                                </div>
                                            </div>

                                            {editing && daySchedule && (
                                                <button
                                                    onClick={() => handleRemoveDay(day.id)}
                                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">
                                            {editing ? 'Click toggle to add availability' : 'No working hours set'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Availability Checker */}
            <div className="mt-8 bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Check Availability</h2>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-1">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Time
                        </label>
                        <input
                            type="time"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-end">
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                            Check Availability
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages */}
            {success && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <p className="text-green-700">{success}</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <XCircle className="w-5 h-5 text-red-500 mr-3" />
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule;