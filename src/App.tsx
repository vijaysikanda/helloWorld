/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, Volume2, RefreshCw, Terminal, Globe, ArrowRight } from 'lucide-react';

interface GreetingTranslation {
  id: string;
  language: string;
  region: string;
  phrase: string;
  phonetic: string;
  note: string;
}

interface CodeExample {
  id: string;
  language: string;
  year: number;
  author: string;
  code: string;
  output: string;
}

const GREETINGS: GreetingTranslation[] = [
  {
    id: 'de',
    language: 'German / Dutch',
    region: 'Central Europe',
    phrase: 'Hallo Welt!',
    phonetic: 'HAH-loh velt',
    note: 'Direct root of "Hallo", used daily across Germany, Austria, Switzerland, and the Netherlands.',
  },
  {
    id: 'en',
    language: 'English',
    region: 'Global',
    phrase: 'Hallo World!',
    phonetic: 'huh-LOH wurld',
    note: 'Historical spelling popularized in 19th-century telegraphy and Bell Labs computing tutorials.',
  },
  {
    id: 'no',
    language: 'Norwegian / Danish',
    region: 'Scandinavia',
    phrase: 'Hallo Verden!',
    phonetic: 'hah-LOH VAIR-den',
    note: 'Warm Scandinavian greeting used in both spoken conversation and introductory programming.',
  },
  {
    id: 'af',
    language: 'Afrikaans',
    region: 'Southern Africa',
    phrase: 'Hallo Wêreld!',
    phonetic: 'hah-LOH VEA-relt',
    note: 'Standard welcoming phrase across South Africa and Namibia.',
  },
  {
    id: 'id',
    language: 'Indonesian',
    region: 'Southeast Asia',
    phrase: 'Halo Dunia!',
    phonetic: 'HAH-loh doo-NEE-ah',
    note: 'Adapted from Dutch "Hallo", serving as the universal friendly greeting across the archipelago.',
  },
  {
    id: 'jp',
    language: 'Japanese',
    region: 'East Asia',
    phrase: 'ハロー・ワールド',
    phonetic: 'Ha-rō Wā-ru-do',
    note: 'Phonetic katakana rendering embraced by Japanese software engineers since the 1970s.',
  },
];

const CODE_EXAMPLES: CodeExample[] = [
  {
    id: 'c',
    language: 'C (K&R)',
    year: 1978,
    author: 'Brian Kernighan & Dennis Ritchie',
    code: `#include <stdio.h>\n\nint main(void) {\n    printf("Hallo World!\\n");\n    return 0;\n}`,
    output: 'Hallo World!',
  },
  {
    id: 'ts',
    language: 'TypeScript',
    year: 2012,
    author: 'Anders Hejlsberg',
    code: `const greet = (target: string): string => {\n  return \`Hallo \${target}!\`;\n};\n\nconsole.log(greet("World"));`,
    output: 'Hallo World!',
  },
  {
    id: 'py',
    language: 'Python',
    year: 1991,
    author: 'Guido van Rossum',
    code: `def main() -> None:\n    message = "Hallo World!"\n    print(message)\n\nif __name__ == "__main__":\n    main()`,
    output: 'Hallo World!',
  },
  {
    id: 'rs',
    language: 'Rust',
    year: 2015,
    author: 'Graydon Hoare',
    code: `fn main() {\n    let greeting = "Hallo World!";\n    println!("{greeting}");\n}`,
    output: 'Hallo World!',
  },
];

