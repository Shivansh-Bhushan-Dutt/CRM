import { ArrowLeft, Plane, Train, Bus, Hotel, Car } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface TicketDetailProps {
  ticketId: string | null;
  onBack: () => void;
}

export function TicketDetail({ ticketId, onBack }: TicketDetailProps) {
  return (
    <div className="p-6 space-y-6">
      <Button onClick={onBack} variant="outline" size="sm">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Plane className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold">Flight Ticket</h2>
          <Badge>Confirmed</Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">PNR</p>
            <p className="font-medium">PNR2025001</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Flight Number</p>
            <p className="font-medium">AI 5432</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">From</p>
            <p className="font-medium">Delhi (DEL)</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">To</p>
            <p className="font-medium">Jaipur (JAI)</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="font-medium">15 Jan 2025</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Passengers</p>
            <p className="font-medium">6</p>
          </div>
        </div>
      </div>
    </div>
  );
}
