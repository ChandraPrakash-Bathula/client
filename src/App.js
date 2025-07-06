import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  Upload,
  ArrowRight,
  Check,
  X,
  Film,
  Sparkles,
  Zap,
} from "lucide-react";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fromFormat, setFromFormat] = useState("");
  const [toFormat, setToFormat] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const supportedFormats = useMemo(
    () => [
      "mp4",
      "mkv",
      "mov",
      "avi",
      "webm",
      "flv",
      "wmv",
      "m4v",
      "3gp",
      "ogv",
    ],
    []
  );

  const formatOptions = useMemo(
    () => supportedFormats.map((f) => ({ value: f, label: f.toUpperCase() })),
    [supportedFormats]
  );

  const handleFile = useCallback(
    (file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (!supportedFormats.includes(fileExtension)) {
        setErrorMessage(
          `Unsupported file format: .${fileExtension.toUpperCase()}. Please select a supported video file.`
        );
        setShowError(true);
        setShowSuccess(false);
        return;
      }
      setSelectedFile(file);
      setFromFormat(fileExtension);
      setShowError(false);
      setShowSuccess(false);
    },
    [supportedFormats]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) handleFile(files[0]);
    },
    [handleFile]
  );

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024,
      sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // ✅ REPLACEMENT: Use your real backend conversion here!
  const handleConvert = async () => {
    if (!selectedFile || !toFormat) {
      setErrorMessage("Please select a file and output format.");
      setShowError(true);
      return;
    }
    if (fromFormat === toFormat) {
      setErrorMessage("Source and target formats cannot be the same.");
      setShowError(true);
      return;
    }

    setIsConverting(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("to_format", toFormat);

    try {
      let fakeProgress = 0;
      const interval = setInterval(() => {
        fakeProgress += Math.random() * 10;
        if (fakeProgress >= 90) clearInterval(interval);
        setProgress(Math.min(fakeProgress, 90));
      }, 200);

      const response = await fetch("https://server-qm7m.onrender.com/convert", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);

      if (!response.ok) throw new Error("Conversion failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = selectedFile.name.split(".")[0] + "." + toFormat;
      downloadLink.click();
      URL.revokeObjectURL(url);

      setProgress(100);
      setShowSuccess(true);
      setShowError(false);
    } catch (err) {
      setErrorMessage(err.message);
      setShowError(true);
      setShowSuccess(false);
    } finally {
      setIsConverting(false);
      setTimeout(() => {
        resetForm();
      }, 3000);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setFromFormat("");
    setToFormat("");
    setIsConverting(false);
    setProgress(0);
    setShowSuccess(false);
    setShowError(false);
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const canConvert = selectedFile && toFormat && fromFormat !== toFormat;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-700/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-slate-700/20 via-transparent to-transparent"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-gray-800/20 to-slate-800/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-slate-800/20 to-gray-800/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative w-full max-w-2xl">
        {/* Main Container */}
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/50 p-8 relative overflow-hidden">
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent rounded-3xl"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-gray-700 to-slate-700 rounded-2xl shadow-lg">
                  <Film className="w-8 h-8 text-white" />
                </div>
                <Sparkles className="w-6 h-6 text-gray-300 animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-slate-200 bg-clip-text text-transparent mb-2">
                Video Converter Pro
              </h1>
              <p className="text-white/60 text-lg font-medium">
                Transform your videos with precision
              </p>
            </div>

            {/* Error Message */}
            {showError && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-2xl backdrop-blur-sm animate-pulse">
                <div className="flex items-center gap-3">
                  <X className="w-5 h-5 text-red-400" />
                  <p className="text-red-200 font-medium">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {showSuccess && (
              <div className="mb-6 p-4 bg-green-900/30 border border-green-500/30 rounded-2xl backdrop-blur-sm animate-pulse">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <p className="text-green-200 font-medium">
                    Video converted successfully to {toFormat.toUpperCase()}!
                    Download started.
                  </p>
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div className="mb-8">
              <div
                className={`relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-500 ease-out group ${
                  isDragOver
                    ? "border-gray-400/60 bg-gray-800/20 scale-105 shadow-lg shadow-gray-500/20"
                    : "border-white/20 bg-black/20 hover:border-gray-400/40 hover:bg-gray-800/20 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/10"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/10 to-slate-700/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="mb-6">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-r from-gray-700 to-slate-700 rounded-full flex items-center justify-center shadow-lg shadow-gray-500/25 group-hover:shadow-gray-500/40 group-hover:scale-110 transition-all duration-500">
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-2xl font-bold text-white mb-2">
                      Drop your video here
                    </p>
                    <p className="text-white/60 text-lg">
                      or click to browse your files
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2">
                    {supportedFormats.slice(0, 5).map((format) => (
                      <span
                        key={format}
                        className="px-3 py-1 bg-black/30 rounded-full text-white/70 text-sm font-medium border border-white/20"
                      >
                        {format.toUpperCase()}
                      </span>
                    ))}
                    <span className="px-3 py-1 bg-black/30 rounded-full text-white/70 text-sm font-medium border border-white/20">
                      +{supportedFormats.length - 5} more
                    </span>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Conversion Section */}
            {selectedFile && (
              <div className="mb-8 animate-in slide-in-from-bottom-4 duration-500">
                {/* File Info */}
                <div className="mb-6 p-6 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-gray-700 to-slate-700 rounded-xl shadow-lg">
                      <Film className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">
                        {selectedFile.name}
                      </p>
                      <p className="text-white/60">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Format Selection */}
                <div className="mb-6">
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <label className="block text-white/80 font-semibold mb-3">
                        From
                      </label>
                      <div className="p-4 bg-black/20 rounded-xl border border-white/10 backdrop-blur-sm">
                        <p className="text-white font-bold text-lg">
                          {fromFormat.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 mt-8">
                      <div className="p-3 bg-gradient-to-r from-gray-700 to-slate-700 rounded-full shadow-lg">
                        <ArrowRight className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="block text-white/80 font-semibold mb-3">
                        To
                      </label>
                      <select
                        value={toFormat}
                        onChange={(e) => setToFormat(e.target.value)}
                        className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white font-medium backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 transition-all duration-300"
                      >
                        <option value="">Select format</option>
                        {formatOptions.map((format) => (
                          <option
                            key={format.value}
                            value={format.value}
                            className="bg-slate-800"
                          >
                            {format.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Convert Button */}
                <button
                  onClick={handleConvert}
                  disabled={!canConvert || isConverting}
                  className={`w-full p-6 rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden group ${
                    canConvert && !isConverting
                      ? "bg-gradient-to-r from-gray-700 to-slate-700 text-white hover:from-gray-600 hover:to-slate-600 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25"
                      : "bg-black/20 text-white/50 cursor-not-allowed"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {isConverting ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Converting...
                      </>
                    ) : (
                      <>
                        <Zap className="w-6 h-6" />
                        {canConvert
                          ? `Convert to ${toFormat.toUpperCase()}`
                          : "Select output format"}
                      </>
                    )}
                  </div>
                </button>
              </div>
            )}

            {/* Progress Section */}
            {isConverting && (
              <div className="mb-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="p-6 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80 font-medium">
                        Converting...
                      </span>
                      <span className="text-white font-bold">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gray-600 to-slate-600 rounded-full transition-all duration-300 ease-out shadow-lg shadow-gray-500/25"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Supported Formats */}
            <div className="p-6 bg-black/10 rounded-2xl border border-white/10 backdrop-blur-sm">
              <h3 className="text-white/80 font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Supported Video Formats
              </h3>
              <div className="flex flex-wrap gap-2">
                {supportedFormats.map((format) => (
                  <span
                    key={format}
                    className="px-3 py-2 bg-gradient-to-r from-gray-700/30 to-slate-700/30 rounded-lg text-white/80 text-sm font-medium border border-white/10"
                  >
                    {format.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
