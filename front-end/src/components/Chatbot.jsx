import { useState } from 'react';

function Chatbot (){
    const [chatId, setChatId] = useState(null);
    const [newMessage, setNewMessage] = useState('');


    return (
    <div className='relative grow flex flex-col gap-6 pt-6'>
            <div className='mt-3 font-urbanist text-primary-blue text-xl font-light space-y-2'>
                <p>Bem vindo ao chatbot</p>
            </div>
        
        
    </div>
    );
}

export default Chatbot