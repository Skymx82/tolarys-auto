'use client';

import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import DateFormatter from './DateFormatter';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  date: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Leçon de conduite demain',
    message: 'Rappel : Vous avez une leçon de conduite demain à 14h00 avec Jean Martin.',
    type: 'info',
    date: '2025-02-11T10:00:00',
    read: false
  },
  {
    id: '2',
    title: 'Paiement reçu',
    message: 'Votre paiement de 45€ pour la leçon de conduite a été reçu.',
    type: 'success',
    date: '2025-02-11T09:30:00',
    read: false
  },
  {
    id: '3',
    title: 'Examen de code',
    message: 'Votre examen de code est prévu dans une semaine. N\'oubliez pas de réviser !',
    type: 'warning',
    date: '2025-02-11T08:00:00',
    read: true
  }
];

export default function NotificationMenu() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-600';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600';
      case 'success':
        return 'bg-green-100 text-green-600';
      case 'error':
        return 'bg-red-100 text-red-600';
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <BellIcon className="h-6 w-6 text-gray-500" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs">
              {unreadCount}
            </span>
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-96 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Aucune notification</p>
              ) : (
                notifications.map((notification) => (
                  <Menu.Item key={notification.id}>
                    {({ active }) => (
                      <div
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } ${
                          !notification.read ? 'bg-blue-50' : ''
                        } p-3 rounded-lg cursor-pointer`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full ${getNotificationIcon(notification.type)}`}>
                            <BellIcon className="h-5 w-5" />
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {notification.message}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              <DateFormatter date={notification.date} format="long" />
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                ))
              )}
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
