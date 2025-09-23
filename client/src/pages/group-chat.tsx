import { GroupChatLayout } from "@/components/group-chat/GroupChatLayout";

export default function GroupChat() {
  return (
    <>
      {/* SEO Meta Tags */}
      <title>EduVerse Group Chat - Collaborate & Learn Together</title>
      <meta name="description" content="Connect with classmates and teachers in EduVerse's interactive group chat. Share ideas, collaborate on projects, and learn together in real-time." />
      
      <div className="pt-20 h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Green/Emerald Theme Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white py-6 mb-4 shadow-lg" data-testid="group-chat-header">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
              <span className="text-4xl animate-bounce">💬</span>
              EduVerse Group Chat
            </h1>
            <p className="text-emerald-100 max-w-2xl mx-auto">
              Connect, collaborate, and learn together in real-time group conversations
            </p>
          </div>
        </div>
        
        <GroupChatLayout />
      </div>
    </>
  );
}