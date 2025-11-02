'use client'

import { useState } from 'react'
import { Upload, Video, Volume2, Facebook, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [scriptText, setScriptText] = useState('')
  const [fbAccessToken, setFbAccessToken] = useState('')
  const [fbPageId, setFbPageId] = useState('')
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [videoPreview, setVideoPreview] = useState<string | null>(null)

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoPreview(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!videoFile || !scriptText || !fbAccessToken || !fbPageId) {
      setStatus('error')
      setMessage('कृपया सभी फ़ील्ड भरें (Please fill all fields)')
      return
    }

    setStatus('processing')
    setMessage('वीडियो प्रोसेस हो रहा है... (Processing video...)')

    try {
      const formData = new FormData()
      formData.append('video', videoFile)
      formData.append('script', scriptText)
      formData.append('accessToken', fbAccessToken)
      formData.append('pageId', fbPageId)

      const response = await fetch('/api/process-video', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(`वीडियो सफलतापूर्वक अपलोड हो गया! (Video uploaded successfully!) ID: ${data.videoId}`)
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      setStatus('error')
      setMessage(`त्रुटि: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Facebook className="w-10 h-10 text-blue-600" />
            Facebook Hindi Video Uploader
          </h1>
          <p className="text-gray-600">AI-powered video upload with Hindi voiceover</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Video Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Video className="inline w-5 h-5 mr-2" />
                Upload Video (वीडियो अपलोड करें)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">
                    {videoFile ? videoFile.name : 'Click to upload video'}
                  </p>
                </label>
              </div>
              {videoPreview && (
                <video
                  src={videoPreview}
                  controls
                  className="mt-4 w-full max-h-64 rounded-lg"
                />
              )}
            </div>

            {/* Script Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Volume2 className="inline w-5 h-5 mr-2" />
                Hindi Script (हिंदी स्क्रिप्ट)
              </label>
              <textarea
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder="अपनी हिंदी स्क्रिप्ट यहाँ लिखें... (Enter your Hindi script here...)"
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Facebook Access Token */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Facebook Access Token
              </label>
              <input
                type="password"
                value={fbAccessToken}
                onChange={(e) => setFbAccessToken(e.target.value)}
                placeholder="Enter your Facebook Access Token"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Facebook Page ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Facebook Page ID
              </label>
              <input
                type="text"
                value={fbPageId}
                onChange={(e) => setFbPageId(e.target.value)}
                placeholder="Enter your Facebook Page ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'processing'}
              className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'processing' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload to Facebook
                </>
              )}
            </button>
          </form>

          {/* Status Messages */}
          {status !== 'idle' && (
            <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${
              status === 'success' ? 'bg-green-50 text-green-800' :
              status === 'error' ? 'bg-red-50 text-red-800' :
              'bg-blue-50 text-blue-800'
            }`}>
              {status === 'success' && <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />}
              {status === 'error' && <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />}
              {status === 'processing' && <Loader2 className="w-6 h-6 flex-shrink-0 mt-0.5 animate-spin" />}
              <p>{message}</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Instructions (निर्देश)</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Upload your video file (अपनी वीडियो फ़ाइल अपलोड करें)</li>
            <li>Enter Hindi script for AI voiceover (AI वॉयसओवर के लिए हिंदी स्क्रिप्ट दर्ज करें)</li>
            <li>Get Facebook Access Token from <a href="https://developers.facebook.com/tools/explorer/" target="_blank" className="text-blue-600 hover:underline">Graph API Explorer</a></li>
            <li>Find your Page ID in Facebook Page Settings</li>
            <li>Click Upload to process and post to Facebook</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
