import { useEffect, useState } from 'react';
import { messagesAPI } from '../services/api';
import { Message } from '../types';
import { MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const messagesData = await messagesAPI.getAll();
      setMessages(messagesData);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

        {messages.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-600">Start connecting with other parents to send messages</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="divide-y divide-gray-200">
              {messages.map((message) => (
                <div key={message.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-gray-900">
                            {message.sender_id === user?.id 
                              ? `To: ${message.receiver?.full_name}`
                              : `From: ${message.sender?.full_name}`
                            }
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(message.created_at).toLocaleString()}
                          </p>
                        </div>
                        {!message.is_read && message.receiver_id === user?.id && (
                          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
