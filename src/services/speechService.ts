export const speechService = {
  speak(text: string, rate: number = 0.9, pitch: number = 1.1) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = rate; // Pédagogique (un peu plus lent)
    utterance.pitch = pitch; // Plus doux/enfantin

    // Try to find a sweet female voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('fr') && (v.name.includes('Julie') || v.name.includes('Hortense') || v.name.includes('Google')));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
    return utterance;
  },

  pause() {
    window.speechSynthesis.pause();
  },

  resume() {
    window.speechSynthesis.resume();
  },

  stop() {
    window.speechSynthesis.cancel();
  }
};
