import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Download, Edit, Eye, Trash2, FileText, Plus, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  title: string;
  type: 'resume' | 'cover-letter' | 'portfolio';
  lastModified: string;
  status: 'draft' | 'completed';
  downloadCount: number;
}

const Documents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [documents] = useState<Document[]>([
    {
      id: '1',
      title: 'Software Engineer Resume',
      type: 'resume',
      lastModified: '2 hours ago',
      status: 'completed',
      downloadCount: 5
    },
    {
      id: '2',
      title: 'Marketing Manager Cover Letter',
      type: 'cover-letter',
      lastModified: '1 day ago',
      status: 'completed',
      downloadCount: 2
    },
    {
      id: '3',
      title: 'Senior Developer Resume',
      type: 'resume',
      lastModified: '3 days ago',
      status: 'draft',
      downloadCount: 0
    },
    {
      id: '4',
      title: 'Product Manager Application',
      type: 'cover-letter',
      lastModified: '1 week ago',
      status: 'completed',
      downloadCount: 3
    },
    {
      id: '5',
      title: 'Creative Portfolio',
      type: 'portfolio',
      lastModified: '2 weeks ago',
      status: 'draft',
      downloadCount: 1
    }
  ]);

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDocuments = (type?: string) => {
    if (!type) return filteredDocuments;
    return filteredDocuments.filter(doc => doc.type === type);
  };

  const handleEdit = (doc: Document) => {
    if (doc.type === 'resume') {
      navigate('/resume-builder');
    } else if (doc.type === 'cover-letter') {
      navigate('/cover-letter-builder');
    } else {
      toast({
        title: "Portfolio Editor",
        description: "Portfolio editor will be available soon!",
      });
    }
  };

  const handleDownload = (doc: Document) => {
    toast({
      title: "Download Started",
      description: `Downloading ${doc.title}...`,
    });
  };

  const handlePreview = (doc: Document) => {
    toast({
      title: "Preview",
      description: `Opening preview for ${doc.title}...`,
    });
  };

  const handleDelete = (doc: Document) => {
    toast({
      title: "Document Deleted",
      description: `${doc.title} has been deleted.`,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'resume':
        return <FileText className="h-4 w-4" />;
      case 'cover-letter':
        return <FileText className="h-4 w-4" />;
      case 'portfolio':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'resume':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'cover-letter':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'portfolio':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const DocumentCard = ({ doc }: { doc: Document }) => (
    <Card className="bg-gradient-card shadow-elegant hover:shadow-xl transition-smooth group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon(doc.type)}
            <CardTitle className="text-lg">{doc.title}</CardTitle>
          </div>
          <Badge 
            variant={doc.status === 'completed' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {doc.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-xs ${getTypeColor(doc.type)}`}>
            {doc.type.replace('-', ' ')}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Modified {doc.lastModified}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Downloaded {doc.downloadCount} times
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
            <Button variant="outline" size="sm" onClick={() => handlePreview(doc)}>
              <Eye className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEdit(doc)}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDownload(doc)}>
              <Download className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDelete(doc)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Documents</h1>
              <p className="text-muted-foreground">Manage your resumes, cover letters, and portfolios</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/resume-builder')}>
              <Plus className="h-4 w-4 mr-2" />
              New Resume
            </Button>
            <Button variant="secondary" onClick={() => navigate('/cover-letter-builder')}>
              <Plus className="h-4 w-4 mr-2" />
              New Cover Letter
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="bg-gradient-card shadow-elegant mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Document Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({filteredDocuments.length})</TabsTrigger>
            <TabsTrigger value="resume">Resumes ({getDocuments('resume').length})</TabsTrigger>
            <TabsTrigger value="cover-letter">Cover Letters ({getDocuments('cover-letter').length})</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolios ({getDocuments('portfolio').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map(doc => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resume" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getDocuments('resume').map(doc => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cover-letter" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getDocuments('cover-letter').map(doc => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getDocuments('portfolio').map(doc => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
              {getDocuments('portfolio').length === 0 && (
                <div className="col-span-full text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No portfolios yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first portfolio to showcase your work</p>
                  <Button variant="hero">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Portfolio
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {filteredDocuments.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No documents found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;