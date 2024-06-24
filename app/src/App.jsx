import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from "@chatscope/chat-ui-kit-react"

const API_KEY = "sk-proj-yNe10q6dguHOwEWA55jaT3BlbkFJHtjlLXmTleX4ncOAfPDD";

function App() {
  const [typing, setTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Kai!",
      sender: "ChatGPT"
    }
  ])

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setTyping(true);

    await processMessageToAI(newMessages);
  }

  async function processMessageToAI(chatMessages){
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if(messageObject.sender === "ChatGPT"){
        role = "assistant"
      }
      else{
        role = "user"
      }
      return {role : role, content: messageObject.message}
    });

    // how it talks (content)
    const systemMessage = {
      role: "system",
      content: "Explain like I am a student"
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://ai.openai.com/v1/chat/completions",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${API_KEY}"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      // console.log(data);
      // console.log(data.choices[0].message.content);
      setMessages(
        [...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT"
        }]
      );
      setTyping(false);
    }); 
  }

  return (
      <div className="App">
        <div style={{position: "relative", height: "700px", width: "600px"}}>
          <MainContainer>
            <ChatContainer>
              <MessageList
                scrollBehavior = 'smooth'
                typingIndicator = {typing ? <TypingIndicator content="Kai is typing" /> : null}
              >
                {messages.map((message,i) => {
                  return <Message key={i} model={message}/>
                })}
              </MessageList>
              <MessageInput placeholder='Type message here' onSend={handleSend}/>
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
  )
}

export default App
