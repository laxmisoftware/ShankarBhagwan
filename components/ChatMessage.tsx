
import React from 'react';
import { Message } from '../types';
import { TrishulaIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex w-full mb-6 ${isModel ? 'justify-start' : 'justify-end animate-in slide-in-from-right-4 duration-300'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isModel ? 'flex-row' : 'flex-row-reverse'}`}>
        {isModel && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-900/50 flex items-center justify-center mr-3 border border-sky-500/30 divine-glow">
            <TrishulaIcon className="w-6 h-6 text-sky-400" />
          </div>
        )}
        <div className={`
          relative px-5 py-3 rounded-2xl text-sm md:text-base leading-relaxed
          ${isModel 
            ? 'bg-slate-800/80 text-slate-100 rounded-tl-none border border-slate-700/50 hindi-font' 
            : 'bg-sky-600 text-white rounded-tr-none shadow-lg'
          }
        `}>
          <div className="whitespace-pre-wrap break-words">
            {message.text}
          </div>
          <div className={`text-[10px] mt-2 opacity-50 ${isModel ? 'text-left' : 'text-right'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};
