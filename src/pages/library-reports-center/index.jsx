import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import ReportCategoryCard from './components/ReportCategoryCard';
import ReportParametersPanel from './components/ReportParametersPanel';
import ReportViewer from './components/ReportViewer';
import QuickStatsCard from './components/QuickStatsCard';
import { reportsAPI } from '../../services/api';

const LibraryReportsCenter = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportParameters, setReportParameters] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1))?.toISOString()?.split('T')?.[0],
    endDate: new Date()?.toISOString()?.split('T')?.[0],
    category: 'all',
    status: 'all',
    format: 'screen',
    includeDetails: true,
    includeCharts: true,
    includeBorrower: false
  });
  const [generatedReport, setGeneratedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportCategories = [
    {
      id: 'inventory',
      name: 'Inventory Reports',
      description: 'Book catalog and availability analysis',
      icon: 'Package',
      color: 'bg-primary',
      reports: [
        {
          id: 'catalog-summary',
          name: 'Catalog Summary',
          description: 'Complete overview of library collection',
          icon: 'BookOpen'
        },
        {
          id: 'availability-status',
          name: 'Availability Status',
          description: 'Current status of all books',
          icon: 'CheckCircle'
        },
        {
          id: 'category-breakdown',
          name: 'Category Breakdown',
          description: 'Books organized by categories',
          icon: 'LayoutGrid'
        },
        {
          id: 'new-acquisitions',
          name: 'New Acquisitions',
          description: 'Recently added books to collection',
          icon: 'Plus',
          isNew: true
        }
      ]
    },
    {
      id: 'lending',
      name: 'Lending Reports',
      description: 'Borrowing activity and circulation data',
      icon: 'UserCheck',
      color: 'bg-secondary',
      reports: [
        {
          id: 'borrowing-activity',
          name: 'Borrowing Activity',
          description: 'Daily and monthly lending statistics',
          icon: 'Activity'
        },
        {
          id: 'popular-books',
          name: 'Popular Books',
          description: 'Most frequently borrowed titles',
          icon: 'TrendingUp'
        },
        {
          id: 'member-activity',
          name: 'Member Activity',
          description: 'Individual borrower statistics',
          icon: 'Users'
        },
        {
          id: 'circulation-trends',
          name: 'Circulation Trends',
          description: 'Long-term borrowing patterns',
          icon: 'BarChart3'
        }
      ]
    },
    {
      id: 'overdue',
      name: 'Overdue Reports',
      description: 'Late returns and fee management',
      icon: 'Clock',
      color: 'bg-warning',
      reports: [
        {
          id: 'overdue-items',
          name: 'Overdue Items',
          description: 'Currently overdue books and borrowers',
          icon: 'AlertTriangle'
        },
        {
          id: 'fee-collection',
          name: 'Fee Collection',
          description: 'Outstanding and collected fees',
          icon: 'DollarSign'
        },
        {
          id: 'return-patterns',
          name: 'Return Patterns',
          description: 'Analysis of return behavior',
          icon: 'RotateCcw'
        }
      ]
    },
    {
      id: 'statistical',
      name: 'Statistical Reports',
      description: 'Usage trends and analytics',
      icon: 'BarChart3',
      color: 'bg-accent',
      reports: [
        {
          id: 'usage-trends',
          name: 'Usage Trends',
          description: 'Library usage over time',
          icon: 'LineChart'
        },
        {
          id: 'borrower-analytics',
          name: 'Borrower Analytics',
          description: 'Member demographics and behavior',
          icon: 'PieChart'
        },
        {
          id: 'collection-analysis',
          name: 'Collection Analysis',
          description: 'Collection utilization metrics',
          icon: 'Target'
        },
        {
          id: 'performance-metrics',
          name: 'Performance Metrics',
          description: 'Key performance indicators',
          icon: 'Gauge',
          isNew: true
        }
      ]
    }
  ];

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleReportSelect = (report) => {
    setSelectedReport(report);
    setGeneratedReport(null);
  };

  const handleParameterChange = (key, value) => {
    setReportParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGenerateReport = async () => {
    if (!selectedReport) return;

    setIsGenerating(true);
    
    try {
      const reportData = await generateRealReportData(selectedReport, reportParameters);
      setGeneratedReport(reportData);
    } catch (error) {
      console.error('Error generating report:', error);
      setGeneratedReport(null);
      const errMsg = error.response?.data?.error || error.message || 'Backend may be unavailable. Ensure the server is running and MongoDB is connected.';
      alert(`Failed to generate report: ${errMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRealReportData = async (report, parameters) => {
    const baseData = {
      title: `${report?.name} Report`,
      generatedAt: new Date()?.toISOString(),
      parameters
    };

    try {
      switch (report?.id) {
        case 'catalog-summary':
        case 'availability-status':
          const inventoryResponse = await reportsAPI.getInventory();
          const inventoryData = inventoryResponse.data || inventoryResponse;
          return {
            ...baseData,
            summary: [
              { label: 'Total Books', value: inventoryData.total_books?.toString() || '0', icon: 'BookOpen', color: 'bg-primary', change: 0 },
              { label: 'Available', value: inventoryData.available_books?.toString() || '0', icon: 'CheckCircle', color: 'bg-success', change: 0 },
              { label: 'Borrowed', value: inventoryData.borrowed_books?.toString() || '0', icon: 'UserCheck', color: 'bg-secondary', change: 0 },
              { label: 'Maintenance', value: inventoryData.maintenance_books?.toString() || '0', icon: 'Wrench', color: 'bg-warning', change: 0 }
            ],
            data: [inventoryData]
          };

        case 'category-breakdown':
          const categoryResponse = await reportsAPI.getBooksByCategory();
          const categoryData = categoryResponse.data || categoryResponse;
          return {
            ...baseData,
            summary: [
              { label: 'Categories', value: categoryData.length?.toString() || '0', icon: 'LayoutGrid', color: 'bg-accent', change: 0 },
              { label: 'Total Books', value: categoryData.reduce((sum, cat) => sum + (cat.total_books || 0), 0)?.toString() || '0', icon: 'BookOpen', color: 'bg-primary', change: 0 }
            ],
            data: categoryData
          };

        case 'popular-books':
          const popularResponse = await reportsAPI.getPopularBooks(10);
          const popularData = popularResponse.data || popularResponse;
          return {
            ...baseData,
            summary: [
              { label: 'Most Borrowed', value: popularData[0]?.borrow_count?.toString() || '0', icon: 'TrendingUp', color: 'bg-success', change: 0 },
              { label: 'Total Books', value: popularData.length?.toString() || '0', icon: 'BookOpen', color: 'bg-primary', change: 0 }
            ],
            data: popularData
          };

        case 'member-activity':
          const borrowerResponse = await reportsAPI.getBorrowerActivity();
          const borrowerData = borrowerResponse.data || borrowerResponse;
          return {
            ...baseData,
            summary: [
              { label: 'Total Borrowers', value: borrowerData.total_borrowers?.toString() || '0', icon: 'Users', color: 'bg-primary', change: 0 },
              { label: 'Active Borrowers', value: borrowerData.active_borrowers?.toString() || '0', icon: 'UserCheck', color: 'bg-success', change: 0 },
              { label: 'With Active Loans', value: borrowerData.borrowers_with_active_loans?.toString() || '0', icon: 'Clock', color: 'bg-warning', change: 0 }
            ],
            data: [borrowerData]
          };

        case 'overdue-items':
          const overdueResponse = await reportsAPI.getOverdueSummary();
          const overdueData = overdueResponse.data || overdueResponse;
          return {
            ...baseData,
            summary: [
              { label: 'Overdue Items', value: overdueData.total_overdue?.toString() || '0', icon: 'AlertTriangle', color: 'bg-error', change: 0 },
              { label: 'Avg. Overdue Days', value: Math.round(overdueData.avg_overdue_days || 0)?.toString() + ' days', icon: 'Clock', color: 'bg-warning', change: 0 },
              { label: '1 Week Overdue', value: overdueData.overdue_1_week?.toString() || '0', icon: 'Calendar', color: 'bg-accent', change: 0 }
            ],
            data: [overdueData]
          };

        default:
          // Fallback to dashboard summary for other reports
          const dashboardResponse = await reportsAPI.getDashboardSummary();
          const dashboardData = dashboardResponse.data || dashboardResponse;
          return {
            ...baseData,
            summary: [
              { label: 'Total Books', value: dashboardData.inventory?.total_books?.toString() || '0', icon: 'BookOpen', color: 'bg-primary', change: 0 },
              { label: 'Active Borrowers', value: dashboardData.borrowers?.active_borrowers?.toString() || '0', icon: 'Users', color: 'bg-success', change: 0 },
              { label: 'Overdue Items', value: dashboardData.overdue?.overdue_count?.toString() || '0', icon: 'AlertTriangle', color: 'bg-error', change: 0 }
            ],
            data: [dashboardData]
          };
      }
    } catch (error) {
      console.error('Error generating real report data:', error);
      throw error;
    }
  };


  const handleExportReport = () => {
    if (!generatedReport) return;
    
    const dataStr = JSON.stringify(generatedReport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generatedReport?.title?.replace(/\s+/g, '_')}_${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    link?.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintReport = () => {
    if (!generatedReport) return;
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <SidebarNavigation 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <main className="lg:ml-sidebar pt-header">
        <div className="p-content-margin space-y-6">
          <BreadcrumbTrail />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
                Library Reports Center
              </h1>
              <p className="text-muted-foreground">
                Generate comprehensive reports and analytics for library operations and performance tracking.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <QuickStatsCard />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Report Categories - Left Column */}
            <div className="xl:col-span-1 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-semibold text-xl text-foreground">
                  Report Categories
                </h2>
                <span className="text-sm text-muted-foreground">
                  {reportCategories?.length} categories
                </span>
              </div>
              
              <div className="space-y-3">
                {reportCategories?.map((category) => (
                  <ReportCategoryCard
                    key={category?.id}
                    category={category}
                    onReportSelect={handleReportSelect}
                    selectedReport={selectedReport}
                  />
                ))}
              </div>
            </div>

            {/* Parameters & Report Viewer - Right Columns */}
            <div className="xl:col-span-2 space-y-6">
              {/* Parameters Panel */}
              <ReportParametersPanel
                selectedReport={selectedReport}
                parameters={reportParameters}
                onParameterChange={handleParameterChange}
                onGenerateReport={handleGenerateReport}
                isGenerating={isGenerating}
              />

              {/* Report Viewer */}
              <ReportViewer
                reportData={generatedReport}
                onExport={handleExportReport}
                onPrint={handlePrintReport}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LibraryReportsCenter;