import { useState } from 'react';
import ChatMessages from '@/components/ChatMessages'
import ChatInput from '@/components/ChatInput'

function Chatbot (){
    const [chatId, setChatId] = useState(null);
    const [newMessage, setNewMessage] = useState('');


    return (
    <div className='relative grow flex flex-col gap-6 pt-6'>
            <div className='mt-3 font-urbanist text-primary-blue text-xl font-light space-y-2'>
                <p>Bem vindo ao chatbot</p>
            </div>
        <ChatMessages />
        <ChatInput />
        
    </div>
    );
}

export default Chatbot