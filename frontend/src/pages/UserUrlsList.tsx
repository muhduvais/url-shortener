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
} from "lucide-react";
import { UrlService } from "../api/urlService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store/store";

interface UrlItem {
  originalUrl: string;
  shortUrl: string;
  createdDate: string;
}

const UserUrlsPage = () => {
  const userId = useSelector((state: any) => state.auth.userId);
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedUrl, setCopiedUrl] = useState("");

  const navigate = useNavigate();

  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      navigate("/login");
    }
  }, [auth.isLoggedIn]);

  useEffect(() => {
    if (!userId) return;

    const fetchUrls = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await UrlService.fetchUrls(userId);
        console.log("Fetched URLs:", res.data);
        setUrls(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch URLs");
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, [userId]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-15 h-15 border-2 border-gray-500 rounded-3xl mb-6 shadow-2xl">
            <Link2 className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-4">
              My Shortened URLs
            </h1>
            <p className="text-sm text-gray-300">
              Manage and track your shortened links
            </p>
          </div>
        </div>

        <button
          className="text-gray-300 cursor-pointer px-3 py-1 mt-3 mb-6 border-2 border-gray-500 hover:border-gray-300 rounded-lg"
          onClick={() => navigate("/")}
        >
          <span className="text-purple-400 font-semibold">Go Home</span>
        </button>

        {/* Loading State */}
        {loading && (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
              <p className="text-xl text-gray-300">Loading your URLs...</p>
              <div className="flex space-x-1 mt-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce animation-delay-400"></div>
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
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mb-6">
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
          <div className="space-y-6">
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
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
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
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                          <Link2 className="w-5 h-5 text-purple-400" />
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
                              className="text-purple-400 hover:text-purple-300 transition-colors duration-200 flex items-center group/link"
                            >
                              <span className="font-mono">{url.shortUrl}</span>
                              <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Created Date */}
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
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

        {/* Stats Footer */}
        {!loading && urls.length > 0 && (
          <div className="mt-12 text-center">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-6 py-3 inline-block">
              <p className="text-gray-300">
                Total URLs:{" "}
                <span className="text-purple-400 font-semibold">
                  {urls.length}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserUrlsPage;
