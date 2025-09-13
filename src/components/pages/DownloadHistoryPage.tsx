import React, { useEffect, useState } from 'react';
import { ArrowLeft, Download, Calendar, Clock } from 'lucide-react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface DownloadHistoryPageProps {
  onBack: () => void;
}

interface Roast {
  id: string;
  roast_lines: string[];
  created_at: string;
  status: string;
  video_url?: string;
}

export const DownloadHistoryPage: React.FC<DownloadHistoryPageProps> = ({ onBack }) => {
  const [roasts, setRoasts] = useState<Roast[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRoasts();
  }, []);

  const fetchRoasts = async () => {
    try {
      const { data, error } = await supabase
        .from('roasts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoasts(data || []);
    } catch (error) {
      console.error('Error fetching roasts:', error);
      toast({
        title: "Error",
        description: "Failed to load download history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (roast: Roast) => {
    try {
      let downloadSuccess = false;
      
      if (roast.video_url) {
        // For video downloads, fetch and create blob for reliable download
        const response = await fetch(roast.video_url);
        if (!response.ok) throw new Error('Failed to fetch video');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `roast-video-${new Date().toISOString().split('T')[0]}-${roast.id.slice(0, 8)}.mp4`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        // Clean up after ensuring download starts
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
        
        downloadSuccess = true;
      } else if (roast.roast_lines && roast.roast_lines.length > 0) {
        // Create a properly formatted text file with roast lines
        const content = `Hindi Roast Lines\n${'='.repeat(50)}\n\nGenerated on: ${new Date(roast.created_at).toLocaleString()}\n\n${roast.roast_lines.map((line, index) => `${index + 1}. ${line}`).join('\n\n')}\n\n${'='.repeat(50)}\nTotal Lines: ${roast.roast_lines.length}`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hindi-roast-${new Date().toISOString().split('T')[0]}-${roast.id.slice(0, 8)}.txt`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        // Clean up after ensuring download starts
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
        
        downloadSuccess = true;
      } else {
        throw new Error('No content available to download');
      }
      
      if (downloadSuccess) {
        toast({
          title: "Download Complete! ✅",
          description: "Your roast file has been successfully saved to your device.",
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Unable to download the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 px-6 py-8 pb-32">
        <div className="flex items-center mb-6">
          <GlassButton variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </GlassButton>
        </div>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-8 pb-32">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <GlassButton variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </GlassButton>
        </div>

        <GlassCard variant="elevated" className="mb-6">
          <GlassCardHeader>
            <GlassCardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Download History
            </GlassCardTitle>
          </GlassCardHeader>
        </GlassCard>

        {roasts.length === 0 ? (
          <GlassCard variant="strong">
            <GlassCardContent className="text-center p-8">
              <div className="text-muted-foreground">
                No roasts generated yet. Create your first roast to see it here!
              </div>
            </GlassCardContent>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {roasts.map((roast) => (
              <GlassCard key={roast.id} variant="strong">
                <GlassCardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(roast.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(roast.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    {roast.roast_lines.slice(0, 2).map((line, index) => (
                      <div key={index} className="p-2 bg-black/20 rounded-lg border border-yellow-400/30">
                        <p className="text-sm text-yellow-400 font-semibold text-center">
                          "{line}"
                        </p>
                      </div>
                    ))}
                    {roast.roast_lines.length > 2 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{roast.roast_lines.length - 2} more caption lines...
                      </p>
                    )}
                  </div>

                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() => handleDownload(roast)}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </GlassButton>
                </GlassCardContent>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};