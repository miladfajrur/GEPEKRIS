import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { clearCacheAndHardReload } from './lib/cacheCleaner';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in GEPEKRIS Tretes App:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearStorageAndReload = () => {
    clearCacheAndHardReload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex items-center justify-center p-6">
          <div className="bg-white max-w-lg w-full rounded-2xl p-8 border border-stone-200 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold font-serif text-stone-900">
                GEPEKRIS TRETES
              </h2>
              <p className="text-sm text-stone-600">
                Terjadi sedikit kendala saat memuat tampilan di peramban Anda. Silakan muat ulang halaman.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-left text-xs font-mono text-stone-700 overflow-x-auto max-h-32">
                {this.state.error.message || 'Unknown error'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                onClick={this.handleReload}
                className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 text-white flex items-center justify-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Muat Ulang Halaman</span>
              </Button>
              <Button
                onClick={this.handleClearStorageAndReload}
                variant="outline"
                className="w-full sm:w-auto border-stone-300 text-stone-700 hover:bg-stone-50 flex items-center justify-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Bersihkan Cache & Buka Ulang</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
