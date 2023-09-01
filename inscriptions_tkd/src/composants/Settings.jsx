import React from 'react';
import PdfGenerator from '../PdfGenerator';
import { PDFViewer } from '@react-pdf/renderer';

const Settings = () => {
  return (
    <div>
      <PDFViewer width="800" height="600">
        <PdfGenerator />
      </PDFViewer>
    </div>
  );
};

export default Settings;
