import React from 'react';
import { Mail } from 'lucide-react';
import Messages from '../components/messages/Messages';

const MessagesPage = () => {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center space-x-3">
          <Mail className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Manage your conversations and appointment requests
        </p>
      </div>

      {/* Messages Component */}
      <div className="flex-1 overflow-hidden">
        <Messages />
      </div>
    </div>
  );
};

export default MessagesPage;
