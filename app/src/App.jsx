import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-react-styles/dist/default/styles.min.css'
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from "@chatscope/chat-ui-kit-react"

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Kai!",
      sender: "Kai"
    }
  ])

  const handleSend = async (message) => {
    const NewMessage = {
      message: message,
      sender: "user"
    }

  return (
      <div className="App">
        <div style={{position: "relative", height: "800px", width: "700px"}}>
          <MainContainer>
            <ChatContainer>
              <MessageList>
                {messages.map((messages,i) => {
                  return <Message ket={i} model={message}/>
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
