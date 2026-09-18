import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Camera,
  Droplets,
  Zap,
  Bus,
  ShieldCheck,
  Building,
  ArrowRight,
  RefreshCw,
  Mic,
  MicOff,
  Volume2,
  Radio,
  Check,
  RotateCcw,
  AlertCircle,
  Languages,
} from 'lucide-react';
import { Listing } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface CaretakerIntakeViewProps {
  onListingCreated: (newListing: Listing) => void;
}

export const CaretakerIntakeView: React.FC<CaretakerIntakeViewProps> = ({
  onListingCreated,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successListing, setSuccessListing] = useState<Listing | null>(null);

  // Form State
  const [estate, setEstate] = useState('Roysambu');
  const [buildingName, setBuildingName] = useState('');
  const [unitType, setUnitType] = useState('1-bedroom');
  const [monthlyRent, setMonthlyRent] = useState(14000);
  const [caretakerName, setCaretakerName] = useState('');
  const [caretakerPhone, setCaretakerPhone] = useState('+254 7');
  const [nearestStage, setNearestStage] = useState('');
  const [walkMinutes, setWalkMinutes] = useState(4);
  const [waterSource, setWaterSource] = useState('24/7 Borehole');
  const [waterNotes, setWaterNotes] = useState('24/7 borehole supply with 10,000L backup tanks');
  const [powerType, setPowerType] = useState('Individual KPLC Token');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Voice Dictation States
  const [dictationLang, setDictationLang] = useState<'en-KE' | 'sw-KE' | 'en-US'>('en-KE');
  const [isParsingVoice, setIsParsingVoice] = useState(false);
  const [voiceParsedSummary, setVoiceParsedSummary] = useState<string | null>(null);
  const [voiceFilledFields, setVoiceFilledFields] = useState<Record<string, boolean>>({});
  const [activeFieldDictation, setActiveFieldDictation] = useState<string | null>(null);

  // Master Voice Speech Recognition
  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  } = useSpeechRecognition({ lang: dictationLang });

  // Field-level voice recognition handler
  useEffect(() => {
    if (!activeFieldDictation) return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;

    let localRec: any = null;
    try {
      localRec = new SpeechRec();
      localRec.continuous = false;
      localRec.interimResults = true;
      localRec.lang = dictationLang;

      localRec.onresult = (event: any) => {
        let finalStr = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalStr += event.results[i][0].transcript;
          }
        }
        if (finalStr.trim()) {
          const val = finalStr.trim();
          switch (activeFieldDictation) {
            case 'buildingName':
              setBuildingName(val);
              setVoiceFilledFields((prev) => ({ ...prev, buildingName: true }));
              break;
            case 'caretakerName':
              setCaretakerName(val);
              setVoiceFilledFields((prev) => ({ ...prev, caretakerName: true }));
              break;
            case 'caretakerPhone':
              setCaretakerPhone(val);
              setVoiceFilledFields((prev) => ({ ...prev, caretakerPhone: true }));
              break;
            case 'nearestStage':
              setNearestStage(val);
              setVoiceFilledFields((prev) => ({ ...prev, nearestStage: true }));
              break;
            case 'waterNotes':
              setWaterNotes(val);
              setVoiceFilledFields((prev) => ({ ...prev, waterNotes: true }));
              break;
            case 'monthlyRent': {
              const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
              if (!isNaN(num) && num > 0) {
                setMonthlyRent(num);
                setVoiceFilledFields((prev) => ({ ...prev, monthlyRent: true }));
              }
              break;
            }
          }
        }
      };

      localRec.onerror = () => {
        setActiveFieldDictation(null);
      };

      localRec.onend = () => {
        setActiveFieldDictation(null);
      };

      localRec.start();
    } catch (err) {
      console.warn('Field recognition error:', err);
      setActiveFieldDictation(null);
    }

    return () => {
      if (localRec) {
        try {
          localRec.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [activeFieldDictation, dictationLang]);

  // Sample pre-loaded real Nairobi apartment photos for fast testing
  const samplePhotos = [
    {
      title: 'Modern Tiled 1-Bed',
      url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Executive Bedsitter',
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: '2-Bedroom Family Flat',
      url: 'https://images.unsplash.com/photo-1502005229762-ee1b2b93e30f?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // Preset Caretaker Voice Dictations (Kenyan street contexts)
  const sampleVoicePrompts = [
    {
      label: 'Sheng / Roysambu',
      text: 'Hii ni Sunrise Heights Roysambu Lumumba drive, ni one-bedroom rent ni fourteen thousand, maji iko borehole 24/7 na reserve tanks, stima ni token ya personal KPLC, 4 mins hadi TRM stage, naitwa Caretaker Mwangi namba 0712345678',
    },
    {
      label: 'Swahili / Wendani',
      text: 'Apartment inaitwa Wendani Plaza kule Kahawa Wendani, ni bedsitter safi yenye tiles, kodi ni shilingi elfu kumi kila mwezi, maji ya borehole na kanjo, stima ni ya kibinafsi, dakika mbili hadi Magunas stage, caretaker ni Dennis 0722112233',
    },
    {
      label: 'English / Ruaka',
      text: 'Ruaka Joyland Executive Courts 2 bedroom apartment going for 24000 KES. Water is 24/7 borehole with rooftop tanks, personal KPLC prepaid meter, 5 minutes walk to Quickmart stage. Call Caretaker Peter 0798765432',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Trigger Voice Parsing & Auto-Fill Form
  const handleParseVoiceTranscript = async (textToParse?: string) => {
    const rawText = (textToParse || transcript).trim();
    if (!rawText) return;

    setIsParsingVoice(true);
    try {
      const response = await fetch('/api/caretaker/parse-dictation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: rawText }),
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.data;

        if (data.estate) setEstate(data.estate);
        if (data.buildingName) setBuildingName(data.buildingName);
        if (data.unitType) setUnitType(data.unitType);
        if (data.monthlyRent) setMonthlyRent(Number(data.monthlyRent));
        if (data.caretakerName) setCaretakerName(data.caretakerName);
        if (data.caretakerPhone) setCaretakerPhone(data.caretakerPhone);
        if (data.waterSource) setWaterSource(data.waterSource);
        if (data.waterNotes) setWaterNotes(data.waterNotes);
        if (data.powerType) setPowerType(data.powerType);
        if (data.nearestStage) setNearestStage(data.nearestStage);
        if (data.walkMinutes) setWalkMinutes(Number(data.walkMinutes));

        setVoiceParsedSummary(data.summary || 'Listing details successfully extracted from your voice!');
        setVoiceFilledFields({
          estate: true,
          buildingName: true,
          unitType: true,
          monthlyRent: true,
          caretakerName: true,
          caretakerPhone: true,
          waterSource: true,
          waterNotes: true,
          powerType: true,
          nearestStage: true,
          walkMinutes: true,
        });

        // Automatically move to step 2 if still in step 1 to inspect ground facts
        if (step === 1) {
          setStep(2);
        }
      }
    } catch (err) {
      console.error('Failed to parse voice transcript:', err);
    } finally {
      setIsParsingVoice(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/caretaker/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estate,
          buildingName: buildingName || 'Sunrise Heights Court',
          caretakerName: caretakerName || 'Caretaker Dennis',
          caretakerPhone: caretakerPhone || '+254 712 345 678',
          unitType,
          monthlyRent: Number(monthlyRent),
          waterSource,
          waterNotes,
          powerType,
          walkMinutesToStage: Number(walkMinutes),
          nearestStage: nearestStage || `${estate} Stage`,
          imageBase64: previewImage,
        }),
      });

      const data = await response.json();
      if (data.listing) {
        setSuccessListing(data.listing);
        onListingCreated(data.listing);
        setStep(3);
      }
    } catch (error) {
      console.error('Failed to submit caretaker intake:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit']">
                  Caretaker &amp; Landlord Intake Assistant
                </h2>
                <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                  Agent A
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Rapid vacancy onboarding with voice-to-text dictation, vision pre-screening, and 3-day WhatsApp verification.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold self-start sm:self-auto">
            <Mic className="w-3.5 h-3.5 text-emerald-600" />
            <span>Voice Dictation Ready</span>
          </div>
        </div>

        {/* Stepper Progress */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
          <div
            className={`p-2.5 rounded-xl border text-center font-semibold ${
              step >= 1 ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            1. Photo &amp; Room Type
          </div>
          <div
            className={`p-2.5 rounded-xl border text-center font-semibold ${
              step >= 2 ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            2. Ground Reality &amp; Terms
          </div>
          <div
            className={`p-2.5 rounded-xl border text-center font-semibold ${
              step === 3 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            3. Verified &amp; Live
          </div>
        </div>
      </div>

      {/* MASTER VOICE-TO-TEXT DICTATION CARD ("Sema Keja Yako") */}
      {step < 3 && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-5 text-white shadow-md border border-slate-700/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isListening ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {isListening ? <Radio className="w-5 h-5 text-white animate-spin" /> : <Mic className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-2 font-['Outfit']">
                  <span>Voice Dictation Mode</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-white/10 text-emerald-300">
                    Sheng • Swahili • English
                  </span>
                </h4>
                <p className="text-xs text-slate-300">
                  Dictate the listing hands-free while inspecting keys or showing a house.
                </p>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 text-xs bg-white/10 p-1 rounded-xl border border-white/15">
              <Languages className="w-3.5 h-3.5 text-slate-300 ml-1.5" />
              {(
                [
                  { code: 'en-KE', label: 'Kenyan EN' },
                  { code: 'sw-KE', label: 'Swahili / Sheng' },
                  { code: 'en-US', label: 'Standard EN' },
                ] as const
              ).map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setDictationLang(l.code)}
                  className={`px-2 py-1 rounded-lg font-semibold transition-colors cursor-pointer text-[11px] ${
                    dictationLang === l.code
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Input Action Bar */}
          <div className="bg-black/30 rounded-xl p-4 border border-white/10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Main Mic Push-to-Talk / Toggle Button */}
                <button
                  id="caretaker-voice-mic-btn"
                  type="button"
                  onClick={() => {
                    if (isListening) {
                      stopListening();
                    } else {
                      startListening(dictationLang);
                    }
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md ${
                    isListening
                      ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-500/30'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span>Stop Listening</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Start Voice Dictation</span>
                    </>
                  )}
                </button>

                {/* Live Soundwave Animation */}
                {isListening && (
                  <div className="flex items-center gap-1 h-5 px-2">
                    <span className="w-1 bg-emerald-400 rounded-full h-3 animate-pulse"></span>
                    <span className="w-1 bg-emerald-400 rounded-full h-5 animate-pulse delay-75"></span>
                    <span className="w-1 bg-emerald-400 rounded-full h-2 animate-pulse delay-150"></span>
                    <span className="w-1 bg-emerald-400 rounded-full h-4 animate-pulse"></span>
                    <span className="text-xs text-emerald-300 font-medium ml-1">Listening now...</span>
                  </div>
                )}
              </div>

              {/* Action buttons when transcript exists */}
              {(transcript || interimTranscript) && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetTranscript}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs transition-colors"
                    title="Clear transcript"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id="voice-autofill-btn"
                    type="button"
                    disabled={isParsingVoice || (!transcript && !interimTranscript)}
                    onClick={() => handleParseVoiceTranscript(transcript || interimTranscript)}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    {isParsingVoice ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Extracting Ground Facts...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Auto-Fill Form from Voice</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Real-Time Transcript Display Area */}
            <div className="min-h-[52px] p-3 rounded-lg bg-slate-950/60 border border-white/10 text-xs font-mono">
              {transcript || interimTranscript ? (
                <p className="text-slate-100 leading-relaxed">
                  <span>{transcript}</span>
                  {interimTranscript && (
                    <span className="text-emerald-400 italic"> {interimTranscript}</span>
                  )}
                </p>
              ) : (
                <p className="text-slate-500 italic">
                  {isListening
                    ? 'Speak now: Say apartment name, room type, rent, water, token meter, and caretaker number...'
                    : 'Click "Start Voice Dictation" or tap one of the sample caretaker recordings below to test.'}
                </p>
              )}
            </div>

            {/* Error banner if browser blocked mic */}
            {speechError && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{speechError}</span>
              </div>
            )}

            {/* Browser Support Check Notice */}
            {!isSupported && (
              <div className="p-2.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  Web Speech API is unavailable in this environment. You can click any sample caretaker voice prompt below to test auto-filling!
                </span>
              </div>
            )}

            {/* Sample Voice Prompts for instant testing */}
            <div className="pt-1 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Or test instant audio transcript:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sampleVoicePrompts.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTranscript(sample.text);
                      handleParseVoiceTranscript(sample.text);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3 text-emerald-400" />
                    <span>{sample.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Extraction Success Confirmation */}
            {voiceParsedSummary && (
              <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2 animate-in fade-in duration-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-emerald-300 font-bold mb-0.5">
                    Voice Intel Extracted:
                  </strong>
                  <p className="text-slate-200">{voiceParsedSummary}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 1: Photo Upload & AI Vision Screening */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Step 1: Upload Live Photo or Choose a Sample Room
              </h3>
              <p className="text-xs text-slate-500">
                Our multimodal computer vision automatically scans tiles, finishes, and room layout.
              </p>
            </div>
            {voiceFilledFields.unitType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                <Mic className="w-3 h-3" />
                <span>Voice Auto-Filled</span>
              </span>
            )}
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
            {previewImage ? (
              <div className="space-y-4">
                <img
                  src={previewImage}
                  alt="Room Preview"
                  className="max-h-60 mx-auto rounded-xl object-cover shadow-md"
                />
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="text-xs text-rose-600 font-semibold hover:underline cursor-pointer"
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <div>
                <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  Drag &amp; drop live unit photo, or click to upload
                </p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                <label className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer hover:bg-emerald-700 transition-colors">
                  <Camera className="w-4 h-4" />
                  <span>Choose From Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Preset Photo Selection */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Or pick a fast sample Nairobi room:
            </p>
            <div className="grid grid-cols-3 gap-3">
              {samplePhotos.map((photo, i) => (
                <div
                  key={i}
                  onClick={() => setPreviewImage(photo.url)}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all group ${
                    previewImage === photo.url
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                      : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                  />
                  <p className="text-[11px] font-semibold text-slate-700 p-1.5 bg-slate-50 text-center">
                    {photo.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Basic Estate & Room Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Estate / Area
                </label>
                {voiceFilledFields.estate && (
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                    <Mic className="w-2.5 h-2.5" /> Voice
                  </span>
                )}
              </div>
              <select
                value={estate}
                onChange={(e) => setEstate(e.target.value)}
                className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-sm text-slate-800 ${
                  voiceFilledFields.estate ? 'border-emerald-500 bg-emerald-50/40 font-bold' : 'border-slate-300'
                }`}
              >
                <option value="Roysambu">Roysambu</option>
                <option value="Kahawa Wendani">Kahawa Wendani</option>
                <option value="Ruaka">Ruaka</option>
                <option value="Kilimani">Kilimani</option>
                <option value="Zimmerman">Zimmerman</option>
                <option value="South B">South B</option>
                <option value="Kasarani">Kasarani</option>
                <option value="Ngong Road">Ngong Road</option>
                <option value="Westlands">Westlands</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Classified Room Type
                </label>
                {voiceFilledFields.unitType && (
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                    <Mic className="w-2.5 h-2.5" /> Voice
                  </span>
                )}
              </div>
              <select
                value={unitType}
                onChange={(e) => setUnitType(e.target.value)}
                className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-sm text-slate-800 ${
                  voiceFilledFields.unitType ? 'border-emerald-500 bg-emerald-50/40 font-bold' : 'border-slate-300'
                }`}
              >
                <option value="bedsitter">Bedsitter</option>
                <option value="1-bedroom">1-Bedroom</option>
                <option value="2-bedroom">2-Bedroom</option>
                <option value="single-room">Single Room</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              id="intake-step1-next"
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>Next: Ground Reality Check</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Ground Reality & Terms Form */}
      {step === 2 && (
        <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Step 2: Hyper-Local Ground Facts &amp; Contact Details
              </h3>
              <p className="text-xs text-slate-500">
                Review extracted facts or click any field&apos;s microphone to dictate changes.
              </p>
            </div>

            {Object.keys(voiceFilledFields).length > 0 && (
              <span className="self-start sm:self-auto px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Voice Auto-Filled</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Building Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Building / Apartment Name
                </label>
                <button
                  type="button"
                  title="Dictate Building Name"
                  onClick={() =>
                    setActiveFieldDictation(activeFieldDictation === 'buildingName' ? null : 'buildingName')
                  }
                  className={`p-1 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                    activeFieldDictation === 'buildingName'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800'
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  <span className="text-[10px] font-semibold">
                    {activeFieldDictation === 'buildingName' ? 'Listening...' : 'Speak'}
                  </span>
                </button>
              </div>
              <input
                type="text"
                required
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
                placeholder="e.g. TRM View Courts"
                className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-sm text-slate-800 ${
                  activeFieldDictation === 'buildingName'
                    ? 'border-rose-500 ring-2 ring-rose-300'
                    : voiceFilledFields.buildingName
                    ? 'border-emerald-500 bg-emerald-50/20'
                    : 'border-slate-300'
                }`}
              />
            </div>

            {/* Monthly Rent (KES) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Monthly Rent (KES)
                </label>
                <button
                  type="button"
                  title="Dictate Rent"
                  onClick={() =>
                    setActiveFieldDictation(activeFieldDictation === 'monthlyRent' ? null : 'monthlyRent')
                  }
                  className={`p-1 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                    activeFieldDictation === 'monthlyRent'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800'
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  <span className="text-[10px] font-semibold">
                    {activeFieldDictation === 'monthlyRent' ? 'Listening...' : 'Speak'}
                  </span>
                </button>
              </div>
              <input
                type="number"
                required
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-sm text-slate-800 font-bold ${
                  activeFieldDictation === 'monthlyRent'
                    ? 'border-rose-500 ring-2 ring-rose-300'
                    : voiceFilledFields.monthlyRent
                    ? 'border-emerald-500 bg-emerald-50/20'
                    : 'border-slate-300'
                }`}
              />
            </div>

            {/* Caretaker Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Caretaker / Landlord Name
                </label>
                <button
                  type="button"
                  title="Dictate Caretaker Name"
                  onClick={() =>
                    setActiveFieldDictation(activeFieldDictation === 'caretakerName' ? null : 'caretakerName')
                  }
                  className={`p-1 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                    activeFieldDictation === 'caretakerName'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800'
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  <span className="text-[10px] font-semibold">
                    {activeFieldDictation === 'caretakerName' ? 'Listening...' : 'Speak'}
                  </span>
                </button>
              </div>
              <input
                type="text"
                required
                value={caretakerName}
                onChange={(e) => setCaretakerName(e.target.value)}
                placeholder="e.g. Mwangi (Caretaker)"
                className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-sm text-slate-800 ${
                  activeFieldDictation === 'caretakerName'
                    ? 'border-rose-500 ring-2 ring-rose-300'
                    : voiceFilledFields.caretakerName
                    ? 'border-emerald-500 bg-emerald-50/20'
                    : 'border-slate-300'
                }`}
              />
            </div>

            {/* Caretaker Phone / WhatsApp */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Phone Number (WhatsApp Active)
                </label>
                <button
                  type="button"
                  title="Dictate Phone Number"
                  onClick={() =>
                    setActiveFieldDictation(activeFieldDictation === 'caretakerPhone' ? null : 'caretakerPhone')
                  }
                  className={`p-1 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                    activeFieldDictation === 'caretakerPhone'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800'
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  <span className="text-[10px] font-semibold">
                    {activeFieldDictation === 'caretakerPhone' ? 'Listening...' : 'Speak'}
                  </span>
                </button>
              </div>
              <input
                type="tel"
                required
                value={caretakerPhone}
                onChange={(e) => setCaretakerPhone(e.target.value)}
                placeholder="+254 712 345 678"
                className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-sm text-slate-800 ${
                  activeFieldDictation === 'caretakerPhone'
                    ? 'border-rose-500 ring-2 ring-rose-300'
                    : voiceFilledFields.caretakerPhone
                    ? 'border-emerald-500 bg-emerald-50/20'
                    : 'border-slate-300'
                }`}
              />
            </div>

            {/* Water Infrastructure */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                <span>Water Infrastructure</span>
              </label>
              <select
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
                className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-sm text-slate-800 ${
                  voiceFilledFields.waterSource ? 'border-emerald-500 bg-emerald-50/20 font-semibold' : 'border-slate-300'
                }`}
              >
                <option value="24/7 Borehole">24/7 Borehole (Constant)</option>
                <option value="Kanjo + Borehole Backup">Kanjo + Borehole Backup</option>
                <option value="Kanjo Scheduled">Kanjo Scheduled Days Only</option>
                <option value="Water Tanker Only">Water Tanker Delivery</option>
              </select>
            </div>

            {/* Power / Electricity */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Electricity Metering</span>
              </label>
              <select
                value={powerType}
                onChange={(e) => setPowerType(e.target.value)}
                className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-sm text-slate-800 ${
                  voiceFilledFields.powerType ? 'border-emerald-500 bg-emerald-50/20 font-semibold' : 'border-slate-300'
                }`}
              >
                <option value="Individual KPLC Token">Individual KPLC Prepaid Token Meter</option>
                <option value="Shared Sub-meter">Shared Sub-meter (Billed per unit)</option>
                <option value="Fixed Monthly">Fixed Monthly Fee</option>
              </select>
            </div>

            {/* Nearest Stage */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Bus className="w-3.5 h-3.5 text-slate-600" />
                  <span>Nearest Matatu Stage</span>
                </label>
                <button
                  type="button"
                  title="Dictate Nearest Stage"
                  onClick={() =>
                    setActiveFieldDictation(activeFieldDictation === 'nearestStage' ? null : 'nearestStage')
                  }
                  className={`p-1 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                    activeFieldDictation === 'nearestStage'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800'
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  <span className="text-[10px] font-semibold">
                    {activeFieldDictation === 'nearestStage' ? 'Listening...' : 'Speak'}
                  </span>
                </button>
              </div>
              <input
                type="text"
                value={nearestStage}
                onChange={(e) => setNearestStage(e.target.value)}
                placeholder="e.g. Lumumba Stage / TRM"
                className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-sm text-slate-800 ${
                  activeFieldDictation === 'nearestStage'
                    ? 'border-rose-500 ring-2 ring-rose-300'
                    : voiceFilledFields.nearestStage
                    ? 'border-emerald-500 bg-emerald-50/20'
                    : 'border-slate-300'
                }`}
              />
            </div>

            {/* Walking Minutes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Walking Time to Stage (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={walkMinutes}
                onChange={(e) => setWalkMinutes(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800"
              />
            </div>
          </div>

          {/* Water Schedule Details */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Water Notes &amp; Tank Storage
              </label>
              <button
                type="button"
                title="Dictate Water Notes"
                onClick={() =>
                  setActiveFieldDictation(activeFieldDictation === 'waterNotes' ? null : 'waterNotes')
                }
                className={`p-1 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                  activeFieldDictation === 'waterNotes'
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800'
                }`}
              >
                <Mic className="w-3 h-3" />
                <span className="text-[10px] font-semibold">
                  {activeFieldDictation === 'waterNotes' ? 'Listening...' : 'Speak'}
                </span>
              </button>
            </div>
            <input
              type="text"
              value={waterNotes}
              onChange={(e) => setWaterNotes(e.target.value)}
              placeholder="e.g. Borehole runs daily with 15,000L rooftop tanks"
              className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-sm text-slate-800 ${
                activeFieldDictation === 'waterNotes'
                  ? 'border-rose-500 ring-2 ring-rose-300'
                  : voiceFilledFields.waterNotes
                  ? 'border-emerald-500 bg-emerald-50/20'
                  : 'border-slate-300'
              }`}
            />
          </div>

          {/* Anti-Scam Zero Viewing Fee Agreement */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-0.5">Free Caretaker Viewing Commitment</strong>
              By onboarding this unit, you confirm that prospective tenants can view the house freely with the caretaker without any upfront viewing fee.
            </div>
          </div>

          <div className="flex items-center justify-between pt-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              &larr; Back
            </button>

            <button
              id="intake-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Publishing &amp; Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Verified Vacancy</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Success Confirmation & Automated Cadence */}
      {step === 3 && successListing && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
              Unit Successfully Onboarded &amp; Verified!
            </h3>
            <p className="text-sm text-slate-500">
              {successListing.title} is now visible to active tenants searching in {successListing.estate}.
            </p>
          </div>

          {/* TCO Summary Box */}
          <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
            <div className="flex justify-between font-bold text-slate-900 text-sm pb-1 border-b border-slate-200">
              <span>{successListing.buildingName}</span>
              <span className="text-emerald-700">KES {successListing.monthlyRent.toLocaleString()} / mo</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Move-In TCO Cash Required:</span>
              <strong className="text-slate-900">KES {successListing.tco.totalMoveInCost.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Caretaker Contact:</span>
              <strong className="text-slate-900">{successListing.assignedAgentOrCaretaker.phone}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Water &amp; Power:</span>
              <span>{successListing.waterInfrastructure.source} • {successListing.electricity.type}</span>
            </div>
          </div>

          {/* Automated WhatsApp Cadence Notice */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 max-w-md mx-auto text-left flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Automated Freshness Cadence:</strong>
              The system will automatically ping caretaker {successListing.assignedAgentOrCaretaker.name} every 3 days via WhatsApp: <em>&quot;Bado iko vacant?&quot;</em> to maintain verified status.
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setStep(1);
                setSuccessListing(null);
                setBuildingName('');
                setPreviewImage(null);
                setVoiceParsedSummary(null);
                setVoiceFilledFields({});
              }}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Onboard Another Vacant Keja
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
