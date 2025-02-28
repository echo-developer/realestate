import { useState } from "react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "👋 Hi! Ask me anything about Tata 88 East",
    },
    {
      type: "system",
      suggestions: [
        "What amenities does this project offer?",
        "Are there any schools near this project?",
        "Does the project have a swimming pool?",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [phone, setPhone] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { type: "user", text: input }]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "The Tata 88 East project offers a wide range of amenities including a gym, swimming pool, clubhouse, and more!",
        },
      ]);
    }, 1000);
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    alert(`Property expert will contact you at ${phone}`);
    setPhone("");
  };

  return (
    <div className="chatBotSection">
      {isOpen ? (
        <div className="chatBotBox active">
          <div className="chatBotHeader">
            <button onClick={() => setIsOpen(false)}>❌</button>
            <div className="companyProfile">
              <p>Square Yards</p>
              <span className="status">Online</span>
            </div>
          </div>
          <div className="chatBotBody">
            {messages.map((msg, index) => (
              <div key={index} className={`replyBox ${msg.type}`}>
                <p>{msg.text}</p>
                {msg.type === "system" && (
                  <ul>
                    {msg.suggestions.map((suggestion, idx) => (
                      <li key={idx} onClick={() => setInput(suggestion)}>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <form onSubmit={handlePhoneSubmit} className="phoneBox">
              <label>Enter your phone number:</label>
              <input
                type="tel"
                placeholder="Your Phone Number"
                maxLength="10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button type="submit">📞 Submit</button>
            </form>
          </div>
          <div className="chatBotFooter">
            <input
              type="text"
              placeholder="Type your message here"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <div className="mobileChatBotBtn" onClick={() => setIsOpen(true)}>
          <p>Start Chat</p>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
