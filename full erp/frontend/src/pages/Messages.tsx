import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Send, Inbox, Archive, Trash2, Search, Filter, Plus, Reply, Forward, Star, MoreVertical, User, Calendar, FileText, Eye, Edit, Download, Printer } from 'lucide-react';
import { useState, useMemo } from 'react';

const Messages = () => {
  const { user } = useAuth();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock messages data with more details
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'Dr. Smith',
      fromEmail: 'dr.smith@university.edu',
      to: user?.firstName || 'Student',
      toEmail: user?.email || 'student@university.edu',
      subject: 'Assignment Submission Reminder',
      content: 'Dear Student,\n\nPlease remember to submit your CS101 Programming Assignment 1 by Friday, December 20th at 11:59 PM. Late submissions will not be accepted.\n\nYour assignment should include:\n- Complete source code\n- Documentation\n- Test cases\n- README file\n\nIf you have any questions, please don\'t hesitate to reach out during office hours.\n\nBest regards,\nDr. Smith\nComputer Science Department',
      date: '2024-12-15T10:30:00Z',
      status: 'unread',
      type: 'academic',
      priority: 'high',
      attachments: [],
      isStarred: false,
      isArchived: false
    },
    {
      id: 2,
      from: 'Academic Office',
      fromEmail: 'academic@university.edu',
      to: user?.firstName || 'Student',
      toEmail: user?.email || 'student@university.edu',
      subject: 'Registration for Spring Semester',
      content: 'Dear Student,\n\nRegistration for the Spring 2025 semester is now open. Please complete your course selection by December 20th.\n\nImportant dates:\n- Course registration: Dec 15-20\n- Payment deadline: Jan 5\n- Classes begin: Jan 15\n\nYou can register through the student portal or visit the academic office for assistance.\n\nRegards,\nAcademic Office',
      date: '2024-12-14T14:15:00Z',
      status: 'read',
      type: 'administrative',
      priority: 'medium',
      attachments: [
        { name: 'Spring_2025_Course_Catalog.pdf', size: '2.5 MB', type: 'pdf' }
      ],
      isStarred: true,
      isArchived: false
    },
    {
      id: 3,
      from: 'Library Services',
      fromEmail: 'library@university.edu',
      to: user?.firstName || 'Student',
      toEmail: user?.email || 'student@university.edu',
      subject: 'Book Return Reminder',
      content: 'Dear Student,\n\nYou have the following books due for return on December 18th:\n\n1. "Introduction to Algorithms" by Cormen\n2. "Database Systems" by Silberschatz\n\nPlease return them to the library to avoid late fees. You can also renew them online if needed.\n\nThank you,\nLibrary Services',
      date: '2024-12-13T09:45:00Z',
      status: 'read',
      type: 'service',
      priority: 'low',
      attachments: [],
      isStarred: false,
      isArchived: false
    },
    {
      id: 4,
      from: 'Student Council',
      fromEmail: 'council@university.edu',
      to: user?.firstName || 'Student',
      toEmail: user?.email || 'student@university.edu',
      subject: 'Winter Break Activities',
      content: 'Hello Students!\n\nJoin us for exciting winter break activities:\n\n- Movie Night: Dec 22\n- Winter Sports Day: Dec 23\n- New Year Party: Dec 31\n\nAll activities are free for registered students. Sign up at the student center.\n\nHappy Holidays!\nStudent Council',
      date: '2024-12-12T16:20:00Z',
      status: 'unread',
      type: 'social',
      priority: 'low',
      attachments: [
        { name: 'Winter_Activities_Schedule.pdf', size: '1.2 MB', type: 'pdf' }
      ],
      isStarred: false,
      isArchived: false
    },
    {
      id: 5,
      from: 'IT Support',
      fromEmail: 'support@university.edu',
      to: user?.firstName || 'Student',
      toEmail: user?.email || 'student@university.edu',
      subject: 'Password Reset Confirmation',
      content: 'Dear Student,\n\nYour password has been successfully reset. If you did not request this change, please contact IT support immediately.\n\nFor security reasons, please change your password after logging in.\n\nBest regards,\nIT Support Team',
      date: '2024-12-11T11:30:00Z',
      status: 'read',
      type: 'service',
      priority: 'high',
      attachments: [],
      isStarred: false,
      isArchived: true
    }
  ]);

  // Compose message state
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    content: '',
    priority: 'medium',
    type: 'academic'
  });

  // Filtered messages
  const filteredMessages = useMemo(() => {
    let filtered = messages.filter(message => {
      // Tab filtering
      if (activeTab === 'inbox' && message.isArchived) return false;
      if (activeTab === 'archived' && !message.isArchived) return false;
      if (activeTab === 'starred' && !message.isStarred) return false;
      
      // Search filtering
      if (searchTerm && !message.subject.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !message.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !message.from.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Type filtering
      if (filterType !== 'all' && message.type !== filterType) return false;
      
      // Status filtering
      if (filterStatus !== 'all' && message.status !== filterStatus) return false;
      
      return true;
    });

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [messages, activeTab, searchTerm, filterType, filterStatus]);

  const getStatusColor = (status: string) => {
    return status === 'unread' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic':
        return 'bg-purple-100 text-purple-800';
      case 'administrative':
        return 'bg-orange-100 text-orange-800';
      case 'service':
        return 'bg-green-100 text-green-800';
      case 'social':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const unreadCount = messages.filter(msg => msg.status === 'unread' && !msg.isArchived).length;
  const archivedCount = messages.filter(msg => msg.isArchived).length;
  const starredCount = messages.filter(msg => msg.isStarred).length;

  const markAsRead = (messageId: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'read' } : msg
    ));
  };

  const toggleStar = (messageId: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ));
  };

  const toggleArchive = (messageId: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isArchived: !msg.isArchived } : msg
    ));
  };

  const deleteMessage = (messageId: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const sendMessage = () => {
    const newMessage = {
      id: Date.now(),
      from: `${user?.firstName} ${user?.lastName}`,
      fromEmail: user?.email || '',
      to: composeData.to,
      toEmail: composeData.to,
      subject: composeData.subject,
      content: composeData.content,
      date: new Date().toISOString(),
      status: 'read',
      type: composeData.type,
      priority: composeData.priority,
      attachments: [],
      isStarred: false,
      isArchived: false
    };

    setMessages(prev => [newMessage, ...prev]);
    setComposeData({ to: '', subject: '', content: '', priority: 'medium', type: 'academic' });
    setComposeOpen(false);
  };

  const replyToMessage = (originalMessage: any) => {
    setComposeData({
      to: originalMessage.fromEmail,
      subject: `Re: ${originalMessage.subject}`,
      content: `\n\n--- Original Message ---\nFrom: ${originalMessage.from}\nDate: ${new Date(originalMessage.date).toLocaleString()}\n\n${originalMessage.content}`,
      priority: 'medium',
      type: 'academic'
    });
    setComposeOpen(true);
  };

  const exportMessages = () => {
    const csvContent = [
      ['From', 'Subject', 'Date', 'Status', 'Type', 'Content'],
      ...filteredMessages.map(message => [
        message.from,
        message.subject,
        new Date(message.date).toLocaleDateString(),
        message.status,
        message.type,
        message.content.replace(/\n/g, ' ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `messages-${activeTab}-${user?.firstName}-${user?.lastName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Enhanced Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
            <MessageSquare className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Messages
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome back, {user?.firstName}! Here are your latest communications.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="administrative">Administrative</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="social">Social</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setComposeOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Compose
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Inbox
            {unreadCount > 0 && <Badge variant="secondary" className="ml-1">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="starred" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Starred
            {starredCount > 0 && <Badge variant="secondary" className="ml-1">{starredCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Archived
            {archivedCount > 0 && <Badge variant="secondary" className="ml-1">{archivedCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Sent
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Message Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Inbox className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{filteredMessages.length}</p>
                    <p className="text-sm text-muted-foreground">Total Messages</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{unreadCount}</p>
                    <p className="text-sm text-muted-foreground">Unread</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Star className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{starredCount}</p>
                    <p className="text-sm text-muted-foreground">Starred</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Archive className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{archivedCount}</p>
                    <p className="text-sm text-muted-foreground">Archived</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Messages List */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="capitalize">{activeTab}</CardTitle>
                  <CardDescription>
                    {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={exportMessages}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <div key={message.id} className={`flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors ${message.status === 'unread' ? 'bg-blue-50 border-blue-200' : ''}`}>
                    <div className="flex-1 cursor-pointer" onClick={() => {
                      setSelectedMessage(message);
                      if (message.status === 'unread') markAsRead(message.id);
                    }}>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{message.subject}</h3>
                        <Badge className={getStatusColor(message.status)}>
                          {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                        </Badge>
                        <Badge className={getTypeColor(message.type)}>
                          {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                        </Badge>
                        <Badge className={getPriorityColor(message.priority)}>
                          {message.priority.charAt(0).toUpperCase() + message.priority.slice(1)}
                        </Badge>
                        {message.attachments.length > 0 && (
                          <Badge variant="outline">
                            <FileText className="h-3 w-3 mr-1" />
                            {message.attachments.length}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        From: {message.from} • To: {message.to}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {message.content.length > 150 ? `${message.content.substring(0, 150)}...` : message.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(message.date).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => replyToMessage(message)}
                      >
                        <Reply className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleStar(message.id)}
                      >
                        <Star className={`h-4 w-4 ${message.isStarred ? 'fill-yellow-400 text-yellow-600' : ''}`} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleArchive(message.id)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteMessage(message.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* No Messages State */}
          {filteredMessages.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Messages</h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === 'inbox' ? 'You don\'t have any messages in your inbox.' :
                   activeTab === 'starred' ? 'You don\'t have any starred messages.' :
                   activeTab === 'archived' ? 'You don\'t have any archived messages.' :
                   'You haven\'t sent any messages yet.'}
                </p>
                {activeTab === 'inbox' && (
                  <Button onClick={() => setComposeOpen(true)}>Compose Message</Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Message Details Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {selectedMessage?.subject}
            </DialogTitle>
            <DialogDescription>
              From: {selectedMessage?.from} • Date: {selectedMessage && new Date(selectedMessage.date).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{selectedMessage.subject}</h3>
                    <p className="text-sm text-muted-foreground">
                      From: {selectedMessage.from} ({selectedMessage.fromEmail})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      To: {selectedMessage.to} ({selectedMessage.toEmail})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date(selectedMessage.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getTypeColor(selectedMessage.type)}>
                      {selectedMessage.type}
                    </Badge>
                    <Badge className={getPriorityColor(selectedMessage.priority)}>
                      {selectedMessage.priority}
                    </Badge>
                  </div>
                </div>
                
                {selectedMessage.attachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Attachments:</h4>
                    <div className="space-y-2">
                      {selectedMessage.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{attachment.name}</span>
                          <span className="text-xs text-muted-foreground">({attachment.size})</span>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="whitespace-pre-wrap text-sm">
                  {selectedMessage.content}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => replyToMessage(selectedMessage)}>
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
                <Button variant="outline">
                  <Forward className="h-4 w-4 mr-2" />
                  Forward
                </Button>
                <Button variant="outline" onClick={() => toggleStar(selectedMessage.id)}>
                  <Star className={`h-4 w-4 mr-2 ${selectedMessage.isStarred ? 'fill-yellow-400 text-yellow-600' : ''}`} />
                  {selectedMessage.isStarred ? 'Unstar' : 'Star'}
                </Button>
                <Button variant="outline" onClick={() => toggleArchive(selectedMessage.id)}>
                  <Archive className="h-4 w-4 mr-2" />
                  {selectedMessage.isArchived ? 'Unarchive' : 'Archive'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Compose Message Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Compose Message
            </DialogTitle>
            <DialogDescription>
              Send a new message to faculty, staff, or other students
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="to">To:</Label>
              <Input
                id="to"
                placeholder="recipient@university.edu"
                value={composeData.to}
                onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="subject">Subject:</Label>
              <Input
                id="subject"
                placeholder="Message subject"
                value={composeData.subject}
                onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type:</Label>
                <Select value={composeData.type} onValueChange={(value) => setComposeData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority:</Label>
                <Select value={composeData.priority} onValueChange={(value) => setComposeData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="content">Message:</Label>
              <Textarea
                id="content"
                placeholder="Type your message here..."
                value={composeData.content}
                onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))}
                rows={8}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={sendMessage} disabled={!composeData.to || !composeData.subject || !composeData.content}>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" onClick={() => setComposeOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages; 