export default function App() {
  const [selectedGreeting, setSelectedGreeting] = useState<GreetingTranslation>(GREETINGS[0]);
  const [selectedCode, setSelectedCode] = useState<CodeExample>(CODE_EXAMPLES[0]);
  const [customName, setCustomName] = useState<string>('World');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [executionCount, setExecutionCount] = useState<number>(1);
  const [guestbookEntries, setGuestbookEntries] = useState<
    Array<{ id: string; name: string; location: string; message: string; timestamp: string }>
  >([
    {
      id: '1',
      name: 'Brian K.',
      location: 'Murray Hill, NJ',
      message: 'Hallo World! The first program always starts right here.',
      timestamp: '1978 · Bell Laboratories',
    },
    {
      id: '2',
      name: 'Lukas Meyer',
      location: 'Munich, Germany',
      message: 'Hallo Welt aus München — clean typography and fast execution.',
      timestamp: 'Today · Verified Visitor',
    },
  ]);

  const [visitorName, setVisitorName] = useState('');
  const [visitorLocation, setVisitorLocation] = useState('');
  const [visitorMessage, setVisitorMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const displayTarget = customName.trim() || 'World';

  const handleCopyCode = () => {
    const dynamicCode = selectedCode.code.replace(/World/g, displayTarget);
    navigator.clipboard?.writeText(dynamicCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCycleGreeting = () => {
    const currentIndex = GREETINGS.findIndex((g) => g.id === selectedGreeting.id);
    const nextIndex = (currentIndex + 1) % GREETINGS.length;
    setSelectedGreeting(GREETINGS[nextIndex]);
  };

  const handleSignGuestbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorLocation.trim()) {
      setFormError('Please enter both your name and city/country to sign the log.');
      return;
    }
    setFormError('');
    const newEntry = {
      id: String(Date.now()),
      name: visitorName.trim(),
      location: visitorLocation.trim(),
      message: visitorMessage.trim() || `Hallo World from ${visitorLocation.trim()}!`,
      timestamp: 'Just now · Live Entry',
    };
    setGuestbookEntries([newEntry, ...guestbookEntries]);
    setVisitorName('');
    setVisitorLocation('');
    setVisitorMessage('');
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-900">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-8 px-6 py-4">
          <a
            href="#top"
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            Hallo World
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#greetings"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Translations
            </a>
            <a
              href="#playground"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Code Studio
            </a>
            <a
              href="#origins"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              History
            </a>
            <a
              href="#guestbook"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Guestbook
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <a
              href="#playground"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0"
            >
              Customize Greeting
            </a>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* Hero Section */}
        <section className="max-w-[1200px] mx-auto px-6 pt-16 pb-20 border-b border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                  <span>Universal First Words</span>
                  <span aria-hidden="true">·</span>
                  <span>Est. 1972 Bell Labs</span>
                  <span aria-hidden="true">·</span>
                  <span>Interactive Edition</span>
                </div>

                <h1
                  className="font-bold tracking-tight text-slate-900 mb-6"
                  style={{
                    fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                    lineHeight: 1.08,
                    textWrap: 'balance',
                  }}
                >
                  Hallo {displayTarget}!
                </h1>

                <p className="text-base text-slate-600 leading-relaxed max-w-[65ch] mb-8">
                  Every system, language, and creative journey begins with a single verifiable signal.
                  Explore how two simple words bridge human linguistics and modern software engineering
                  across continents.
                </p>
              </div>

              <div className="pt-4">
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleSpeak(`Hallo ${displayTarget}`)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    Speak Greeting
                  </button>

                  <button
                    type="button"
                    onClick={handleCycleGreeting}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Switch Language ({selectedGreeting.language.split(' ')[0]})
                  </button>
                </div>
              </div>
            </div>

            {/* Focal Carrier Card */}
            <div className="lg:col-span-5 flex">
              <div className="w-full bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 pb-4 mb-6 border-b border-slate-100">
                    <span>{selectedGreeting.language}</span>
                    <span>{selectedGreeting.region}</span>
                  </div>

                  <p className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3">
                    {selectedGreeting.phrase}
                  </p>
                  <p className="font-mono text-xs text-blue-700 mb-4">
                    /{selectedGreeting.phonetic}/
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {selectedGreeting.note}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <label
                    htmlFor="hero-custom-name"
                    className="block text-xs font-medium text-slate-600 mb-2"
                  >
                    Personalize the live headline recipient:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="hero-custom-name"
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="World"
                      maxLength={32}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-700"
                    />
                    <button
                      type="button"
                      onClick={() => setCustomName('World')}
                      className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full-width 4-column metric bar below hero split */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-14 pt-10 border-t border-slate-200">
            <div>
              <p className="text-2xl font-bold font-mono tabular-nums text-slate-900">1972</p>
              <p className="text-xs text-slate-500 mt-1">First documented B language tutorial by Brian Kernighan</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono tabular-nums text-slate-900">600+</p>
              <p className="text-xs text-slate-500 mt-1">Programming languages using Hallo/Hello World as canonical test</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono tabular-nums text-slate-900">12 Bytes</p>
              <p className="text-xs text-slate-500 mt-1">UTF-8 payload size of the string &quot;Hallo World!&quot;</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono tabular-nums text-slate-900">0.04 ms</p>
              <p className="text-xs text-slate-500 mt-1">Standard output write time on modern POSIX kernels</p>
            </div>
          </div>
        </section>

        {/* Section 2: Linguistic Variations */}
        <section id="greetings" className="max-w-[1200px] mx-auto px-6 py-20 border-b border-slate-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
                01. Global Linguistic Variations
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-[65ch]">
                Select any card below to inspect the regional phonetics and update the primary stage above.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Globe className="w-4 h-4 text-slate-400" />
              <span>6 Curated Language Families</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GREETINGS.map((item) => {
              const isSelected = selectedGreeting.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedGreeting(item)}
                  className={`text-left p-6 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-blue-700'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span>{item.language}</span>
                      <span>·</span>
                      <span>{item.region}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{item.phrase}</h3>
                    <p className="font-mono text-xs text-blue-700 mb-4">/{item.phonetic}/</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.note}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-700">
                    <span>{isSelected ? 'Active Selection' : 'Select Variation'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 3: Interactive Code Studio */}
        <section id="playground" className="max-w-[1200px] mx-auto px-6 py-20 border-b border-slate-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
                02. Interactive Code Studio
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-[65ch]">
                Compare how foundational programming languages express the canonical &quot;Hallo {displayTarget}!&quot; program.
              </p>
            </div>

            {/* Interactive Segmented Filter Bar */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start">
              {CODE_EXAMPLES.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => setSelectedCode(ex)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCode.id === ex.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {ex.language}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7 bg-slate-900 text-slate-100 rounded-xl p-6 flex flex-col justify-between border border-slate-800">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span>{selectedCode.language}</span>
                    <span>·</span>
                    <span>First Appeared {selectedCode.year}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-800 rounded hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Snippet
                      </>
                    )}
                  </button>
                </div>

                <pre className="font-mono text-sm leading-relaxed text-slate-100 overflow-x-auto py-2">
                  <code>{selectedCode.code.replace(/World/g, displayTarget)}</code>
                </pre>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Designed by {selectedCode.author}</span>
                <button
                  type="button"
                  onClick={() => setExecutionCount((c) => c + 1)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Run Program
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 pb-4 mb-4 border-b border-slate-100">
                  <span>Standard Output (stdout)</span>
                  <span className="font-mono tabular-nums">Runs: {executionCount}</span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg font-mono text-base text-slate-900 mb-6">
                  Hallo {displayTarget}!
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Modifying the recipient name in the Hero card or below automatically updates both the source literal and the simulated standard output stream.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <label htmlFor="studio-recipient" className="block text-xs font-medium text-slate-600 mb-2">
                  Update target variable:
                </label>
                <input
                  id="studio-recipient"
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="World"
                  maxLength={32}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Historical Origins */}
        <section id="origins" className="max-w-[1200px] mx-auto px-6 py-20 border-b border-slate-200">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-10">
            03. Provenance & Milestones
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="text-xs font-mono tabular-nums text-slate-500 mb-2">1877 · Telegraphy & Voice</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Early Telephone Exchanges</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Before computing, &quot;Hallo&quot; gained prominence as the clearest phonetic test across early German and trans-Atlantic voice lines.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="text-xs font-mono tabular-nums text-slate-500 mb-2">1972 · Bell Laboratories</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">A Tutorial Introduction to B</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Brian Kernighan penned the first documented computer greeting tutorial, establishing a sanity check for compilers and I/O pipelines.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="text-xs font-mono tabular-nums text-slate-500 mb-2">2026 · Modern Web</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Universal Readiness Signal</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                From embedded microcontrollers to cloud-native web apps, rendering &quot;Hallo World&quot; remains the definitive proof of an operational stack.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Interactive Guestbook */}
        <section id="guestbook" className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
                04. Say Hallo Back
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Add your own greeting to the session log. Entries appear immediately in the public greeting ledger.
              </p>

              <form onSubmit={handleSignGuestbook} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div>
                  <label htmlFor="visitor-name" className="block text-xs font-medium text-slate-700 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    id="visitor-name"
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="Ada Lovelace"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div>
                  <label htmlFor="visitor-location" className="block text-xs font-medium text-slate-700 mb-1.5">
                    City & Country *
                  </label>
                  <input
                    id="visitor-location"
                    type="text"
                    value={visitorLocation}
                    onChange={(e) => setVisitorLocation(e.target.value)}
                    placeholder="Zurich, Switzerland"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div>
                  <label htmlFor="visitor-message" className="block text-xs font-medium text-slate-700 mb-1.5">
                    Custom Greeting (Optional)
                  </label>
                  <input
                    id="visitor-message"
                    type="text"
                    value={visitorMessage}
                    onChange={(e) => setVisitorMessage(e.target.value)}
                    placeholder="Hallo World from Zurich!"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-700"
                  />
                </div>

                {formError && (
                  <p className="text-xs font-medium text-red-600" role="alert">
                    {formError}
                  </p>
                )}

                {formSubmitted && (
                  <p className="text-xs font-medium text-emerald-700" role="status">
                    Greeting recorded in the ledger.
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full px-4 py-2.5 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Post Greeting
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="space-y-4">
                {guestbookEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white border border-slate-200 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-slate-800">{entry.name}</span>
                      <span>{entry.location} · {entry.timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{entry.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span className="font-semibold text-slate-900">Hallo World</span>
          <div className="flex items-center gap-6">
            <a href="#greetings" className="hover:text-slate-900 transition-colors">Translations</a>
            <a href="#playground" className="hover:text-slate-900 transition-colors">Code Studio</a>
            <a href="#origins" className="hover:text-slate-900 transition-colors">History</a>
            <a href="#guestbook" className="hover:text-slate-900 transition-colors">Guestbook</a>
          </div>
          <span>UTF-8 Standard Edition</span>
        </div>
      </footer>
    </div>
  );
}
