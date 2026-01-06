// Test localStorage (our "database") functionality
export const testLocalStorage = () => {
  console.log('🔍 Testing localStorage (database)...');
  
  try {
    // Test 1: Write to localStorage
    const testData = { id: 'test-123', name: 'Test Tour' };
    localStorage.setItem('test-tour', JSON.stringify(testData));
    console.log('✅ Write test: SUCCESS');
    
    // Test 2: Read from localStorage
    const retrieved = localStorage.getItem('test-tour');
    if (retrieved) {
      const parsed = JSON.parse(retrieved);
      console.log('✅ Read test: SUCCESS', parsed);
    } else {
      console.error('❌ Read test: FAILED');
      return false;
    }
    
    // Test 3: Check manual tour files
    const manualTours = localStorage.getItem('manualTourFiles');
    if (manualTours) {
      const tours = JSON.parse(manualTours);
      console.log(`✅ Manual Tours found: ${tours.length} tours`, tours);
    } else {
      console.log('ℹ️ No manual tours yet (this is normal for first time)');
    }
    
    // Test 4: Delete test data
    localStorage.removeItem('test-tour');
    console.log('✅ Delete test: SUCCESS');
    
    console.log('✅ All database tests PASSED!');
    return true;
  } catch (error) {
    console.error('❌ Database test FAILED:', error);
    return false;
  }
};

// Get all manual tour files
export const getManualTourFiles = () => {
  try {
    const saved = localStorage.getItem('manualTourFiles');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error reading tour files:', error);
    return [];
  }
};

// Save a tour file
export const saveTourFile = (tour: any) => {
  try {
    const saved = localStorage.getItem('manualTourFiles');
    const tours = saved ? JSON.parse(saved) : [];
    
    const existingIndex = tours.findIndex((t: any) => t.id === tour.id);
    if (existingIndex >= 0) {
      tours[existingIndex] = tour;
      console.log('✅ Tour updated:', tour.id);
    } else {
      tours.push(tour);
      console.log('✅ New tour created:', tour.id);
    }
    
    localStorage.setItem('manualTourFiles', JSON.stringify(tours));
    window.dispatchEvent(new Event('tourFilesSaved'));
    return true;
  } catch (error) {
    console.error('❌ Error saving tour:', error);
    return false;
  }
};

// Delete a tour file
export const deleteTourFile = (tourId: string) => {
  try {
    const saved = localStorage.getItem('manualTourFiles');
    if (saved) {
      const tours = JSON.parse(saved);
      const filtered = tours.filter((t: any) => t.id !== tourId);
      localStorage.setItem('manualTourFiles', JSON.stringify(filtered));
      window.dispatchEvent(new Event('tourFilesSaved'));
      console.log('✅ Tour deleted:', tourId);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error deleting tour:', error);
    return false;
  }
};
