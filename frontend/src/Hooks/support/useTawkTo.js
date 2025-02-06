import { useEffect } from 'react';

const useTawkTo = () => {
  useEffect(() => {
    var Tawk_API = window.Tawk_API || {};
    var Tawk_LoadStart = new Date();

    const loadTawkTo = () => {
      var s1 = document.createElement("script");
      var s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/679d5d473a842732607862aa/1iivb8o0r';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    };

    loadTawkTo();

    return () => {
      // Cleanup if needed
      const tawkScript = document.querySelector('script[src*="embed.tawk.to"]');
      if (tawkScript) {
        tawkScript.remove();
      }
    };
  }, []);
};

export default useTawkTo;