'use client';

import { useState } from 'react';
import { 
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ClockIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  AcademicCapIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface NotificationChannel {
  id: string;
  type: 'email' | 'sms';
  enabled: boolean;
  settings: {
    sender?: string;
    replyTo?: string;
    signature?: string;
    apiKey?: string;
    provider?: string;
  };
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'lesson' | 'exam' | 'payment' | 'document';
  channels: ('email' | 'sms')[];
  timing: {
    before?: number;
    after?: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  content: {
    email?: {
      subject: string;
      body: string;
    };
    sms?: {
      message: string;
    };
  };
  enabled: boolean;
}

const initialChannels: NotificationChannel[] = [
  {
    id: '1',
    type: 'email',
    enabled: true,
    settings: {
      sender: 'contact@tolarys.fr',
      replyTo: 'support@tolarys.fr',
      signature: 'L\'équipe Tolarys'
    }
  },
  {
    id: '2',
    type: 'sms',
    enabled: true,
    settings: {
      provider: 'Twilio',
      apiKey: '**********************'
    }
  }
];

const initialTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Rappel de leçon',
    type: 'lesson',
    channels: ['email', 'sms'],
    timing: {
      before: 24,
      unit: 'hours'
    },
    content: {
      email: {
        subject: 'Rappel : Votre leçon de conduite demain',
        body: 'Bonjour {{nom_eleve}},\n\nNous vous rappelons votre leçon de conduite prévue demain à {{heure_lecon}} avec {{moniteur}}.\n\nBonne journée !'
      },
      sms: {
        message: 'Rappel : Leçon de conduite demain à {{heure_lecon}} avec {{moniteur}}.'
      }
    },
    enabled: true
  },
  {
    id: '2',
    name: 'Confirmation de paiement',
    type: 'payment',
    channels: ['email'],
    timing: {
      after: 0,
      unit: 'minutes'
    },
    content: {
      email: {
        subject: 'Confirmation de votre paiement',
        body: 'Bonjour {{nom_eleve}},\n\nNous confirmons la réception de votre paiement de {{montant}}€ pour {{description}}.\n\nCordialement,'
      }
    },
    enabled: true
  }
];

export default function NotificationsSettingsPage() {
  const [channels, setChannels] = useState<NotificationChannel[]>(initialChannels);
  const [templates, setTemplates] = useState<NotificationTemplate[]>(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleChannelToggle = (channelId: string) => {
    setChannels(channels.map(channel =>
      channel.id === channelId
        ? { ...channel, enabled: !channel.enabled }
        : channel
    ));
  };

  const handleTemplateToggle = (templateId: string) => {
    setTemplates(templates.map(template =>
      template.id === templateId
        ? { ...template, enabled: !template.enabled }
        : template
    ));
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Paramètres des notifications</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos canaux de communication et modèles de notifications
          </p>
        </div>
      </div>

      {/* Canaux de communication */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Canaux de communication</h3>
          <div className="mt-4 space-y-4">
            {channels.map((channel) => (
              <div key={channel.id} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={channel.enabled}
                    onChange={() => handleChannelToggle(channel.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
                <div className="ml-3">
                  <label className="font-medium text-gray-700">
                    {channel.type === 'email' ? 'Notifications par email' : 'Notifications par SMS'}
                  </label>
                  <p className="text-sm text-gray-500">
                    {channel.type === 'email'
                      ? `Expéditeur : ${channel.settings.sender}`
                      : `Fournisseur : ${channel.settings.provider}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modèles de notifications */}
      <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Modèles de notifications</h3>
        </div>
        {templates.map((template) => (
          <div key={template.id} className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`h-10 w-10 rounded-full ${
                    template.enabled ? 'bg-green-100' : 'bg-gray-100'
                  } flex items-center justify-center`}>
                    {template.type === 'lesson' && <ClockIcon className="h-6 w-6 text-green-600" />}
                    {template.type === 'exam' && <AcademicCapIcon className="h-6 w-6 text-green-600" />}
                    {template.type === 'payment' && <CurrencyEuroIcon className="h-6 w-6 text-green-600" />}
                    {template.type === 'document' && <CalendarIcon className="h-6 w-6 text-green-600" />}
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">{template.name}</h4>
                  <div className="mt-1">
                    <div className="flex items-center space-x-2">
                      {template.channels.includes('email') && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          Email
                        </span>
                      )}
                      {template.channels.includes('sms') && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <DevicePhoneMobileIcon className="h-4 w-4 mr-1" />
                          SMS
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleEditTemplate(template)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTemplateToggle(template.id)}
                    className={`ml-3 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                      template.enabled ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <span className="sr-only">Activer le modèle</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        template.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-500">
                {template.timing.before && (
                  <p>
                    Envoyé {template.timing.before} {template.timing.unit} avant l'événement
                  </p>
                )}
                {template.timing.after && (
                  <p>
                    Envoyé {template.timing.after} {template.timing.unit} après l'événement
                  </p>
                )}
              </div>

              {template.content.email && (
                <div className="mt-2">
                  <h5 className="text-sm font-medium text-gray-700">Contenu email :</h5>
                  <p className="mt-1 text-sm text-gray-500">
                    Sujet : {template.content.email.subject}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'édition */}
      {isEditing && selectedTemplate && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                {/* Contenu du formulaire d'édition à implémenter */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Modifier le modèle de notification
                  </h3>
                  {/* Formulaire à implémenter */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
