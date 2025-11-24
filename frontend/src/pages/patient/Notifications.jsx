// src/pages/patient/Notifications.js
import React, { useState } from 'react';
import { Bell, Check, Trash2, Filter, Calendar, Pill, CreditCard, Beaker, AlertTriangle } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'Appointment Reminder',
            message: 'Your appointment with Dr. Sarah Johnson is tomorrow at 10:30 AM',
            type: 'appointment',
            date: '2024-01-14 14:30',
            read: false,
            priority: 'high'
        },
        {
            id: 2,
            title: 'Prescription Ready',
            message: 'Your prescription for Amoxicillin 500mg is ready for pickup',
            type: 'prescription',
            date: '2024-01-14 11:15',
            read: false,
            priority: 'medium'
        },
        {
            id: 3,
            title: 'Lab Results Available',
            message: 'Your blood test results from January 10th are now available',
            type: 'lab_result',
            date: '2024-01-13 16:45',
            read: true,
            priority: 'medium'
        },
        {
            id: 4,
            title: 'Payment Due',
            message: 'Invoice INV-001234 for $250.00 is due on January 30th',
            type: 'billing',
            date: '2024-01-12 09:20',
            read: true,
            priority: 'high'
        },
        {
            id: 5,
            title: 'Appointment Confirmed',
            message: 'Your appointment has been confirmed for February 1st at 2:00 PM',
            type: 'appointment',
            date: '2024-01-11 15:10',
            read: true,
            priority: 'low'
        }
    ]);

    const [filter, setFilter] = useState('all');

    const getTypeIcon = (type) => {
        switch (type) {
            case 'appointment': return <Calendar className="w-5 h-5" />;
            case 'prescription': return <Pill className="w-5 h-5" />;
            case 'lab_result': return <Beaker className="w-5 h-5" />;
            case 'billing': return <CreditCard className="w-5 h-5" />;
            default: return <Bell className="w-5 h-5" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'appointment': return 'bg-blue-100 text-blue-600';
            case 'prescription': return 'bg-green-100 text-green-600';
            case 'lab_result': return 'bg-purple-100 text-purple-600';
            case 'billing': return 'bg-yellow-100 text-yellow-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
    };

    const filteredNotifications = filter === 'all'
        ? notifications
        : filter === 'unread'
            ? notifications.filter(n => !n.read)
            : notifications.filter(n => n.type === filter);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    <p className="text-gray-600">Stay updated with your healthcare activities</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Mark All Read
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Bell className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-2xl font-bold">{notifications.length}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-red-100 p-3 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Unread</p>
                            <p className="text-2xl font-bold">{unreadCount}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Appointments</p>
                            <p className="text-2xl font-bold">{notifications.filter(n => n.type === 'appointment').length}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Pill className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Prescriptions</p>
                            <p className="text-2xl font-bold">{notifications.filter(n => n.type === 'prescription').length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
                {['all', 'unread', 'appointment', 'prescription', 'lab_result', 'billing'].map((filterType) => (
                    <button
                        key={filterType}
                        onClick={() => setFilter(filterType)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap ${filter === filterType
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {filterType === 'all' ? 'All' :
                            filterType === 'unread' ? 'Unread' :
                                filterType.charAt(0).toUpperCase() + filterType.slice(1).replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <div className="card text-center py-12">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                        <p className="text-gray-600">You're all caught up!</p>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`card hover:shadow-lg transition-shadow ${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start">
                                    <div className={`p-3 rounded-lg ${getTypeColor(notification.type)}`}>
                                        {getTypeIcon(notification.type)}
                                    </div>
                                    <div className="ml-4">
                                        <div className="flex items-center flex-wrap gap-2">
                                            <h3 className="font-bold">{notification.title}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                                                {notification.priority.toUpperCase()}
                                            </span>
                                            {!notification.read && (
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                    NEW
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-700 mt-2">{notification.message}</p>
                                        <p className="text-sm text-gray-500 mt-2">{notification.date}</p>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    {!notification.read && (
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                            title="Mark as read"
                                        >
                                            <Check className="w-5 h-5 text-gray-600" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notification.id)}
                                        className="p-2 hover:bg-red-50 rounded-lg"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Notification Settings */}
            <div className="card">
                <h2 className="text-xl font-bold mb-6">Notification Settings</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Appointment Reminders</p>
                            <p className="text-sm text-gray-600">Receive reminders for upcoming appointments</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Prescription Alerts</p>
                            <p className="text-sm text-gray-600">Notifications for prescription updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Lab Results</p>
                            <p className="text-sm text-gray-600">Alerts when lab results are available</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Billing Notifications</p>
                            <p className="text-sm text-gray-600">Payment reminders and invoice updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;