
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const OrderSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">Thank you for your purchase. Your order has been successfully placed.</p>
          </div>

          <div className="bg-card p-6 rounded-lg border mb-6">
            <Package className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-2">What's Next?</h2>
            <p className="text-sm text-muted-foreground">
              You'll receive an email confirmation shortly with your order details and tracking information.
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={() => navigate('/')} className="w-full">
              Continue Shopping
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <p className="text-xs text-muted-foreground">
              Redirecting to homepage in 10 seconds...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
