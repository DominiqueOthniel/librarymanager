import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportViewer = ({ reportData, onExport, onPrint }) => {
  if (!reportData) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="text-center text-muted-foreground">
          <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No Report Generated</p>
          <p className="text-sm">Configure parameters and generate a report to view results here.</p>
        </div>
      </div>
    );
  }

  const { summary, data, charts } = reportData;

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Report Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="font-heading font-semibold text-xl text-foreground mb-1">
            {reportData?.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            Generated on {new Date()?.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
          >
            Export
          </Button>
          <Button
            variant="outline"
            iconName="Printer"
            iconPosition="left"
            onClick={onPrint}
          >
            Print
          </Button>
        </div>
      </div>
      {/* Summary Statistics */}
      {summary && (
        <div className="p-6 border-b border-border">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {summary?.map((stat, index) => (
              <div key={index} className="bg-muted rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${stat?.color}`}>
                    <Icon name={stat?.icon} size={20} color="white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
                    <p className="text-sm text-muted-foreground">{stat?.label}</p>
                  </div>
                </div>
                {stat?.change && (
                  <div className="mt-2 flex items-center space-x-1">
                    <Icon 
                      name={stat?.change > 0 ? 'TrendingUp' : 'TrendingDown'} 
                      size={14} 
                      className={stat?.change > 0 ? 'text-success' : 'text-error'}
                    />
                    <span className={`text-xs font-medium ${stat?.change > 0 ? 'text-success' : 'text-error'}`}>
                      {Math.abs(stat?.change)}% from last period
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Charts Section */}
      {charts && charts?.length > 0 && (
        <div className="p-6 border-b border-border">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-4">Visual Analysis</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {charts?.map((chart, index) => (
              <div key={index} className="bg-muted rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-3">{chart?.title}</h4>
                <div className="h-48 flex items-center justify-center bg-background rounded border border-border">
                  <div className="text-center text-muted-foreground">
                    <Icon name="BarChart3" size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{chart?.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Data Table */}
      {data && Array.isArray(data) && data.length > 0 && data[0] && typeof data[0] === 'object' && (
        <div className="p-6">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-4">Detailed Data</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {Object.keys(data[0]).map((header) => (
                    <th key={header} className="text-left py-3 px-4 font-medium text-foreground">
                      {header?.charAt(0)?.toUpperCase() + header?.slice(1)?.replace(/([A-Z])/g, ' $1')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.map((row, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted library-transition">
                    {Object.values(row)?.map((cell, cellIndex) => (
                      <td key={cellIndex} className="py-3 px-4 text-sm text-muted-foreground">
                        {typeof cell === 'boolean' ? (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            cell ? 'bg-success text-success-foreground' : 'bg-error text-error-foreground'
                          }`}>
                            {cell ? 'Yes' : 'No'}
                          </span>
                        ) : cell !== null && typeof cell === 'object' ? (
                          JSON.stringify(cell)
                        ) : (
                          String(cell ?? '')
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportViewer;