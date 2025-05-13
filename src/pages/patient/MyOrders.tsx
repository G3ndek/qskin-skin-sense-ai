
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Package } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

type OrderStatus = 'Active' | 'Pending' | 'Verified by dermatologist' | 'Shipped' | 'Received';

interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  description: string;
  status: OrderStatus;
}

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'QSK-2048',
    date: new Date(2025, 4, 14), // May 14, 2025
    description: 'Acne treatment kit – Tretinoin 0.05%, moisturizer, cleanser',
    status: 'Shipped',
  },
  {
    id: '2',
    orderNumber: 'QSK-2035',
    date: new Date(2025, 4, 2), // May 2, 2025
    description: 'Rosacea treatment – Azelaic acid 15%, sensitive skin moisturizer',
    status: 'Verified by dermatologist',
  },
  {
    id: '3',
    orderNumber: 'QSK-1982',
    date: new Date(2025, 3, 18), // April 18, 2025
    description: 'Anti-aging formula – Retinol 0.1%, hyaluronic acid serum',
    status: 'Received',
  },
  {
    id: '4',
    orderNumber: 'QSK-1845',
    date: new Date(2025, 2, 5), // March 5, 2025
    description: 'Eczema relief – Hydrocortisone 1%, ceramide moisturizer',
    status: 'Active',
  },
];

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'Active':
      return 'bg-blue-100 text-blue-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Verified by dermatologist':
      return 'bg-green-100 text-green-800';
    case 'Shipped':
      return 'bg-purple-100 text-purple-800';
    case 'Received':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const MyOrders: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>My Orders</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <h1 className="text-3xl font-bold mt-4 mb-2">My Orders</h1>
          <p className="text-gray-600 mb-6">
            You can view the status of all your previous and current treatment orders here.
          </p>
        </div>

        <div className="space-y-4">
          {mockOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          Order #{order.orderNumber}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        {format(order.date, 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} border-0`}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-gray-700">{order.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default MyOrders;
