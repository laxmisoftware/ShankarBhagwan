
import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatState } from './types';
import { geminiService } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';
import { SendIcon, TrishulaIcon, OmIcon } from './components/Icons';

const App: React.FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        role: 'model',
        text: 'ॐ नमः शिवाय। वत्स, तुम्हारे मन में क्या जिज्ञासा है? मैं तुम्हारी सहायता के लिए यहाँ हूँ।',
        timestamp: new Date()
      }
    ],
    isLoading: false,
    error: null
  });
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || state.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }));
    setInputValue('');

    try {
      const modelMessageId = (Date.now() + 1).toString();
      let fullResponse = '';
      
      const stream = geminiService.sendMessageStream(userMessage.text);
      
      // Add empty placeholder for streaming response
      setState(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          { id: modelMessageId, role: 'model', text: '', timestamp: new Date() }
        ]
      }));

      for await (const textChunk of stream) {
        fullResponse += textChunk;
        setState(prev => ({
          ...prev,
          messages: prev.messages.map(msg => 
            msg.id === modelMessageId ? { ...msg, text: fullResponse } : msg
          )
        }));
      }
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        error: 'क्षमा करें