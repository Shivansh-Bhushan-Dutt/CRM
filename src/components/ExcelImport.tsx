import { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { importAPI } from '../services/api';

type ImportType = 'tourfiles' | 'hotels' | 'guides';

export function ExcelImport() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<ImportType>('tourfiles');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      let data;
      
      if (importType === 'tourfiles') {
        data = await importAPI.uploadTourFiles(selectedFile);
      } else if (importType === 'hotels') {
        data = await importAPI.uploadHotels(selectedFile);
      } else {
        data = await importAPI.uploadGuides(selectedFile);
      }

      setResult(data);
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = (type: ImportType) => {
    const templates = {
      tourfiles: {
        columns: ['fileCode', 'tourName', 'clientCountry', 'pax', 'startDate', 'endDate', 'fileStatus', 'invoiceStatus', 'pnr', 'revenue', 'roomNights', 'ManagerEmail', 'ManagerName', 'foreignTourOperator', 'cities', 'hotels', 'guide', 'transportType'],
        sample: ['TF001', 'Golden Triangle Tour', 'USA', '4', '2025-01-15', '2025-01-22', 'upcoming', 'yet to raise', 'PNR123', '150000', '12', 'madhu@travelcrm.com', 'Madhu Chaudhary', 'Venus Travel', 'Delhi,Agra,Jaipur', 'Taj Palace,The Leela', 'Rajesh Kumar', 'Car']
      },
      hotels: {
        columns: ['name', 'city', 'state', 'rating', 'address'],
        sample: ['Taj Palace', 'Jaipur', 'Rajasthan', '5', 'Sardar Patel Marg, Jaipur']
      },
      guides: {
        columns: ['name', 'phone', 'expertise', 'rating'],
        sample: ['Rajesh Kumar', '+91 9876543210', 'Rajasthan,Delhi,Agra', '4.8']
      }
    };

    const template = templates[type];
    let csvContent = template.columns.join(',') + '\n';
    csvContent += template.sample.join(',') + '\n';

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Import Data from Excel</h1>
        <p className="text-gray-500 mt-1">Upload your Excel files to import tour files, hotels, and guides</p>
      </div>

      {/* Import Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Data Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setImportType('tourfiles')}
            className={`p-4 rounded-lg border-2 transition-all ${
              importType === 'tourfiles'
                ? 'border-violet-500 bg-violet-50'
                : 'border-gray-200 hover:border-violet-300'
            }`}
          >
            <FileSpreadsheet className={`w-8 h-8 mx-auto mb-2 ${
              importType === 'tourfiles' ? 'text-violet-600' : 'text-gray-400'
            }`} />
            <p className={`font-medium ${
              importType === 'tourfiles' ? 'text-violet-900' : 'text-gray-700'
            }`}>Tour Files</p>
          </button>

          <button
            onClick={() => setImportType('hotels')}
            className={`p-4 rounded-lg border-2 transition-all ${
              importType === 'hotels'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <FileSpreadsheet className={`w-8 h-8 mx-auto mb-2 ${
              importType === 'hotels' ? 'text-blue-600' : 'text-gray-400'
            }`} />
            <p className={`font-medium ${
              importType === 'hotels' ? 'text-blue-900' : 'text-gray-700'
            }`}>Hotels</p>
          </button>

          <button
            onClick={() => setImportType('guides')}
            className={`p-4 rounded-lg border-2 transition-all ${
              importType === 'guides'
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 hover:border-emerald-300'
            }`}
          >
            <FileSpreadsheet className={`w-8 h-8 mx-auto mb-2 ${
              importType === 'guides' ? 'text-emerald-600' : 'text-gray-400'
            }`} />
            <p className={`font-medium ${
              importType === 'guides' ? 'text-emerald-900' : 'text-gray-700'
            }`}>Guides</p>
          </button>
        </div>
      </motion.div>

      {/* Download Template */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 p-4 rounded-lg border border-blue-200"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-900 font-medium">Download Excel Template First</p>
            <p className="text-sm text-blue-700 mt-1">
              Download the template file to see the required format and column headers.
            </p>
            <button
              onClick={() => downloadTemplate(importType)}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download {importType === 'tourfiles' ? 'Tour Files' : importType === 'hotels' ? 'Hotels' : 'Guides'} Template
            </button>
          </div>
        </div>
      </motion.div>

      {/* File Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Excel File</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
          >
            Select File
          </label>
          <p className="text-sm text-gray-500 mt-2">
            Supported formats: .xlsx, .xls, .csv
          </p>
          
          {selectedFile && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg inline-block">
              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg hover:from-violet-700 hover:to-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload and Import'}
        </button>
      </motion.div>

      {/* Results */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 p-4 rounded-lg border border-red-200"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Upload Failed</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 p-4 rounded-lg border border-green-200"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900">Import Successful!</p>
              <p className="text-sm text-green-700 mt-1">
                Successfully imported {result.imported} records
              </p>
              
              {result.errors && result.errors.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-orange-900 mb-2">
                    {result.errors.length} errors occurred:
                  </p>
                  <div className="bg-white rounded p-3 max-h-40 overflow-y-auto">
                    {result.errors.map((err: any, idx: number) => (
                      <p key={idx} className="text-xs text-gray-700 mb-1">
                        Row {err.row}: {err.error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Instructions</h3>
        
        {importType === 'tourfiles' && (
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Required Columns:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>tourName, clientName, pax, startDate, endDate</li>
              <li>agentEmail or agentName (must match existing manager)</li>
              <li>revenue, roomNights</li>
            </ul>
            <p className="mt-4"><strong>Optional Columns:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>fileCode, clientCountry, status, pnr</li>
              <li>cities (comma-separated), hotels (comma-separated)</li>
              <li>guide, transportType</li>
            </ul>
            <p className="mt-4"><strong>Date Format:</strong> YYYY-MM-DD (e.g., 2025-01-15)</p>
            <p><strong>Status Values:</strong> upcoming, in-progress, completed</p>
          </div>
        )}

        {importType === 'hotels' && (
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Required Columns:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>name, city</li>
            </ul>
            <p className="mt-4"><strong>Optional Columns:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>state, rating, address</li>
            </ul>
            <p className="mt-4"><strong>Note:</strong> Duplicate hotels (same name and city) will be skipped</p>
          </div>
        )}

        {importType === 'guides' && (
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Required Columns:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>name, phone</li>
            </ul>
            <p className="mt-4"><strong>Optional Columns:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>expertise (comma-separated cities/regions)</li>
              <li>rating (0-5)</li>
            </ul>
            <p className="mt-4"><strong>Note:</strong> Duplicate guides (same name and phone) will be skipped</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
