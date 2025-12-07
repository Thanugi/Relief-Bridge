import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
];

const LanguageSelector = () => {
  const [selectedLang, setSelectedLang] = useState('en');

  useEffect(() => {
    // Load Google Translate script only once
    if (document.getElementById('google-translate-script')) return;

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,si,ta',
          autoDisplay: false,
        },
        'google_translate_element'
      );

      // Prevent React strict-mode + Google Translate conflict
      const originalRemoveChild = Node.prototype.removeChild;
      const originalReplaceChild = Node.prototype.replaceChild;
      const originalInsertBefore = Node.prototype.insertBefore;
      const originalAppendChild = Node.prototype.appendChild;

      // @ts-ignore – we are monkey-patching DOM safely
      Node.prototype.removeChild = function (child) {
        try {
          return originalRemoveChild.call(this, child);
        } catch (e) {
          // Silently ignore the error that Google Translate causes
          return child;
        }
      };

      // Same for other methods Google messes with
      // @ts-ignore
      Node.prototype.replaceChild = function (newChild, oldChild) {
        try {
          return originalReplaceChild.call(this, newChild, oldChild);
        } catch (e) {
          return oldChild;
        }
      };

      // @ts-ignore
      Node.prototype.insertBefore = function (newNode, referenceNode) {
        try {
          return originalInsertBefore.call(this, newNode, referenceNode);
        } catch (e) {
          return newNode;
        }
      };

      // @ts-ignore
      Node.prototype.appendChild = function (child) {
        try {
          return originalAppendChild.call(this, child);
        } catch (e) {
          return child;
        }
      };

      const syncLanguage = () => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (select && select.value && select.value !== selectedLang) {
          setSelectedLang(select.value);
        }
      };

      // Watch for changes in the hidden Google <select>
      const observer = new MutationObserver(syncLanguage);
      const checkInterval = setInterval(syncLanguage, 300); // fallback

      // Start observing the hidden select
      const googleSelect = document.querySelector('.goog-te-combo');
      if (googleSelect) {
        observer.observe(googleSelect, { attributes: true, attributeFilter: ['value'] });
        syncLanguage(); // initial check
      }

      // Also sync on manual change (your button click)
      document.addEventListener('change', (e) => {
        if ((e.target as HTMLElement)?.classList.contains('goog-te-combo')) {
          syncLanguage();
        }
      });

      return () => {
        observer.disconnect();
        clearInterval(checkInterval);
      };
    };
  }, []);

  const changeLanguage = (lang: string) => {
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select && select.value !== lang) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    }
    // No need to setSelectedLang here — the observer above will catch it!
  };

  const currentLang = languages.find((l) => l.code === selectedLang) || languages[0];

  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }} />

      <div className="relative group">
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:px-4 sm:py-2.5 sm:gap-3"
        >
          <Globe className="w-5 h-5 text-gray-600" />
          <span className="hidden sm:inline">
            {currentLang.flag} {currentLang.name}
          </span>
          <span className="sm:hidden">
            {currentLang.flag}
          </span>
        </button>

        {/* Dropdown menu */}
        <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible scale-95 transition-all duration-200 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:visible group-focus-within:scale-100 group-focus-within:pointer-events-auto z-50">
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center gap-3 w-full px-4 py-3 text-left text-gray-800 hover:bg-blue-50 transition-colors ${
                  selectedLang === lang.code ? 'bg-blue-50 font-semibold' : ''
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                {/* ← THIS IS THE FIX: Add class="notranslate" to prevent Google from translating */}
                <span className="notranslate">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LanguageSelector;
