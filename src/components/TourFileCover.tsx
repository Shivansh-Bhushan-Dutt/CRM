import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { tourFileAPI } from '../services/api';

interface TourFile {
  id: string;
  fileCode: string;
  tourName: string;
  status?: string;
  [key: string]: any;
}

interface TourFileCoverProps {
  tour: TourFile;
  canEdit: boolean;
  onUpdate?: (updatedTour: TourFile) => void;
}

export function TourFileCover({ tour, canEdit, onUpdate }: TourFileCoverProps) {
  // Auto-enable editing for new tours, otherwise start in view mode
  const [isEditing, setIsEditing] = useState(tour.id?.startsWith('new-') || false);
  
  // Safely parse arrays from tour data
  const parseArray = (value: any): any[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const [editedTour, setEditedTour] = useState<TourFile>(tour);
  const [checklistItems, setChecklistItems] = useState({
    hotels: '',
    voucher: '',
    trainTickets: '',
    airTicket: '',
    trainTkt: '',
    safaris: '',
    trainTicket120: '',
    specials: '',
    flight: '',
    flightTime: '',
    provider: '',
    transport: ''
  });

  // State for itinerary rows (10 rows)
  interface ItineraryRow {
    date: string;
    sector: string;
    flightNumber: string;
    time: string;
    status: string;
    city: string;
    hotelName: string;
    hotelStatus: string;
    roomCategory: string;
  }

  const emptyItineraryRow: ItineraryRow = {
    date: '',
    sector: '',
    flightNumber: '',
    time: '',
    status: '',
    city: '',
    hotelName: '',
    hotelStatus: '',
    roomCategory: ''
  };

  const [itineraryRows, setItineraryRows] = useState<ItineraryRow[]>(
    Array(10).fill(null).map(() => ({ ...emptyItineraryRow }))
  );

  // Update editedTour when tour prop changes (when loading from database)
  useEffect(() => {
    console.log('🔄 Tour data received:', tour.id, tour.tourName);
    
    const parsedHotels = parseArray(tour.hotels);
    const parsedCities = parseArray(tour.cities);
    const parsedGuides = parseArray(tour.guides);
    const parsedItinerary = parseArray(tour.itinerary);
    
    setEditedTour({
      ...tour,
      hotels: parsedHotels,
      cities: parsedCities,
      guides: parsedGuides,
      itinerary: parsedItinerary
    });
    
    setChecklistItems({
      hotels: parsedHotels.join('\n'),
      voucher: tour.voucher || '',
      trainTickets: tour.trainTickets || '',
      airTicket: tour.airTicket || '',
      trainTkt: tour.trainTkt || '',
      safaris: tour.safaris || '',
      trainTicket120: tour.trainTicket120 || '',
      specials: tour.specials || '',
      flight: tour.flight || '',
      flightTime: tour.flightTime || '',
      provider: tour.provider || '',
      transport: tour.transport || ''
    });

    // Load itinerary data
    if (parsedItinerary && parsedItinerary.length > 0) {
      const loadedRows = parsedItinerary.slice(0, 10).map((row: any) => ({
        date: row.date || '',
        sector: row.sector || '',
        flightNumber: row.flightNumber || '',
        time: row.time || '',
        status: row.status || '',
        city: row.city || '',
        hotelName: row.hotelName || '',
        hotelStatus: row.hotelStatus || '',
        roomCategory: row.roomCategory || ''
      }));
      
      // Fill remaining rows with empty data
      while (loadedRows.length < 10) {
        loadedRows.push({ ...emptyItineraryRow });
      }
      
      setItineraryRows(loadedRows);
    } else {
      // Reset to empty rows if no itinerary data
      setItineraryRows(Array(10).fill(null).map(() => ({ ...emptyItineraryRow })));
    }
    
    console.log('✅ Tour data loaded into form');
  }, [tour.id, tour.tourName]); // Re-run when tour ID or name changes

  // Auto-save to PostgreSQL database when editedTour or checklistItems changes
  useEffect(() => {
    const saveToDatabase = async () => {
      if (tour.id && !tour.id.startsWith('new-') && isEditing) {
        try {
          // Extract hotels from checklistItems separately
          const { hotels: hotelsText, ...otherChecklistItems } = checklistItems;
          
          const saveData = {
            ...editedTour,
            ...otherChecklistItems,
            // Convert hotels text to array
            hotels: hotelsText ? hotelsText.split('\n').filter(h => h.trim()) : [],
            itinerary: itineraryRows.filter(row => 
              row.date || row.sector || row.flightNumber || row.time || 
              row.status || row.city || row.hotelName || row.hotelStatus || row.roomCategory
            )
          };
          
          await tourFileAPI.update(tour.id, saveData);
          console.log('✅ Auto-saved tour to database:', tour.id);
        } catch (error) {
          console.error('❌ Auto-save failed:', error);
        }
      }
    };

    // Debounce the save to avoid too many API calls
    const timeoutId = setTimeout(saveToDatabase, 1000);
    return () => clearTimeout(timeoutId);
  }, [editedTour, checklistItems, itineraryRows, tour.id, isEditing]);

  const handleSave = async () => {
    try {
      // Prepare data - extract hotels from checklistItems separately
      const { hotels: hotelsText, ...otherChecklistItems } = checklistItems;
      
      const saveData = {
        ...editedTour,
        ...otherChecklistItems,
        // Convert hotels text to array
        hotels: hotelsText ? hotelsText.split('\n').filter(h => h.trim()) : [],
        itinerary: itineraryRows.filter(row => 
          row.date || row.sector || row.flightNumber || row.time || 
          row.status || row.city || row.hotelName || row.hotelStatus || row.roomCategory
        )
      };

      console.log('📤 Saving tour file:', {
        isNew: tour.id.startsWith('new-'),
        tourId: tour.id,
        saveData: saveData
      });

      let response;
      if (tour.id.startsWith('new-')) {
        // Create new tour
        console.log('Creating new tour file via API...');
        response = await tourFileAPI.create(saveData);
        console.log('✅ Tour created response:', response);
      } else {
        // Update existing tour
        console.log('Updating existing tour file via API...');
        response = await tourFileAPI.update(tour.id, saveData);
        console.log('✅ Tour updated response:', response);
      }

      if (response.success && response.data) {
        console.log('✅ Save successful, calling onUpdate with:', response.data);
        if (onUpdate) {
          onUpdate(response.data);
        }
        
        // Dispatch event to refresh tour list
        window.dispatchEvent(new Event('tourFilesSaved'));
        console.log('✅ Dispatched tourFilesSaved event');
        
        alert('✅ Tour file saved successfully!');
        setIsEditing(false);
        
        // Update local state to reflect the saved tour (with real DB id)
        const parsedHotels = parseArray(response.data.hotels);
        const parsedCities = parseArray(response.data.cities);
        const parsedGuides = parseArray(response.data.guides);
        const parsedItinerary = parseArray(response.data.itinerary);
        
        setEditedTour({
          ...response.data,
          hotels: parsedHotels,
          cities: parsedCities,
          guides: parsedGuides,
          itinerary: parsedItinerary
        });
      } else {
        console.error('❌ Response indicates failure:', response);
        alert('❌ Failed to save tour file');
      }
    } catch (error: any) {
      console.error('❌ Save error:', error);
      alert(`❌ Error saving tour file: ${error.message || 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    // Reset all states to original tour data
    const parsedHotels = parseArray(tour.hotels);
    const parsedCities = parseArray(tour.cities);
    const parsedGuides = parseArray(tour.guides);
    const parsedItinerary = parseArray(tour.itinerary);
    
    setEditedTour({
      ...tour,
      hotels: parsedHotels,
      cities: parsedCities,
      guides: parsedGuides,
      itinerary: parsedItinerary
    });
    
    setChecklistItems({
      hotels: parsedHotels.join('\n'),
      voucher: tour.voucher || '',
      trainTickets: tour.trainTickets || '',
      airTicket: tour.airTicket || '',
      trainTkt: tour.trainTkt || '',
      safaris: tour.safaris || '',
      trainTicket120: tour.trainTicket120 || '',
      specials: tour.specials || '',
      flight: tour.flight || '',
      flightTime: tour.flightTime || '',
      provider: tour.provider || '',
      transport: tour.transport || ''
    });

    // Reset itinerary
    if (parsedItinerary && parsedItinerary.length > 0) {
      const loadedRows = parsedItinerary.slice(0, 10).map((row: any) => ({
        date: row.date || '',
        sector: row.sector || '',
        flightNumber: row.flightNumber || '',
        time: row.time || '',
        status: row.status || '',
        city: row.city || '',
        hotelName: row.hotelName || '',
        hotelStatus: row.hotelStatus || '',
        roomCategory: row.roomCategory || ''
      }));
      while (loadedRows.length < 10) {
        loadedRows.push({ ...emptyItineraryRow });
      }
      setItineraryRows(loadedRows);
    } else {
      setItineraryRows(Array(10).fill(null).map(() => ({ ...emptyItineraryRow })));
    }
    
    setIsEditing(false);
  };

  // Editable input with better focus and click handling
  const EditableInput = ({ 
    value, 
    onChange, 
    placeholder = '',
    className = ''
  }: { 
    value: string | number, 
    onChange: (val: string) => void, 
    placeholder?: string,
    className?: string
  }) => {
    if (isEditing) {
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-2 py-1.5 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all ${className}`}
          autoComplete="off"
        />
      );
    }
    return <span className="block px-2 py-1.5">{value || <span className="text-gray-400">{placeholder}</span>}</span>;
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto bg-white">
      {/* Action Buttons */}
      {canEdit && (
        <div className="flex justify-end gap-2 mb-4">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              Edit Cover
            </Button>
          ) : (
            <>
              <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                Cancel
              </Button>
            </>
          )}
        </div>
      )}

      {/* Tour File Checklist - Table Format */}
      <div className="border-4 border-black">
        {/* Header Section */}
        <div className="border-b-4 border-black">
          <div className="grid grid-cols-2 min-h-[80px]">
            <div className="flex items-center justify-center border-r-4 border-black p-4">
              <div className="text-xl font-bold text-orange-600">Immerse India<br/>
                <span className="text-sm">Tours Pvt Ltd</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-4">
              <h1 className="text-xl font-bold text-center">Immerse India Tours Pvt Ltd</h1>
            </div>
          </div>
        </div>

        {/* File Code and Checklist Header */}
        <div className="grid grid-cols-2 border-b-2 border-black">          
          <div className="grid grid-cols-5 border-r-2 border-black p-2">
            <span className="col-span-1 font-semibold px-1 py-2">File Code: </span>
            <div className="col-span-2 px-2 py-1">
              <input type="text" value={editedTour.fileCode || ''} onChange={(e) =>isEditing && setEditedTour({ ...editedTour, fileCode: e.target.value })}
              readOnly={!isEditing} className={`border px-2 py-1 w-full ${ !isEditing ? "bg-white cursor-default" : "bg-gray-100" }`}/>
            </div>
          </div>
          <div className="p-3">
            <span className="font-semibold">File Check List -45 days before</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2">
          {/* Left Side - File Details */}
          <div className="border-r-2 border-black">
            {/* File Name */}
            <div className="grid grid-cols-6 border-b border-gray-400 min-h-[40px]">
              <div className="col-span-2 border-r border-gray-400 px-3 py-2 bg-gray-50 font-medium">File Name</div>
              <div className="col-span-4 px-2 py-1">
                {isEditing && (
                  <input 
                    type="text" 
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                    value={editedTour.tourName} onChange={(e) => setEditedTour({...editedTour, tourName: e.target.value })} />
                )}
                {!isEditing && (
                  <span>{editedTour.tourName}</span>
                )}
              </div>
            </div>

            {/* Client Name */}
            <div className="grid grid-cols-6 border-b border-gray-400 min-h-[40px]">
              <div className="col-span-2 border-r border-gray-400 px-3 py-2 bg-gray-50 font-medium">Client Name</div>
              <div className="col-span-4 px-2 py-1">
                {isEditing ? (
                  <input 
                    type="text" 
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                    value={editedTour.clientName || ''} 
                    onChange={(e) => setEditedTour({...editedTour, clientName: e.target.value})} 
                  />
                ) : (
                  <span className="block px-2 py-1.5">{editedTour.clientName || ''}</span>
                )}
              </div>
            </div>

            {/* Arrival Date & Flight */}
            <div className="grid grid-cols-6 border-b border-gray-400 min-h-[40px]">
              <div className="col-span-2 border-r border-gray-400 px-3 py-2 bg-gray-50 font-medium">Arrival Date</div>
              <div className="col-span-4 px-2 py-1">
                {isEditing ? (
                  <input 
                    type="date" 
                    value={editedTour.startDate} 
                    onChange={(e) => setEditedTour({...editedTour, startDate: e.target.value})} 
                    className="w-full px-2 py-1.5 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200" 
                  />
                ) : (
                  <span className="block px-2 py-1.5">{new Date(tour.startDate).toLocaleDateString('en-GB')}</span>
                )}
              </div>
            </div>

            {/* Booking recd on & Flight Time */}
            <div className="grid grid-cols-6 border-b border-gray-400 min-h-[40px]">
              <div className="col-span-2 border-r border-gray-400 px-3 py-2 bg-gray-50 font-medium">Booking recd on</div>
              <div className="col-span-4 px-2 py-1">
                {isEditing ? (
                  <input 
                    type="date" 
                    value={editedTour.bookingDate || ''} 
                    onChange={(e) => setEditedTour({...editedTour, bookingDate: e.target.value})} 
                    className="w-full px-2 py-1.5 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200" 
                  />
                ) : (
                  <span className="block px-2 py-1.5">{editedTour.bookingDate ? new Date(editedTour.bookingDate).toLocaleDateString('en-GB') : ''}</span>
                )}
              </div>
            </div>

            {/* FTO */}
            <div className="grid grid-cols-6 border-b border-gray-400 min-h-[40px]">
              <div className="col-span-2 border-r border-gray-400 px-3 py-2 bg-gray-50 font-medium">FTO</div>
              <div className="col-span-4 px-2 py-1">
                {isEditing ? (
                  <input 
                    type="text" 
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                    value={editedTour.foreignTourOperator || ''} 
                    onChange={(e) => setEditedTour({...editedTour, foreignTourOperator: e.target.value})} 
                    placeholder="Direct / Domestic"
                  />
                ) : (
                  <span className="block px-2 py-1.5">{editedTour.foreignTourOperator || ''}</span>
                )}
              </div>
            </div>

            {/* Accommodation */}
            <div className="grid grid-cols-6 min-h-[40px]">
                <div className="col-span-2 px-2 py-2 border-r border-gray-400 bg-gray-50 font-medium">Accommodation</div>
                <div className="col-span-1 px-2 py-2 border-r border-gray-400 text-center text-sm bg-gray-50">Single</div>
                <div className="col-span-1 px-2 py-2 border-r border-gray-400 text-center text-sm bg-gray-50">Double</div>
                <div className="col-span-1 px-2 py-2 text-center text-sm bg-gray-50">Twin</div>
            </div>
            <div className="grid grid-cols-6 border border-gray-400 min-h-[40px]">
              <div className="col-span-2 border-r border-gray-400"></div>
              <div className="col-span-1 border-r border-gray-400 px-2 py-1">
                {isEditing ? (
                  <input 
                    type="text" 
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                    value={editedTour.accomSingle || ''} 
                    onChange={(e) => setEditedTour({...editedTour, accomSingle: e.target.value})} 
                  />
                ) : (
                  <span className="block px-2 py-1.5">{editedTour.accomSingle || ''}</span>
                )}
              </div>
              <div className="col-span-1 border-r border-gray-400 px-2 py-1">
                {isEditing ? (
                  <input 
                    type="text" 
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                    value={editedTour.accomDouble || ''} 
                    onChange={(e) => setEditedTour({...editedTour, accomDouble: e.target.value})} 
                  />
                ) : (
                  <span className="block px-2 py-1.5">{editedTour.accomDouble || ''}</span>
                )}
              </div>
              <div className="col-span-1 border-r border-gray-400 px-2 py-1">
                {isEditing ? (
                  <input 
                    type="text" 
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                    value={editedTour.accomTwin || ''} 
                    onChange={(e) => setEditedTour({...editedTour, accomTwin: e.target.value})} 
                  />
                ) : (
                  <span className="block px-2 py-1.5">{editedTour.accomTwin || ''}</span>
                )}
              </div>
            </div>
             
            <div className="grid grid-cols-6 border-t border-gray-400">
              <div className="col-span-2 border-r border-gray-400"></div>
              <div className="col-span-1 border-r border-gray-400 px-2 py-2 text-center text-sm bg-gray-50">Triple</div>
              <div className="col-span-1 border-r border-gray-400 px-2 py-2 text-center text-sm bg-gray-50">Suite</div>
              <div className="col-span-1 px-2 py-2 text-center text-sm bg-gray-50">Meals</div>
            </div>
            <div className="grid grid-cols-6 border-t border-gray-400 min-h-[40px]">
              <div className="col-span-2 border-r border-gray-400"></div>
                <div className="col-span-1 border-r border-gray-400 px-2 py-1">
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                      value={editedTour.accomTriple || ''} 
                      onChange={(e) => setEditedTour({...editedTour, accomTriple: e.target.value})} 
                    />
                  ) : (
                    <span className="block px-2 py-1.5">{editedTour.accomTriple || ''}</span>
                  )}
                </div>
                <div className="col-span-1 border-r border-gray-400 px-2 py-1">
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                      value={editedTour.accomSuite || ''} 
                      onChange={(e) => setEditedTour({...editedTour, accomSuite: e.target.value})} 
                    />
                  ) : (
                    <span className="block px-2 py-1.5">{editedTour.accomSuite || ''}</span>
                  )}
                </div>
                <div className="col-span-1 border-r border-gray-400 px-2 py-1">
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                      value={editedTour.accomMeals || ''} 
                      onChange={(e) => setEditedTour({...editedTour, accomMeals: e.target.value})} 
                    />
                  ) : (
                    <span className="block px-2 py-1.5">{editedTour.accomMeals || ''}</span>
                  )}
                </div>
              </div>

            <div className="grid grid-cols-6 border-t border-gray-400 min-h-[40px]">
              <div className="col-span-2 border-r border-gray-400 px-3 py-2 bg-gray-50 font-medium">Flight</div>
              <div className="col-span-4 px-2 py-1">
                {isEditing ? (
                  <input 
                    type="text" 
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                    value={checklistItems.flight} 
                    onChange={(e) => setChecklistItems({...checklistItems, flight: e.target.value})} 
                  />
                ) : (
                  <span className="block px-2 py-1.5">{checklistItems.flight}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-6 border-t border-gray-400 min-h-[40px]">
              <div className="col-span-2 border-r border-gray-400 px-3 py-2 bg-gray-50 font-medium">Flight Time</div>
              <div className="col-span-4 px-2 py-1">
                {isEditing ? (
                  <input 
                    type="text" 
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                    value={checklistItems.flightTime} 
                    onChange={(e) => setChecklistItems({...checklistItems, flightTime: e.target.value})} 
                  />
                ) : (
                  <span className="block px-2 py-1.5">{checklistItems.flightTime}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-6 border-t border-gray-400 min-h-[40px]">
              <div className="col-span-2 border-r border-gray-400 px-3 py-2 bg-gray-50 font-medium">Provider</div>
              <div className="col-span-4 px-2 py-1">
                {isEditing ? (
                  <input 
                    type="text" 
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                    value={checklistItems.provider} 
                    onChange={(e) => setChecklistItems({...checklistItems, provider: e.target.value})} 
                  />
                ) : (
                  <span className="block px-2 py-1.5">{checklistItems.provider}</span>
                )}
              </div>
            </div>
    
            {/* Transport */}
            <div className="grid grid-cols-6 border-t border-gray-400 min-h-[40px]">
              <div className="col-span-2 border-r border-gray-400 px-3 py-2 bg-gray-50 font-medium">Transport</div>
              <div className="col-span-4 px-2 py-1">
                {isEditing ? (
                  <input 
                    type="text" 
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                    value={checklistItems.transport} 
                    onChange={(e) => setChecklistItems({...checklistItems, transport: e.target.value})} 
                  />
                ) : (
                  <span className="block px-2 py-1.5">{checklistItems.transport}</span>
                )}
              </div>
            </div>

            {/* Tour Leader */}
            <div className="grid grid-cols-6 border border-gray-400 min-h-[40px]">
              <div className="col-span-2 border-r border-gray-400 px-3 py-2 bg-gray-50 font-medium">Tour Leader</div>
              <div className="col-span-4 px-2 py-1">
                {isEditing ? (
                  <input 
                    type="text" 
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                    value={editedTour.guide || ''} 
                    onChange={(e) => setEditedTour({...editedTour, guide: e.target.value})} 
                    placeholder="NA"
                  />
                ) : (
                  <span className="block px-2 py-1.5">{editedTour.guide || 'NA'}</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Checklists */}
          <div>
            {/* Hotels */}
            <div className="border-b border-gray-400 min-h-[100px]">
              <div className="grid grid-cols-12">
                <div className="col-span-3 px-3 py-2 bg-gray-50 font-medium border-r border-gray-400">Hotels</div>
                <div className="col-span-9 px-2 py-1">
                  {isEditing ? (
                    <textarea
                      value={checklistItems.hotels}
                      onChange={(e) => setChecklistItems({...checklistItems, hotels: e.target.value})}
                      placeholder="Enter hotels, one per line"
                      rows={3}
                      className="w-full px-2 py-1.5 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 resize-none"
                    />
                  ) : (
                    <div className="px-2 py-1.5">
                      {checklistItems.hotels.split('\n').map((hotel, idx) => (
                        <div key={idx} className="text-sm">{hotel.trim()}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Voucher */}
            <div className="border-b border-gray-400 min-h-[40px]">
              <div className="grid grid-cols-12">
                <div className="col-span-3 px-3 py-2 bg-gray-50 font-medium border-r border-gray-400">Voucher</div>
                <div className="col-span-9 px-2 py-1">
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                      value={checklistItems.voucher} 
                      onChange={(e) => setChecklistItems({...checklistItems, voucher: e.target.value})} 
                    />
                  ) : (
                    <span className="block px-2 py-1.5">{checklistItems.voucher}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Train tickets */}
            <div className="border-b border-gray-400 min-h-[40px]">
              <div className="grid grid-cols-12">
                <div className="col-span-3 px-3 py-2 bg-gray-50 font-medium border-r border-gray-400">Train tickets</div>
                <div className="col-span-9 px-2 py-1">
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                      value={checklistItems.trainTickets} 
                      onChange={(e) => setChecklistItems({...checklistItems, trainTickets: e.target.value})} 
                    />
                  ) : (
                    <span className="block px-2 py-1.5">{checklistItems.trainTickets}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Air ticket */}
            <div className="border-b border-gray-400 min-h-[40px]">
              <div className="grid grid-cols-12">
                <div className="col-span-3 px-3 py-2 bg-gray-50 font-medium border-r border-gray-400">Air ticket</div>
                <div className="col-span-9 px-2 py-1">
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                      value={checklistItems.airTicket} 
                      onChange={(e) => setChecklistItems({...checklistItems, airTicket: e.target.value})} 
                    />
                  ) : (
                    <span className="block px-2 py-1.5">{checklistItems.airTicket}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Train tkt */}
            <div className="border-b border-gray-400 min-h-[40px]">
              <div className="grid grid-cols-12">
                <div className="col-span-3 px-3 py-2 bg-gray-50 font-medium border-r border-gray-400">Train tkt</div>
                <div className="col-span-9 px-2 py-1">
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                      value={checklistItems.trainTkt} 
                      onChange={(e) => setChecklistItems({...checklistItems, trainTkt: e.target.value})} 
                    />
                  ) : (
                    <span className="block px-2 py-1.5">{checklistItems.trainTkt}</span>
                  )}
                </div>
              </div>
            </div>

            {/* File check list 120 days prior */}
            <div className="border-b-2 border-black min-h-[50px] px-3 py-3 bg-gray-100">
              <div className="font-semibold text-center">File check list 120 days prior</div>
            </div>

            {/* Safaris */}
            <div className="border-b border-gray-400 min-h-[40px]">
              <div className="grid grid-cols-12">
                <div className="col-span-3 px-3 py-2 bg-gray-50 font-medium border-r border-gray-400">Safaris</div>
                <div className="col-span-9 px-2 py-1">
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                      value={checklistItems.safaris} 
                      onChange={(e) => setChecklistItems({...checklistItems, safaris: e.target.value})} 
                    />
                  ) : (
                    <span className="block px-2 py-1.5">{checklistItems.safaris}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Train ticket */}
            <div className="border-b border-gray-400 min-h-[40px]">
              <div className="grid grid-cols-12">
                <div className="col-span-3 px-3 py-2 bg-gray-50 font-medium border-r border-gray-400">Train ticket</div>
                <div className="col-span-9 px-2 py-1">
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                      value={checklistItems.trainTicket120} 
                      onChange={(e) => setChecklistItems({...checklistItems, trainTicket120: e.target.value})} 
                    />
                  ) : (
                    <span className="block px-2 py-1.5">{checklistItems.trainTicket120}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Specials */}
            <div className="border-b border-gray-400 min-h-[40px]">
              <div className="grid grid-cols-12">
                <div className="col-span-3 px-3 py-2 bg-gray-50 font-medium border-r border-gray-400">Specials</div>
                <div className="col-span-9 px-2 py-1">
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                      value={checklistItems.specials} 
                      onChange={(e) => setChecklistItems({...checklistItems, specials: e.target.value})} 
                    />
                  ) : (
                    <span className="block px-2 py-1.5">{checklistItems.specials}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Itinerary Table */}
        <div className="border-t-2 border-black">
          <div className="grid grid-cols-12 border-b border-gray-400 bg-gray-100">
            <div className="col-span-1 border-r border-gray-400 px-2 py-2 text-center font-medium text-sm">Date</div>
            <div className="col-span-1 border-r border-gray-400 px-2 py-2 text-center font-medium text-sm">Sector</div>
            <div className="col-span-3 border-r border-gray-400 px-2 py-2 text-center font-medium text-sm">Flights / Train</div>
            <div className="col-span-2 border-r border-gray-400 px-2 py-2 text-center font-medium text-sm">City</div>
            <div className="col-span-4 border-r border-gray-400 px-2 py-2 text-center font-medium text-sm">Hotel Reservation</div>
            <div className="col-span-1 px-2 py-2 text-center font-medium text-sm">Room Category</div>
          </div>

          <div className="grid grid-cols-12 border-b border-gray-400 bg-gray-50">
            <div className="col-span-2 border-r border-gray-400"></div>
            <div className="col-span-1 border-r border-gray-400 px-2 py-1 text-center text-xs">Flight / Train number</div>
            <div className="col-span-1 border-r border-gray-400 px-2 py-1 text-center text-xs">Time</div>
            <div className="col-span-1 border-r border-gray-400 px-2 py-1 text-center text-xs">Status</div>
            <div className="col-span-2 border-r border-gray-400"></div>
            <div className="col-span-2 border-r border-gray-400 px-2 py-1 text-center text-xs">Hotel Name</div>
            <div className="col-span-2 border-r border-gray-400 px-2 py-1 text-center text-xs">Status</div>
            <div className="col-span-1"></div>
          </div>

          {/* Itinerary rows - 10 rows total */}
          {itineraryRows.map((row, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-12 border-b border-gray-400 min-h-[45px]">
              {/* Date */}
              <div className="border-r border-gray-400 px-2 py-2">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={row.date}
                    onChange={(e) => {
                      const newRows = [...itineraryRows];
                      newRows[rowIdx].date = e.target.value;
                      setItineraryRows(newRows);
                    }}
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                  />
                ) : (
                  <span className="block px-2 py-1 text-sm">{row.date}</span>
                )}
              </div>
              
              {/* Sector */}
              <div className="border-r border-gray-400 px-2 py-2">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={row.sector}
                    onChange={(e) => {
                      const newRows = [...itineraryRows];
                      newRows[rowIdx].sector = e.target.value;
                      setItineraryRows(newRows);
                    }}
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                  />
                ) : (
                  <span className="block px-2 py-1 text-sm">{row.sector}</span>
                )}
              </div>
              
              {/* Flight/Train Number */}
              <div className="border-r border-gray-400 px-2 py-2">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={row.flightNumber}
                    onChange={(e) => {
                      const newRows = [...itineraryRows];
                      newRows[rowIdx].flightNumber = e.target.value;
                      setItineraryRows(newRows);
                    }}
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                  />
                ) : (
                  <span className="block px-2 py-1 text-sm">{row.flightNumber}</span>
                )}
              </div>
              
              {/* Time */}
              <div className="border-r border-gray-400 px-2 py-2">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={row.time}
                    onChange={(e) => {
                      const newRows = [...itineraryRows];
                      newRows[rowIdx].time = e.target.value;
                      setItineraryRows(newRows);
                    }}
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                  />
                ) : (
                  <span className="block px-2 py-1 text-sm">{row.time}</span>
                )}
              </div>
              
              {/* Status */}
              <div className="border-r border-gray-400 px-2 py-2">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={row.status}
                    onChange={(e) => {
                      const newRows = [...itineraryRows];
                      newRows[rowIdx].status = e.target.value;
                      setItineraryRows(newRows);
                    }}
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                  />
                ) : (
                  <span className="block px-2 py-1 text-sm">{row.status}</span>
                )}
              </div>
              
              {/* City */}
              <div className="col-span-2 border-r border-gray-400 px-2 py-2">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={row.city}
                    onChange={(e) => {
                      const newRows = [...itineraryRows];
                      newRows[rowIdx].city = e.target.value;
                      setItineraryRows(newRows);
                    }}
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                  />
                ) : (
                  <span className="block px-2 py-1 text-sm">{row.city}</span>
                )}
              </div>
              
              {/* Hotel Name */}
              <div className="col-span-2 border-r border-gray-400 px-2 py-2">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={row.hotelName}
                    onChange={(e) => {
                      const newRows = [...itineraryRows];
                      newRows[rowIdx].hotelName = e.target.value;
                      setItineraryRows(newRows);
                    }}
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                  />
                ) : (
                  <span className="block px-2 py-1 text-sm">{row.hotelName}</span>
                )}
              </div>
              
              {/* Hotel Status */}
              <div className="col-span-2 border-r border-gray-400 px-2 py-2">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={row.hotelStatus}
                    onChange={(e) => {
                      const newRows = [...itineraryRows];
                      newRows[rowIdx].hotelStatus = e.target.value;
                      setItineraryRows(newRows);
                    }}
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                  />
                ) : (
                  <span className="block px-2 py-1 text-sm">{row.hotelStatus}</span>
                )}
              </div>
              
              {/* Room Category */}
              <div className="px-2 py-2">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={row.roomCategory}
                    onChange={(e) => {
                      const newRows = [...itineraryRows];
                      newRows[rowIdx].roomCategory = e.target.value;
                      setItineraryRows(newRows);
                    }}
                    className="w-full px-2 py-1 bg-white border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm" 
                  />
                ) : (
                  <span className="block px-2 py-1 text-sm">{row.roomCategory}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

