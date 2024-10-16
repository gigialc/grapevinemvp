import React, { useState, useEffect } from 'react';

const LiveChat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // Set up real-time connection (e.g., WebSocket)
        // Listen for new messages and update the messages state
    }, []);

    const handleSendMessage = () => {
        // Send message to server
        // Update local messages state
        setMessages([...messages, { user: 'You', text: newMessage }]);
        setNewMessage('');
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
            <div className="h-40 overflow-y-auto mb-2">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.user}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full p-2 border rounded"
            />
            <button 
                onClick={handleSendMessage}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Send
            </button>
        </div>
    );
};

export default LiveChat;