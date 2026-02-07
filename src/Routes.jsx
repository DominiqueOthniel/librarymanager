import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import BookLendingProcess from './pages/book-lending-process/index';
import BookReturnProcessing from './pages/book-return-processing/index';
import LibraryDashboard from './pages/library-dashboard/index';
import OverdueBooksPage from './pages/overdue-books-dashboard/index';
import BookCatalogManagement from './pages/book-catalog-management/index';
import LibraryReportsCenter from './pages/library-reports-center/index';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LibraryDashboard />} />
        <Route path="/book-lending-process" element={<BookLendingProcess />} />
        <Route path="/book-return-processing" element={<BookReturnProcessing />} />
        <Route path="/library-dashboard" element={<LibraryDashboard />} />
        <Route path="/overdue-books-dashboard" element={<OverdueBooksPage />} />
        <Route path="/book-catalog-management" element={<BookCatalogManagement />} />
        <Route path="/library-reports-center" element={<LibraryReportsCenter />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
