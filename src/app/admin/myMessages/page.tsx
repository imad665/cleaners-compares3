'use client'
import { useEffect, useState } from 'react';
import { Mail, MessageSquare, Clock, User, Trash2, Reply, Star, ChevronLeft, ChevronRight, ArchiveIcon } from 'lucide-react';
import Badge from '@/components/adminDashboard/shared/Badge';
import Button from '@/components/adminDashboard/shared/Button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';


interface Message {
  id: number;
  from: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  time: string;
  read: boolean;
  type: 'inquiry' | 'contact' | 'product';
  productId?: number;
  productName?: string;
  starred: boolean;
}

const Messages = () => {
  // Mock messages data
  const messagesData: Message[] = [
    {
      id: 1,
      from: 'John Smith',
      email: 'john.smith@example.com',
      subject: 'Washing Machine Inquiry',
      message: 'Hello, I am interested in purchasing the Industrial Washing Machine 50kg. Do you offer installation services with this purchase? Also, what is the warranty period for this machine? Thank you.',
      date: '2023-05-18',
      time: '14:35',
      read: false,
      type: 'product',
      productId: 1,
      productName: 'Industrial Washing Machine 50kg',
      starred: false,
    },
    {
      id: 2,
      from: 'Sarah Wilson',
      email: 'sarah.w@example.com',
      subject: 'Bulk Order Inquiry',
      message: 'Hi there, I run a chain of laundromats and am looking to place a bulk order for both washing machines and dryers. Can you provide bulk pricing for an order of 10 machines? Looking forward to your response.',
      date: '2023-05-17',
      time: '10:22',
      read: true,
      type: 'inquiry',
      starred: true,
    },
    {
      id: 3,
      from: 'David Moore',
      email: 'david.m@example.com',
      subject: 'Replacement Parts Availability',
      message: 'Hello, I purchased a Commercial Dryer from your site last year and now need some replacement parts. Specifically looking for the drive belt and heating element. Are these parts in stock and how quickly can they be shipped? Thank you.',
      date: '2023-05-16',
      time: '16:48',
      read: true,
      type: 'product',
      productId: 4,
      productName: 'Commercial Dryer',
      starred: false,
    },
    {
      id: 4,
      from: 'Emma Johnson',
      email: 'emma.j@example.com',
      subject: 'Technical Support Needed',
      message: 'I recently purchased a dry cleaning machine from your site and am having trouble with the programming. Is there a technical support line I can call or documentation you can provide? This is rather urgent as it is affecting our business operations.',
      date: '2023-05-15',
      time: '09:15',
      read: true,
      type: 'inquiry',
      starred: false,
    },
    {
      id: 5,
      from: 'Robert Taylor',
      email: 'robert.t@example.com',
      subject: 'Website Feedback',
      message: 'I wanted to provide some feedback on your website. The product listings are very comprehensive, but I think the filtering options could be improved to make it easier to find specific types of equipment. Otherwise, great job on the marketplace!',
      date: '2023-05-14',
      time: '11:30',
      read: true,
      type: 'contact',
      starred: false,
    },
    {
      id: 6,
      from: 'Lisa Brown',
      email: 'lisa.b@example.com',
      subject: 'Question about Chemical Products',
      message: 'Hello, I see you offer various cleaning chemicals. Do you have detailed safety data sheets available for these products? Also, do you ship these products internationally? I am based in Canada. Thanks!',
      date: '2023-05-13',
      time: '15:20',
      read: false,
      type: 'inquiry',
      starred: false,
    },
  ];

  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'starred'>('all');
  const [filter, setFilter] = useState<string>('all');

  // Filter messages based on active tab and type filter
  const filteredMessages = messages.filter(message => {
    // First filter by tab
    if (activeTab === 'unread' && message.read) return false;
    if (activeTab === 'starred' && !message.starred) return false;

    // Then filter by message type
    if (filter !== 'all' && message.type !== filter) return false;

    return true;
  });

  useEffect(() => {
    const fetchMyMessages = async () => {
      try {
        const res = await fetch('/api/admin/contactus');
        if (!res.ok) {
          toast.error('failed to fetch messages!');
          return
        }
        const { messages } = await res.json();
        //console.log(messages, '##################');
        setMessages(messages)
      } catch (error) {

      } finally {

      }
    }
    fetchMyMessages();

  }, []);

  useEffect(() => {
    //console.log('updated,;;;;;;;;;;;;;;', messages);

  },
    [messages])

  async function updateMessagePost(message) {
    try {
      const res = await fetch('/api/admin/contactus', {
        method: 'PATCH',
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({ message })
      })
      if (!res.ok) {
        return;
      }
    } catch (error) {

    }
  }

  // Mark message as read
  const markAsRead = (messageId: number) => {
    const message = messages.find((msg) => msg.id === messageId);
    const updatedMessage = { ...message, read: true };
    setMessages(messages.map(message =>
      message.id === messageId
        ? { ...message, read: true }
        : message
    ));
    if (message && !message.read)
      updateMessagePost(updatedMessage)


  };

  // Toggle star status
  const toggleStar = (messageId: number) => {
    const message = messages.find((msg) => msg.id === messageId);
    const updatedMessage = { ...message, starred: !message?.starred };
    setMessages(messages.map(message =>
      message.id === messageId
        ? { ...message, starred: !message.starred }
        : message
    ));
    if (updatedMessage)
      updateMessagePost(updatedMessage)
  };

  // View message detail
  const viewMessage = (message: Message) => {
    setSelectedMessage(message);
    markAsRead(message.id);

  };

  // Handle replying to message
  const handleReply = () => {
    if (replyText.trim() === '' || !selectedMessage) return;

    console.log('Replying to:', selectedMessage);
    console.log('Reply:', replyText);
    setMessages(messages.map(message =>
      message.id === selectedMessage.id
        ? { ...message, response: replyText }
        : message
    ));
    selectedMessage.response = replyText;
    updateMessagePost(selectedMessage);
    // Here you would normally send the reply via API
    // For demo purposes, we'll just show an alert
    //alert('Reply sent!');


    setReplyText('');
    // Optionally close the message view or show a success message
  };

  // Delete message
  const deleteMessage = async (messageId: number) => {
    if (confirm('Are you sure you want to delete this message?')) {

      try {
        const res = await fetch('/api/admin/contactus', {
          method: "DELETE",
          headers: {
            'Content-Type': "application/json"
          },
          body: JSON.stringify({ id: messageId })
        })
        if (res.ok) {
          setMessages(messages.filter(message => message.id !== messageId));
          if (selectedMessage && selectedMessage.id === messageId) {
            setSelectedMessage(null);
          }
          toast.success('inquiry deleted successfuly!')
          return;
        }
        toast.error('failed to delete inquiry!')

      }
      catch (error) {
        toast.error('somthing went wrong')
      }
    }
  };

  // Archive message (for demo purposes, we'll just remove it from the list)
  const archiveMessage = (messageId: number) => {
    setMessages(messages.filter(message => message.id !== messageId));
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage(null);
    }
  };

  // Get badge color based on message type
  const getMessageTypeBadge = (type: string) => {
    switch (type) {
      case 'inquiry':
        return <Badge variant="primary">Inquiry</Badge>;
      case 'contact':
        return <Badge variant="info">Contact</Badge>;
      case 'product':
        return <Badge variant="success">Product</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and respond to inquiries from users and potential customers.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden h-[calc(100vh-200px)]">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className={`w-full md:w-1/3 xl:w-1/4 border-r border-gray-200 ${selectedMessage ? 'hidden md:block' : ''}`}>
            {/* Message Filters & Tabs */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Inbox</h2>
                {/* <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block p-1 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                > 
                  <option value="all">All Types</option>
                  <option value="inquiry">Inquiries</option>
                  <option value="contact">Contact</option>
                  <option value="product">Product</option>
                </select> */}
              </div>
              <div className="flex space-x-1 border-b border-gray-200">
                <button
                  className={`px-3 py-2 text-sm font-medium ${activeTab === 'all'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveTab('all')}
                >
                  All
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium ${activeTab === 'unread'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveTab('unread')}
                >
                  Unread
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium ${activeTab === 'starred'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveTab('starred')}
                >
                  Starred
                </button>
              </div>
            </div>

            {/* Messages List */}
            <div className="overflow-y-auto" style={{ height: 'calc(100% - 105px)' }}>
              {filteredMessages.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredMessages.map((message) => (
                    <li
                      key={message.id}
                      className={`hover:bg-gray-50 cursor-pointer ${selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                        } ${!message.read ? 'bg-blue-50' : ''}`}
                      onClick={() => viewMessage(message)}
                    >
                      <div className="px-4 py-3 sm:px-6">
                        <div className="flex justify-between">
                          <h3 className={`text-sm font-medium ${!message.read ? 'text-blue-600' : 'text-gray-900'}`}>
                            {message.from}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <button
                              className={`p-1 ${message.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStar(message.id);
                              }}
                            >
                              <Star size={16} className={message.starred ? 'fill-yellow-500' : ''} />
                            </button>
                            <span className="text-xs text-gray-500">
                              {message.date}
                            </span>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {message.subject}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {message.message.substring(0, 60)}...
                          </p>
                          {getMessageTypeBadge(message.type)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <MessageSquare size={48} className="text-gray-300 mb-2" />
                  <p className="text-gray-500">No messages found</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try changing your filters to see more messages
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Message Detail View */}
          {selectedMessage ? (
            <div className="w-full md:w-2/3 xl:w-3/4 flex flex-col h-full">
              {/* Message Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      className="md:hidden mr-4 p-1 rounded-full hover:bg-gray-100"
                      onClick={() => setSelectedMessage(null)}
                    >
                      <ChevronLeft size={20} className="text-gray-500" />
                    </button>
                    <h2 className="text-lg font-medium text-gray-900">{selectedMessage.subject}</h2>
                  </div>
                  <div className="flex space-x-2">
                    {/* <button
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                      onClick={() => archiveMessage(selectedMessage.id)}
                      title="Archive"
                    >
                      <ArchiveIcon size={18} />
                    </button> */}
                    <button
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                      onClick={() => deleteMessage(selectedMessage.id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  {getMessageTypeBadge(selectedMessage.type)}
                  {selectedMessage.type === 'product' && (
                    <span className="ml-2">
                      Re: {selectedMessage.productName}
                    </span>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3">
                        {selectedMessage.from.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedMessage.from}</p>
                        <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock size={14} className="mr-1" />
                      {selectedMessage.date} at {selectedMessage.time}
                    </div>
                  </div>

                  <div className="mt-4 prose prose-sm max-w-none text-gray-700">
                    <p>{selectedMessage.message}</p>

                  </div>

                </div>
                {selectedMessage.response && <div className="bg-green-0 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-blue-600 font-medium mr-3">
                        {selectedMessage.from.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">You</p>

                      </div>
                    </div>

                  </div>

                  <div className="mt-4 prose prose-sm max-w-none text-gray-700">
                    <p>{selectedMessage.response}</p>

                  </div>

                </div>}
              </div>

              {/* Reply Form */}
              {!selectedMessage.response && <div className="px-6 py-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Reply</h3>
                <div className="mb-4">
                  <Textarea
                    rows={4}
                    placeholder="Type your reply here..."
                    className="block p-2 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    icon={<Reply size={16} />}
                    onClick={handleReply}
                    disabled={replyText.trim() === ''}
                  >
                    Send Reply
                  </Button>
                </div>
              </div>}
            </div>
          ) : (
            <div className="hidden md:flex md:w-2/3 xl:w-3/4 items-center justify-center bg-gray-50">
              <div className="text-center">
                <Mail size={48} className="mx-auto text-gray-300" />
                <h2 className="mt-2 text-xl font-medium text-gray-900">Select a message</h2>
                <p className="mt-1 text-gray-500">
                  Choose a message from the list to view its contents
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='w-[100vw] h-30'> </div>
    </div>
  );
};

export default Messages;