import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, DollarSign, AlertCircle, CheckCircle, Printer, Download, Eye, Calendar, User, Receipt, Lock, Shield, Clock } from 'lucide-react';
import { useState } from 'react';

const Fees = () => {
  const { user } = useAuth();
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock fees data with more details
  const [fees, setFees] = useState([
    {
      id: 1,
      feeType: 'Tuition',
      amount: 5000,
      paidAmount: 5000,
      dueDate: '2024-12-31',
      status: 'paid',
      description: 'Fall 2024 Semester Tuition',
      paymentMethod: 'online',
      transactionId: 'TXN123456',
      paymentDate: '2024-11-15',
      receiptNumber: 'RCP001234'
    },
    {
      id: 2,
      feeType: 'Library',
      amount: 150,
      paidAmount: 0,
      dueDate: '2024-12-20',
      status: 'pending',
      description: 'Library Services Fee',
      paymentMethod: null,
      transactionId: null,
      paymentDate: null,
      receiptNumber: null
    },
    {
      id: 3,
      feeType: 'Laboratory',
      amount: 300,
      paidAmount: 300,
      dueDate: '2024-11-15',
      status: 'paid',
      description: 'Computer Science Lab Fee',
      paymentMethod: 'card',
      transactionId: 'TXN789012',
      paymentDate: '2024-11-10',
      receiptNumber: 'RCP007890'
    },
    {
      id: 4,
      feeType: 'Student Activity',
      amount: 75,
      paidAmount: 0,
      dueDate: '2024-12-10',
      status: 'overdue',
      description: 'Student Activities and Events Fee',
      paymentMethod: null,
      transactionId: null,
      paymentDate: null,
      receiptNumber: null
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalPaid = fees.reduce((sum, fee) => sum + fee.paidAmount, 0);
  const totalPending = totalAmount - totalPaid;
  const overdueFees = fees.filter(fee => new Date(fee.dueDate) < new Date() && fee.status !== 'paid');

  const handlePayment = async (fee) => {
    setSelectedFee(fee);
    setCardholderName(`${user?.firstName} ${user?.lastName}`);
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const transactionId = `TXN${Date.now()}`;
    const receiptNumber = `RCP${Date.now()}`;
    
    // Update fee status
    const updatedFees = fees.map(fee => 
      fee.id === selectedFee.id 
        ? { 
            ...fee, 
            status: 'paid', 
            paidAmount: fee.amount,
            paymentMethod: paymentMethod,
            transactionId: transactionId,
            paymentDate: new Date().toISOString().split('T')[0],
            receiptNumber: receiptNumber
          }
        : fee
    );
    
    setFees(updatedFees);
    
    // Generate receipt
    const receipt = {
      receiptNumber: receiptNumber,
      transactionId: transactionId,
      studentName: `${user?.firstName} ${user?.lastName}`,
      studentId: user?.studentId,
      feeType: selectedFee.feeType,
      amount: selectedFee.amount,
      paymentMethod: paymentMethod,
      paymentDate: new Date().toISOString(),
      description: selectedFee.description,
      status: 'Completed'
    };
    
    setPaymentReceipt(receipt);
    setShowReceipt(true);
    setIsProcessing(false);
  };

  const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Payment Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
            .receipt { border: 1px solid #ccc; padding: 20px; margin: 20px 0; }
            .row { display: flex; justify-content: space-between; margin: 10px 0; }
            .total { font-weight: bold; font-size: 18px; border-top: 1px solid #ccc; padding-top: 10px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>UNIVERSITY ERP SYSTEM</h1>
            <h2>Payment Receipt</h2>
          </div>
          <div class="receipt">
            <div class="row">
              <strong>Receipt Number:</strong> ${paymentReceipt.receiptNumber}
            </div>
            <div class="row">
              <strong>Transaction ID:</strong> ${paymentReceipt.transactionId}
            </div>
            <div class="row">
              <strong>Date:</strong> ${new Date(paymentReceipt.paymentDate).toLocaleDateString()}
            </div>
            <div class="row">
              <strong>Student Name:</strong> ${paymentReceipt.studentName}
            </div>
            <div class="row">
              <strong>Student ID:</strong> ${paymentReceipt.studentId}
            </div>
            <div class="row">
              <strong>Fee Type:</strong> ${paymentReceipt.feeType}
            </div>
            <div class="row">
              <strong>Description:</strong> ${paymentReceipt.description}
            </div>
            <div class="row">
              <strong>Payment Method:</strong> ${paymentReceipt.paymentMethod}
            </div>
            <div class="row total">
              <strong>Amount Paid:</strong> $${paymentReceipt.amount.toLocaleString()}
            </div>
            <div class="row">
              <strong>Status:</strong> ${paymentReceipt.status}
            </div>
          </div>
          <div class="footer">
            <p>Thank you for your payment!</p>
            <p>This is an official receipt from the University ERP System.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const downloadReceipt = () => {
    const receiptText = `
UNIVERSITY ERP SYSTEM - PAYMENT RECEIPT

Receipt Number: ${paymentReceipt.receiptNumber}
Transaction ID: ${paymentReceipt.transactionId}
Date: ${new Date(paymentReceipt.paymentDate).toLocaleDateString()}

Student Information:
Name: ${paymentReceipt.studentName}
Student ID: ${paymentReceipt.studentId}

Payment Details:
Fee Type: ${paymentReceipt.feeType}
Description: ${paymentReceipt.description}
Amount: $${paymentReceipt.amount.toLocaleString()}
Payment Method: ${paymentReceipt.paymentMethod}
Status: ${paymentReceipt.status}

Thank you for your payment!
    `;
    
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${paymentReceipt.receiptNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <CreditCard className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Fee Management</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.firstName}! Here's your fee status and payment information.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Fee Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">${totalAmount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Fees</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">${totalPaid.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Paid</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">${totalPending.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{overdueFees.length}</p>
                    <p className="text-sm text-muted-foreground">Overdue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overdue Alerts */}
          {overdueFees.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Overdue Fees
                </CardTitle>
                <CardDescription className="text-red-700">
                  You have {overdueFees.length} overdue fee(s). Please pay them immediately to avoid penalties.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {overdueFees.map((fee) => (
                    <div key={fee.id} className="flex justify-between items-center p-3 bg-red-100 rounded-lg">
                      <div>
                        <p className="font-medium">{fee.feeType}</p>
                        <p className="text-sm text-red-700">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-800">${fee.amount}</p>
                        <Button size="sm" className="mt-1" onClick={() => handlePayment(fee)}>
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fees List */}
          <Card>
            <CardHeader>
              <CardTitle>Fee Details</CardTitle>
              <CardDescription>Complete breakdown of your fees and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fees.map((fee) => (
                  <div key={fee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{fee.feeType}</h3>
                        <Badge className={getStatusColor(fee.status)}>
                          {getStatusIcon(fee.status)}
                          {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {fee.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(fee.dueDate).toLocaleDateString()}
                        {fee.paymentMethod && ` • Paid via ${fee.paymentMethod}`}
                        {fee.receiptNumber && ` • Receipt: ${fee.receiptNumber}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        ${fee.paidAmount.toLocaleString()}/{fee.amount.toLocaleString()}
                      </p>
                      <div className="flex gap-2 mt-1">
                        {fee.status === 'pending' && (
                          <Button size="sm" onClick={() => handlePayment(fee)}>
                            Pay Now
                          </Button>
                        )}
                        {fee.status === 'paid' && fee.receiptNumber && (
                          <Button size="sm" variant="outline" onClick={() => {
                            setPaymentReceipt({
                              receiptNumber: fee.receiptNumber,
                              transactionId: fee.transactionId,
                              studentName: `${user?.firstName} ${user?.lastName}`,
                              studentId: user?.studentId,
                              feeType: fee.feeType,
                              amount: fee.amount,
                              paymentMethod: fee.paymentMethod,
                              paymentDate: fee.paymentDate,
                              description: fee.description,
                              status: 'Completed'
                            });
                            setShowReceipt(true);
                          }}>
                            <Receipt className="h-4 w-4 mr-1" />
                            Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
              <CardDescription>Pay your pending fees securely</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fees.filter(fee => fee.status !== 'paid').map((fee) => (
                  <div key={fee.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-semibold">{fee.feeType}</h3>
                        <p className="text-sm text-muted-foreground">{fee.description}</p>
                        <p className="text-sm text-muted-foreground">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${fee.amount}</p>
                        <Button onClick={() => handlePayment(fee)}>
                          Pay ${fee.amount}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {fees.filter(fee => fee.status !== 'paid').length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">All Fees Paid!</h3>
                    <p className="text-muted-foreground">You have no pending payments.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your complete payment transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fees.filter(fee => fee.status === 'paid').map((fee) => (
                  <div key={fee.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{fee.feeType}</h3>
                        <p className="text-sm text-muted-foreground">{fee.description}</p>
                        <p className="text-sm text-muted-foreground">
                          Paid on: {new Date(fee.paymentDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Transaction: {fee.transactionId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">${fee.amount}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" onClick={() => {
                            setPaymentReceipt({
                              receiptNumber: fee.receiptNumber,
                              transactionId: fee.transactionId,
                              studentName: `${user?.firstName} ${user?.lastName}`,
                              studentId: user?.studentId,
                              feeType: fee.feeType,
                              amount: fee.amount,
                              paymentMethod: fee.paymentMethod,
                              paymentDate: fee.paymentDate,
                              description: fee.description,
                              status: 'Completed'
                            });
                            setShowReceipt(true);
                          }}>
                            <Eye className="h-4 w-4 mr-1" />
                            View Receipt
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {fees.filter(fee => fee.status === 'paid').length === 0 && (
                  <div className="text-center py-8">
                    <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Payment History</h3>
                    <p className="text-muted-foreground">You haven't made any payments yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Your saved payment methods for quick transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Credit Card</h4>
                    <Badge variant="outline">Default</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">**** **** **** 1234</p>
                  <p className="text-sm text-muted-foreground">Expires: 12/25</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Remove</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Bank Transfer</h4>
                    <Button variant="outline" size="sm">Add New</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">No bank account added</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      <Dialog open={!!selectedFee} onOpenChange={() => setSelectedFee(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>
              Pay ${selectedFee?.amount} for {selectedFee?.feeType}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="wallet">Digital Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <Label>Card Number</Label>
                  <Input 
                    placeholder="1234 5678 9012 3456" 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Expiry Date</Label>
                    <Input 
                      placeholder="MM/YY" 
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>CVV</Label>
                    <Input 
                      placeholder="123" 
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Cardholder Name</Label>
                  <Input 
                    placeholder="John Doe" 
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={processPayment} 
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? 'Processing...' : `Pay $${selectedFee?.amount}`}
              </Button>
              <Button variant="outline" onClick={() => setSelectedFee(null)}>
                Cancel
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Your payment is secure and encrypted</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Payment Receipt
            </DialogTitle>
            <DialogDescription>
              Your payment has been processed successfully
            </DialogDescription>
          </DialogHeader>
          {paymentReceipt && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-green-50">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">Payment Successful!</span>
                </div>
                <p className="text-sm text-green-700">
                  Receipt Number: {paymentReceipt.receiptNumber}
                </p>
                <p className="text-sm text-green-700">
                  Transaction ID: {paymentReceipt.transactionId}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Student:</span>
                  <span>{paymentReceipt.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fee Type:</span>
                  <span>{paymentReceipt.feeType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-semibold">${paymentReceipt.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date(paymentReceipt.paymentDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={printReceipt} className="flex-1">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Receipt
                </Button>
                <Button onClick={downloadReceipt} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Fees; 