"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Navbar from '../components/Navbar'

export default function LinkedInGrapevineChatbot() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Grapevine, your LinkedIn network assistant. How can I help you today?", sender: 'bot' }
  ])
  const [input, setInput] = useState('')
  const scrollAreaRef = useRef(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }])
      setInput('')
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "I'm processing your request to find connections in your LinkedIn network. How would you like to utilize these connections?", 
          sender: 'bot' 
        }])
      }, 1000)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/default-avatar-SzVgKCnoSdiungIomz8Pqku9pBwrGV.png" alt="Grapevine" />
                <AvatarFallback>GV</AvatarFallback>
              </Avatar>
           LinkedIn Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full pr-4" ref={scrollAreaRef}>
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 items-end`}>
                  {message.sender === 'bot' && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/default-avatar-SzVgKCnoSdiungIomz8Pqku9pBwrGV.png" alt="Grapevine" />
                      <AvatarFallback>GV</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-lg p-2 max-w-[80%] ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                    {message.text}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Input 
              placeholder="Type your message..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend}>Send</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}