import { useEffect, useState } from "react";
import {
  Copy,
  ExternalLink,
  Calendar,
  Link2,
  Sparkles,
  Loader2,
  AlertCircle,
  Globe,
  ChevronLeft,
  ChevronRight,
  MousePointer,
  Search,
  Home,
} from "lucide-react";
import { UrlService } from "../api/urlService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store/store";
import { useDebounce } from "../hooks/useDebounce";

interface UrlData {
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdDate: Date;
}

const UserUrlsPage = () => {
  const userId = useSelector((state: any) => state.auth.userId);
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedUrl, setCopiedUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const itemsPerPage = 5;
  const debouncedSearch = useDebounce(search, 500);

  const navigate = useNavigate();

  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      navigate("/login");
    }
  }, [auth.isLoggedIn]);

  useEffect(() => {
    if (!userId) return;
    fetchUrls();
  }, [userId, currentPage, debouncedSearch]);

  const fetchUrls = async () => {
    setLoading(true);
    setError("");
    try {
      const searchTerm = debouncedSearch ?? '';
      const res = await UrlService.fetchUrls(userId, currentPage, itemsPerPage, searchTerm);

      setUrls(res.data.urls);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch URLs");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedUrl(shortUrl);
      setTimeout(() => setCopiedUrl(""), 2000);
    } catch (err) {
      alert("Copied to clipboard!");
    }
  };

  const formatUrl = (url: string) => {
    return url.length > 50 ? url.substring(0, 50) + "..." : url;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-15 h-15 border-2 border-gray-500 rounded-3xl mb-6 shadow-2xl">
            <Link2 className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent mb-4">
              My Shortened URLs
            </h1>
            <p className="text-sm text-gray-300">
              Manage and track your shortened links
            </p>
          </div>
        </div>

        <div className="top-bar flex gap-x-2 items-center mb-5">
          <button
            className="text-gray-300 cursor-pointer px-3 py-2 border-2 border-gray-700 rounded-lg flex items-center justify-center"
            onClick={() => navigate("/")}
          >
            <Home size={20} className="text-gray-400 hover:text-white" />
          </button>
          <div className="input-div relative w-full">
            <input
              type="text"
              placeholder="Search urls..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-gray-300 cursor-text px-3 py-2 pr-10 border-2 border-gray-700 rounded-lg w-full focus:border-gray-500"
            />
            <Search className="absolute text-gray-500 right-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
              <p className="text-xl text-gray-300">Loading your URLs...</p>
              <div className="flex space-x-1 mt-4">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce animation-delay-400"></div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-3xl shadow-2xl p-8 mb-8">
            <div className="flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400 mr-4" />
              <div>
                <h3 className="text-xl font-semibold text-red-300 mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && urls.length === 0 && !error && (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-300 mb-4">
                No URLs yet
              </h3>
              <p className="text-gray-400 max-w-md">
                Start shortening your long URLs to see them appear here. Your
                shortened links will be beautifully organized and easy to
                manage.
              </p>
            </div>
          </div>
        )}

        {/* URLs */}
        {!loading && urls.length > 0 && (
          <div className="space-y-6 h-screen overflow-y-scroll">
            {urls.map((url, index) => (
              <>
                <div
                  key={url.shortUrl}
                  className="backdrop-blur-xl py-8 pr-6 pl-0 group"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "slideInUp 0.6s ease-out forwards",
                  }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                    {/* URL Info */}
                    <div className="flex-1 space-y-4">
                      {/* Original URL */}
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                          <Globe className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-300 mb-1">
                            Original URL
                          </p>
                          <a
                            href={url.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center group/link"
                          >
                            <span className="truncate">
                              {formatUrl(url.originalUrl)}
                            </span>
                            <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                          </a>
                        </div>
                      </div>

                      {/* Short URL */}
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-xl flex items-center justify-center">
                          <Link2 className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-300 mb-1">
                            Short URL
                          </p>
                          <div className="flex items-center space-x-3">
                            <a
                              href={url.shortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-300 hover:text-gray-200 transition-colors duration-200 flex items-center group/link"
                            >
                              <span className="font-mono">{url.shortUrl}</span>
                              <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Clicks */}
                      {url.clicks !== undefined && (
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center">
                            <MousePointer className="w-5 h-5 text-orange-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-300 mb-1">
                              Total Clicks
                            </p>
                            <p className="text-orange-400 text-sm font-semibold">
                              {url.clicks.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Created Date */}
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-300 mb-1">
                            Created
                          </p>
                          <p className="text-green-400 text-sm">
                            {new Date(url.createdDate).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Copy Button */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => copyToClipboard(url.shortUrl)}
                        className={`
                        relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 transform cursor-pointer
                        ${
                          copiedUrl === url.shortUrl
                            ? "text-white shadow-lg border-2 border-gray-400/20"
                            : "text-white shadow-lg hover:shadow-xl border-2 border-gray-400/20"
                        }
                      `}
                      >
                        <div className="flex items-center space-x-2">
                          {copiedUrl === url.shortUrl ? (
                            <>
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-5 h-5" />
                              <span>Copy</span>
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                <hr className="text-gray-400" />
              </>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && urls.length > 0 && totalPages > 1 && (
          <div className="mt-12">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="text-gray-300 text-sm">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, total)} of {total} URLs
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`
                      px-3 py-2 rounded-lg flex items-center space-x-1 transition-all duration-200
                      ${
                        currentPage === 1
                          ? "text-gray-500 cursor-not-allowed"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      }
                    `}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`
                          px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                          ${
                            page === currentPage
                              ? "bg-gray-600 text-white"
                              : "text-gray-300 hover:text-white hover:bg-gray-700"
                          }
                        `}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`
                      px-3 py-2 rounded-lg flex items-center space-x-1 transition-all duration-200
                      ${
                        currentPage === totalPages
                          ? "text-gray-500 cursor-not-allowed"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      }
                    `}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Footer */}
        {!loading && urls.length > 0 && (
          <div className="mt-12 text-center">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-6 py-3 inline-block">
              <p className="text-gray-300">
                Total URLs:{" "}
                <span className="text-gray-400 font-semibold">{total}</span>
                {totalPages > 1 && (
                  <>
                    {" • "}Page {currentPage} of {totalPages}
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserUrlsPage;
