import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import axios from 'axios';

const API_KEY = "sk-proj-yNe10q6dguHOwEWA55jaT3BlbkFJHtjlLXmTleX4ncOAfPDD";

const Chat = () => {
  const { id } = useParams();

  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    { message: "Hello, I'm Kai!", sender: "ChatGPT" }
  ]);
  const [userPrompt, setUserPrompt] = useState("");
  const [rexReply, setRexReply] = useState("");
  const [sessions, setSessions] = useState([]);
  const [ThisSessions, setThisSessions] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get("/sessions");
        setSessions(response.data);
        const session = response.data.find(s => s.id === id);
        setThisSessions(session);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };
    fetchSessions();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      console.log("Scroll position", window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSend = async (message) => {
    const newMessage = { message: message, sender: "user", direction: "outgoing" };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);
    await processMessageToAI(newMessages);
  }

  async function processMessageToAI(chatMessages) {
    const apiMessages = chatMessages.map(msg => ({
      role: msg.sender === "ChatGPT" ? "assistant" : "user",
      content: msg.message,
    }));

    const systemMessage = {
      role: "system",
      content: "Explain like I am a student"
    };

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [systemMessage, ...apiMessages]
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setTyping(false);
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTimeout(async () => {
      await callOpenAIAPI();
      if (ThisSessions) {
        const updatedSession = {
          ...ThisSessions,
          chats: [...ThisSessions.chats, { user: userPrompt, ReX: rexReply }],
        };
        setThisSessions(updatedSession);
        try {
          const response = await axios.patch(`/sessions/${ThisSessions.id}`, updatedSession);
          setSessions(sessions.map(s => s.id === ThisSessions.id ? response.data : s));
        } catch (error) {
          console.error("Error updating session:", error);
        }
      }
      setUserPrompt("");
    }, 5000);
  };

  const callOpenAIAPI = async () => {
    try {
      const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Your name is Rex. You are a career advice assistant. You give advice to Andrew about his career" },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 100,
      }, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      });
      setRexReply(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
    }
  };

  return (
    <div className="App">
      <div style={{ position: "relative", height: "700px", width: "600px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior='smooth'
              typingIndicator={typing ? <TypingIndicator content="Kai is typing" /> : null}
            >
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
            <MessageInput placeholder='Type message here' onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="3"
          placeholder="Type your message here..."
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          className="chat-input"
        />
        <button type="submit" className="chat-submit">Send</button>
      </form>
    </div>
  );
}

export default App;
