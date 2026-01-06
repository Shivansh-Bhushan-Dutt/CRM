import { useState } from 'react';
import { Search, Mail, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from './ui/input';

export function ConversationCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const conversations: any[] = []; // Will be fetched from API

  const filteredConversations = conversations.filter(conv => 
    conv.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.from?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Conversation Center</h1>
        <p className="text-gray-600 mt-1">All email and communication records</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Conversations List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
        {filteredConversations.map((conv, idx) => (
          <motion.div
            key={conv.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">{conv.subject}</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {new Date(conv.date).toLocaleDateString()}
              </div>
            </div>
            <p className="text-sm text-gray-600 ml-8">{conv.from}</p>
            <p className="text-sm text-gray-500 ml-8 mt-1">{conv.preview}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
